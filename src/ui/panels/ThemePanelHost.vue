<script setup lang="ts">
import { panelRegistry, type PanelContext, type PanelInstance } from "./registry";

defineProps<{
  panels: readonly PanelInstance[];
  context: PanelContext;
}>();
</script>

<template>
  <div v-if="panels.length" class="theme-panel-host">
    <component
      :is="panelRegistry[panel.component].component"
      v-for="panel in panels"
      :key="panel.id"
      v-bind="panelRegistry[panel.component].props(context)"
    />
  </div>
</template>

<style scoped lang="scss">
.theme-panel-host {
  display: grid;
  gap: 10px;
}
</style>
