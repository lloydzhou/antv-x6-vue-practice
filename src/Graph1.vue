<template>
  <Graph grid snapline keyboard clipboard :width="600" :height="400">
    <AddNodeBehavior />
    <EventBehavior />
    <p>1. 使用组件模式</p>
    <p>2. 子组件使用useGraphInstance获取graph对象</p>
    <p>3. 使用graph对象监听事件或者更新画布</p>
  </Graph>
</template>

<script lang="ts">
// @ts-nocheck
import { h, defineComponent, onMounted, ref } from 'vue'
import { Graph, useGraphInstance, contextSymbol } from './lib'

const EventBehavior = defineComponent({
  name: 'EventBehavior',
  inject: [contextSymbol],
  setup() {
    const { graph } = useGraphInstance()

    onMounted(() => {
      console.log('onMounted', graph)
      const cb = (name: string, args: any) => console.log(name, args);
      const added = cb.bind(null, 'cell:added');
      const removed = cb.bind(null, 'cell:removed');
      const change = cb.bind(null, 'cell:change');
      graph.on('cell:added', added);
      graph.on('cell:removed', removed);
      graph.on('cell:change:*', change);
    })
    onUnmounted(() => {
      // 移除监听      
      graph.off('cell:added', added);
      graph.off('cell:removed', removed);
      graph.off('cell:change:*', change);
    })

    return () => null
  }
})

const AddNodeBehavior = defineComponent({
  name: 'AddNodeBehavior',
  inject: [contextSymbol],
  setup() {
    const { graph } = useGraphInstance()
    const count = ref(1)
    const add = () => {
      console.log('add', count.value, graph)
      graph.addNode({
        x: 200 + count.value * 20,
        y: 200 + count.value * 20,
        width: 80, height: 40,
        label: `label ${count.value}`
      })
      count.value = count.value + 1
    }

    return () => h('button', {onClick: add}, "添加节点")
  }
})

export default defineComponent({
  components: { Graph, EventBehavior, AddNodeBehavior },
})

</script>
