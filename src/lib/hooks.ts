// @ts-nocheck
import { watch, ref, onMounted, shallowReactive, markRaw } from 'vue'
import { diffCells, patch, checkId } from './utils'

export const useGraphState = (initState = {}) => {
  const { nodes: n, edges: e } = initState;
  const graph = ref()
  const state = shallowReactive({
    nodes: markRaw([]),
    edges: markRaw([]),
    graph,
    setGraph: (g) => g && (graph.value = g),
    // state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
    setNodes: (_nodes) => state.nodes = _nodes.map(checkId),
    setEdges: (_edges) => state.edges = _edges.map(checkId),
  })

  // 先使用diffCells拿到变化数据，再使用patch函数更新数据到x6画布
  watch(() => ({
    nodes: diffCells(graph.value, state.nodes, 'node'),
    edges: diffCells(graph.value, state.edges, 'edge'),
  }), ({nodes, edges}) => {
    patch(graph.value, nodes)
    patch(graph.value, edges)
  })


  onMounted(() => { state.setGraph(initState.g) })

  return state
};
