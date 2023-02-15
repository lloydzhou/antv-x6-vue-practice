// @ts-nocheck
import { Node, Edge, StringExt, ObjectExt } from '@antv/x6';
import { watch, onMounted, shallowReactive, markRaw } from 'vue'

const diffCells = (graph, cells = [], type = 'node') => {
  const create = [];
  const update = [];
  const remove = [];
  if (graph) {
    const Ctor = type === 'node' ? Node.create : Edge.create;
    cells.forEach((c) => {
      const cell = graph.getCellById(c.id);
      if (cell) {
        // 这里尝试重新调用一下create，然后通过setProp，直接将新创建的放进去
        const t = Ctor(c);
        const prop = t.getProp();
        t.dispose();
        if (!ObjectExt.isEqual(cell.getProp(), prop)) {
          update.push([cell, prop]);
        }
      } else {
        create.push(Ctor(c));
      }
    });
    const cellIds = new Set(cells.map((c) => c.id));
    const items = type === 'node' ? graph.getNodes() : graph.getEdges();
    items.forEach((cell) => {
      if (!cellIds.has(cell.id)) {
        remove.push(cell.id);
      }
    });
  }
  return { create, update, remove };
};
const patch = (graph, data) => {
  const { create = [], update = [], remove = [] } = data;
  // console.log('patch', create, update, remove)
  if (graph) {
    graph.batchUpdate('update', () => {
      graph.addCell(create);
      update.forEach(([cell, prop]) => {
        // 直接一次性更新全部的prop可能导致部分属性更新不成功 cell.setProp(prop)
        Object.keys(prop).forEach((key) => cell.setProp(key, prop[key]));
      });
      remove.forEach((item) => graph.removeCell(item));
    }, data);
  }
};

// 如果没有id就添加一个
const checkId = (metadata) => ({ ...metadata, id: metadata.id || StringExt.uuid() });

export const useGraphState = (initState = {}) => {
  const { nodes: n, edges: e } = initState;
  const state = shallowReactive({
    nodes: markRaw([]),
    edges: markRaw([]),
    graph: null,
    setGraph: (g) => g && (state.graph = g),
    // state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
    setNodes: (_nodes) => state.nodes = _nodes.map(checkId),
    setEdges: (_edges) => state.edges = _edges.map(checkId),
  })

  // 先使用diffCells拿到变化数据，再使用patch函数更新数据到x6画布
  watch(() => diffCells(state.graph, state.nodes, 'node'), diffNodes => patch(state.graph, diffNodes))
  watch(() => diffCells(state.graph, state.nodes && state.edges, 'edge'), diffEdges => patch(state.graph, diffEdges))


  onMounted(() => { state.setGraph(initState.g) })

  return state
};
export default useGraphState;
