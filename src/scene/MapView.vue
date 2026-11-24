<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, shallowRef, useTemplateRef } from 'vue'
import { createThingMap } from './thingjs-map'
import type { ThingMapContext } from './thingjs-sdk'

defineSlots<{ default?(props: { context: ThingMapContext }): unknown }>()

const host = useTemplateRef<HTMLDivElement>('host')
const status = shallowRef<'loading' | 'ready' | 'error'>('loading')
const message = shallowRef('')
const context = shallowRef<ThingMapContext>()
let instance: Awaited<ReturnType<typeof createThingMap>> | undefined
let observer: ResizeObserver | undefined
const lifetime = new AbortController()

async function initialize() {
  if (!host.value) return
  status.value = 'loading'
  message.value = ''
  try {
    const current = await createThingMap(host.value, lifetime.signal)
    if (lifetime.signal.aborted) {
      current.dispose()
      return
    }
    instance = current
    observer ??= new ResizeObserver(() => instance?.resize())
    observer.observe(host.value)
    instance.resize()
    context.value = current.context
    status.value = 'ready'
  } catch (error) {
    if (lifetime.signal.aborted) return
    message.value = error instanceof Error ? error.message : 'ThingJS 地图加载失败'
    status.value = 'error'
  }
}

onMounted(initialize)
onBeforeUnmount(() => {
  lifetime.abort()
  observer?.disconnect()
})
// 子组件先卸载自己的图层，再销毁地图。
onUnmounted(() => {
  instance?.dispose()
})
</script>

<template>
  <section class="map-view" aria-label="高德地图" :aria-busy="status === 'loading'">
    <div ref="host" class="map-view__host"></div>
    <div v-if="status === 'loading'" class="map-view__status" role="status">正在加载地图…</div>
    <div v-else-if="status === 'error'" class="map-view__status" role="alert">
      <span>{{ message }}</span>
      <button type="button" @click="initialize">重试</button>
    </div>
    <slot v-if="context" :context="context" />
  </section>
</template>

<style scoped lang="scss">
.map-view {
  position: absolute;
  inset: 0;
  overflow: hidden;

  &__host {
    position: absolute;
    inset: 0;
  }

  &__status {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    width: max-content;
    max-width: min(330px, 40%);
    padding: 9px 12px;
    border: 1px solid #ffffff24;
    border-radius: 6px;
    background: #161616;
    color: #eee;
    font-size: 13px;

    span {
      overflow-wrap: anywhere;
    }

    button {
      border: 0;
      padding: 2px 0;
      background: transparent;
      color: #eee;
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
    }
  }
}
</style>
