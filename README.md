# x6 vue 最佳实践
<a href="https://www.npmjs.com/package/vue-x6-graph"><img alt="NPM Package" src="https://img.shields.io/npm/v/vue-x6-graph.svg?style=flat-square"></a>
![npm bundle size](https://img.shields.io/bundlephobia/minzip/vue-x6-graph?style=flat-square)
![npm](https://img.shields.io/npm/dm/vue-x6-graph?style=flat-square)
<a href="/LICENSE"><img src="https://img.shields.io/github/license/lloydzhou/antv-x6-vue-practice?style=flat-square" alt="MIT License"></a>

提供一个vue下使用X6的最佳范本：
1. 将函数式的X6Graph组件化
2. 简单易用，易于做逻辑拆分  
3. 支持多实例  
4. 方便在自己的组件中管理图数据  
5. 自动检测图数据变化，并增量更新到x6画布  
6. 内部使用batchUpdate优化性能

## 安装
```
npm install vue-x6-graph
yarn add vue-x6-graph
```

## 在线demo


## 设计

[参考react版项目](https://github.com/lloydzhou/antv-x6-react-practice#%E8%AE%BE%E8%AE%A1)

## 使用Graph组件

[示例](https://github.com/lloydzhou/antv-x6-vue-practice/blob/master/src/Graph1.vue#L2)

1. 直接在模板里面使用Graph组件
2. 子组件内使用useGraphInstance拿到x6的graph对象，可以通过这个对象直接操作画布（增加监听，或者添加节点等）

## 使用hook

[示例](https://github.com/lloydzhou/antv-x6-vue-practice/blob/master/src/Graph.vue#L5)

1. 调用 useGraphState 拿到数据（`nodes`, `edges`, `graph`）,以及更新数据的方法（`setNodes`, `setEdges`, `setGraph`）

```
const { nodes, setNodes, edges, setEdges, graph, setGraph } = useGraphState()
```

2. 创建x6画布之后调用setGraph设置当前画布
3. 在某些事件内调用setNodes或者setEdges更新数据
4. nodes和edges是reactive的，数据变化的时候，内部能自动diff在运行一个内置的patch方法将数据变动更新到画布上面



