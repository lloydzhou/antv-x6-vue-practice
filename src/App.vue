<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Graph, useGraphState } from './lib'

const gRef = ref()

onMounted(() => {
  console.log('onMounted', gRef)
  const { setNodes, setEdges, graph  } = gRef.value
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


</script>

<template>
  <main>
    <Graph grid resizing snapline keyboard clipboard :width="800" :height="600" ref="gRef">
      <div>hello</div>
    </Graph>
  </main>
</template>

<style scoped>
main {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 600px;
}
</style>
