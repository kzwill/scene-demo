<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import MapView from '../scene/MapView.vue'
import { findThemePath, resolveThemePanels, resolveThemeSceneComponents, themes } from '../themes/config'
import VisualizationLayout from '../ui/layouts/VisualizationLayout.vue'
import ThemeNavigation from '../ui/navigation/ThemeNavigation.vue'
import ThemePanelHost from '../ui/panels/ThemePanelHost.vue'
import SceneComponentHost from '../ui/scene-components/SceneComponentHost.vue'
import ProjectHeader from './ProjectHeader.vue'

const activeId = shallowRef(themes[0].id)
const activePath = computed(() => findThemePath(themes, activeId.value) ?? [themes[0]])
const panels = computed(() => resolveThemePanels(activePath.value))
const sceneComponents = computed(() => resolveThemeSceneComponents(activePath.value))
const panelContext = computed(() => ({
  themeTitle: activePath.value.at(-1)!.title,
  themePath: activePath.value.map(theme => theme.title),
}))
</script>

<template>
  <VisualizationLayout>
    <template #header>
      <ProjectHeader>
        <template #primary>
          <ThemeNavigation level="primary" :themes="themes" :active-path="activePath" @select="activeId = $event" />
        </template>
        <template #secondary>
          <ThemeNavigation level="nested" :themes="themes" :active-path="activePath" @select="activeId = $event" />
        </template>
      </ProjectHeader>
    </template>
    <template #left><ThemePanelHost :panels="panels.left" :context="panelContext" /></template>
    <template #scene>
      <MapView v-slot="{ context }">
        <SceneComponentHost :context="context" :component-ids="sceneComponents" />
      </MapView>
    </template>
    <template #right><ThemePanelHost :panels="panels.right" :context="panelContext" /></template>
  </VisualizationLayout>
</template>
