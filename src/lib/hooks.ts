import type { Graph, Node, Edge } from '@antv/x6'
import { watch, shallowRef, onMounted, shallowReactive, markRaw } from 'vue'
import { diffCells, patch, checkId } from './utils'

type GraphState = {nodes?: Node.Metadata[], edges?: Edge.Metadata[], g?: Graph}

export const useGraphState = (initState: GraphState = {}) => {
  const { nodes: n = [], edges: e = [], g = null } = initState;
  const graph = shallowRef<Graph | null>(g)
  const state = shallowReactive({
    nodes: markRaw<Node.Metadata[]>(n),
    edges: markRaw<Edge.Metadata[]>(e),
    graph,
    setGraph: (g: Graph) => g && (graph.value = g),
    // state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
    setNodes: (_nodes: Node.Metadata[]) => state.nodes = _nodes.map(checkId),
    setEdges: (_edges: Edge.Metadata[]) => state.edges = _edges.map(checkId),
  })

  // 先使用diffCells拿到变化数据，再使用patch函数更新数据到x6画布
  watch(() => ({
    nodes: diffCells(graph.value, state.nodes, 'node'),
    edges: diffCells(graph.value, state.edges, 'edge'),
  }), ({nodes, edges}) => {
    patch(graph.value, nodes)
    patch(graph.value, edges)
  })

  return state
};
