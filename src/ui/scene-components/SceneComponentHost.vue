<script setup lang="ts">
import type { ThingMapContext } from '../../scene/thingjs-sdk'
import { sceneRegistry, type SceneComponentId } from './registry'

defineProps<{
  context: ThingMapContext
  componentIds: readonly SceneComponentId[]
}>()
</script>

<template>
  <component
    :is="sceneRegistry[id].component"
    v-for="id in componentIds"
    :key="id"
    :context="context"
    v-bind="sceneRegistry[id].props"
  />
</template>
