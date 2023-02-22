import type { Graph, Node, Edge } from '@antv/x6'
import { watch, onMounted, shallowRef } from 'vue'
import { diffCells, patch, checkId } from './utils'

type GraphState = {nodes?: Node.Metadata[], edges?: Edge.Metadata[], graph?: Graph}

export const useGraphState = (initState: GraphState = {}) => {
  const nodes = shallowRef(initState.nodes || [])
  const edges = shallowRef(initState.edges || [])
  const graph = shallowRef(initState.graph || null)
  const setGraph = (g: Graph) => g && (graph.value = g)
  const eventName = 'update:state'
  // 注册一个自定义事件，patch完成后触发
  const returnPromise = (execute: () => void) => {
    return new Promise((resolve) => {
      if (graph.value) {
        graph.value.once(eventName, resolve)
      }
      execute()
    })
  }
  // 设置数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
  const setNodes = (_nodes: Node.Metadata[]) => returnPromise(() => nodes.value = _nodes.map(checkId))
  const setEdges = (_edges: Edge.Metadata[]) => returnPromise(() => edges.value = _edges.map(checkId))

  // 先使用diffCells拿到变化数据，再使用patch函数更新数据到x6画布
  watch(() => ({
    nodes: diffCells(graph.value, nodes.value, 'node'),
    edges: diffCells(graph.value, edges.value, 'edge'),
  }), ({nodes, edges}) => {
    patch(graph.value, nodes)
    patch(graph.value, edges)
    if (graph.value) {
      graph.value.trigger(eventName)
    }
  })

  return {
    nodes,
    edges,
    graph,
    setNodes,
    setEdges,
    setGraph
  }
};
