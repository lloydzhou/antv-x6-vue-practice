<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from 'vue'
import { Graph, useGraphState } from './lib'

const { nodes, setNodes, edges, setEdges, graph, setGraph } = useGraphState()

// 在onMounted里面使用setGraph
const gRef = ref()

onMounted(() => {
  console.log('onMounted', gRef)
  setGraph(gRef.value.graph)
  const { graph } = gRef.value

  setNodes([
    {
      id: 'node1', // String，可选，节点的唯一标识
      x: 40,       // Number，必选，节点位置的 x 值
      y: 40,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'hello', // String，节点标签
      ports: [{ id: 'port1' }],
    },
    {
      id: 'node2', // String，节点的唯一标识
      x: 160,      // Number，必选，节点位置的 x 值
      y: 180,      // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'world', // String，节点标签
      ports: [{ id: 'port1' }],
    },
  ]);
  setEdges([
    {
      source: 'node1', // String，必须，起始节点 id
      target: 'node2', // String，必须，目标节点 id
    },
  ]);

  const cb = (name: string, args: any) => console.log(name, args);
  const added = cb.bind(null, 'cell:added');
  const removed = cb.bind(null, 'cell:removed');
  const change = cb.bind(null, 'cell:change');
  graph.on('cell:added', added);
  graph.on('cell:removed', removed);
  graph.on('cell:change:*', change);
  // 移除监听      
  return () => {   
    graph.off('cell:added', added);
    graph.off('cell:removed', removed);
    graph.off('cell:change:*', change);
  };
})

let count = 0
const addNode = () => {
  const target = `node_${++count}`
  setNodes([
    ...nodes.value,
    {
      id: target,
      label: `label ${++count}`,
      x: 200 + count * 20,
      y: 80 + count * 10,
      width: 80,
      height: 40
    }
  ]).then(() => {
    console.log('addNode success')
  })
  setEdges([
    ...edges.value,
    { source: 'node2', target }
  ]).then(() => {
    console.log('addEdge success')
  })
}

</script>

<template>
  <Graph grid snapline keyboard clipboard :width="600" :height="400" ref="gRef">
    <button @click="addNode">添加节点</button>
    <p>1. 使用useGraphState在组件内部管理数据</p>
    <p>2. 使用setGraph设置画布对象（可自己new一个X6.Graph对象，也可使用vue-x6-graph导出Graph配合ref拿到图对象）</p>
    <p>3. 使用setNodes/setEdges更新数据，自动同步到x6画布</p>
  </Graph>
</template>

<style scoped>
main {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
