import { Graph as X6Graph } from '@antv/x6';
import { defineComponent, provide, inject, ref, onMounted, Fragment, shallowReactive } from 'vue'
import type { DefineComponent, Ref } from 'vue'

export const contextSymbol = String(Symbol('x6ContextSymbol'))
export const useGraphInstance = () => inject(contextSymbol)

interface Props {
  container?: Ref<HTMLElement>;
}
type Graph = DefineComponent<X6Graph.Options & Props, {[key: string]: any}>

export const Graph = defineComponent({
  inheritAttrs: false,
  name: 'X6Graph',
  setup(props, { slots, attrs, expose }){
    const { container } = props
    const {...other} = attrs
    const containerRef = ref<HTMLElement | undefined>(container)
    const context = shallowReactive<{graph: X6Graph | null}>({ graph: null })
    provide(contextSymbol, context)
    expose(context)
    onMounted(() => {
      // options
      Object.keys(other).forEach(key => other[key] === "" && (other[key] = true) )
      // console.log('containerRef', containerRef, other, props)
      if (containerRef.value) {
        context.graph = new X6Graph({
          container: containerRef.value,
          ...other,
        });
      }
    })
    return () => {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {!container && <div ref={containerRef} />}
          {context.graph && <Fragment>
            {slots.default ? slots.default() : null}
          </Fragment>}
        </div>
      );
    }
  }
}) as Graph

