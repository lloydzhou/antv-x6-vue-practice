import { Graph as X6Graph } from '@antv/x6';
import { defineComponent, provide, inject, ref, onMounted, Fragment } from 'vue'
import type { DefineComponent, Ref } from 'vue'
import { useGraphState } from './hooks'

export const contextSymbol = String(Symbol('x6ContextSymbol'))
export const useGraphInstance = () => inject(contextSymbol)

interface Props {
  className?: string;
  container?: Ref<HTMLElement>;
}
type Graph = DefineComponent<X6Graph.Options & Props, {[key: string]: any}>

export const Graph = defineComponent({
  inheritAttrs: false,
  name: 'X6Graph',
  setup(props, { slots, attrs, expose }){
    const { className='react-x6-graph', container } = props
    const containerRef = ref<HTMLElement | undefined>(container)
    const context = useGraphState({})
    provide(contextSymbol, context)
    expose(context)
    onMounted(() => {
      // options
      Object.keys(attrs).forEach(key => attrs[key] === "" && (attrs[key] = true) )
      // console.log('containerRef', containerRef, attrs, props)
      if (containerRef.value) {
        const graph = new X6Graph({
          container: containerRef.value,
          ...attrs,
        });
        context.setGraph(graph)
      }
    })
    return () => {
      return (
        <div
          className={className}
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

