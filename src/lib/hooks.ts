import type { Graph, Node, Edge } from '@antv/x6'
import { watch, toRefs, onMounted, shallowReactive } from 'vue'
import { diffCells, patch, checkId } from './utils'

type GraphState = {nodes?: Node.Metadata[], edges?: Edge.Metadata[], graph?: Graph}

export const useGraphState = (initState: GraphState = {}) => {
  const { nodes = [], edges = [], graph } = initState;
  const state = shallowReactive({
    nodes,
    edges,
    graph
  })
  const methods = {
    setGraph: (g: Graph) => g && (state.graph = g),
    // state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
    setNodes: (_nodes: Node.Metadata[]) => state.nodes = _nodes.map(checkId),
    setEdges: (_edges: Edge.Metadata[]) => state.edges = _edges.map(checkId),
  }

  // 先使用diffCells拿到变化数据，再使用patch函数更新数据到x6画布
  watch(() => ({
    nodes: diffCells(state.graph, state.nodes, 'node'),
    edges: diffCells(state.graph, state.edges, 'edge'),
  }), ({nodes, edges}) => {
    patch(state.graph, nodes)
    patch(state.graph, edges)
  })

  return {
    ...toRefs(state),
    ...methods,
  }
};
