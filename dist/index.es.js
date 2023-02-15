import { shallowReactive as b, markRaw as f, watch as m, onMounted as G, inject as C, defineComponent as S, ref as w, provide as N, createVNode as h, Fragment as j } from "vue";
import { Node as y, Edge as I, ObjectExt as O, StringExt as P, Graph as R } from "@antv/x6";
const g = (o, e = [], t = "node") => {
  const c = [], d = [], n = [];
  if (o) {
    const s = t === "node" ? y.create : I.create;
    e.forEach((a) => {
      const p = o.getCellById(a.id);
      if (p) {
        const l = s(a), u = l.getProp();
        l.dispose(), O.isEqual(p.getProp(), u) || d.push([p, u]);
      } else
        c.push(s(a));
    });
    const r = new Set(e.map((a) => a.id));
    (t === "node" ? o.getNodes() : o.getEdges()).forEach((a) => {
      r.has(a.id) || n.push(a.id);
    });
  }
  return { create: c, update: d, remove: n };
}, E = (o, e) => {
  const { create: t = [], update: c = [], remove: d = [] } = e;
  o && o.batchUpdate("update", () => {
    o.addCell(t), c.forEach(([n, s]) => {
      Object.keys(s).forEach((r) => n.setProp(r, s[r]));
    }), d.forEach((n) => o.removeCell(n));
  }, e);
}, v = (o) => ({ ...o, id: o.id || P.uuid() }), k = (o = {}) => {
  const e = b({
    nodes: f([]),
    edges: f([]),
    graph: null,
    setGraph: (t) => t && (e.graph = t),
    // state数据之前先检查id是否存在，自动创建id，确保diffCells的时候能使用id进行判断
    setNodes: (t) => e.nodes = t.map(v),
    setEdges: (t) => e.edges = t.map(v)
  });
  return m(() => g(e.graph, e.nodes, "node"), (t) => E(e.graph, t)), m(() => g(e.graph, e.nodes && e.edges, "edge"), (t) => E(e.graph, t)), G(() => {
    e.setGraph(o.g);
  }), e;
}, x = String(Symbol("x6ContextSymbol")), B = () => C(x), F = /* @__PURE__ */ S({
  inheritAttrs: !1,
  name: "X6Graph",
  setup(o, {
    slots: e,
    attrs: t,
    expose: c
  }) {
    const {
      className: d = "react-x6-graph",
      container: n
    } = o, s = w(n), r = k({});
    return N(x, r), c(r), G(() => {
      if (Object.keys(t).forEach((i) => t[i] === "" && (t[i] = !0)), s.value) {
        const i = new R({
          container: s.value,
          ...t
        });
        r.setGraph(i);
      }
    }), () => h("div", {
      className: d,
      style: {
        width: "100%",
        height: "100%",
        position: "relative"
      }
    }, [!n && h("div", {
      ref: s
    }, null), r.graph && h(j, null, [e.default ? e.default() : null])]);
  }
});
export {
  F as Graph,
  x as contextSymbol,
  B as useGraphInstance,
  k as useGraphState
};
