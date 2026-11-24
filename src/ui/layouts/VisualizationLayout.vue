<script setup lang="ts">
defineSlots<{
  header(): unknown
  left(): unknown
  scene(): unknown
  right(): unknown
}>()
</script>

<template>
  <div class="visualization-layout">
    <slot name="header" />
    <main class="visualization-layout__workspace">
      <div class="visualization-layout__scene"><slot name="scene" /></div>
      <aside class="visualization-layout__overlay visualization-layout__left" aria-label="左侧图表区"><slot name="left" /></aside>
      <aside class="visualization-layout__overlay visualization-layout__right" aria-label="右侧图表区"><slot name="right" /></aside>
    </main>
  </div>
</template>

<style scoped lang="scss">
.visualization-layout {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;

  &__workspace {
    --overlay-width: clamp(162px, 20vw, 244px);
    --overlay-padding: 14px;
    position: relative;
    isolation: isolate;
    min-width: 0;
    min-height: min(380px, 70vh);
  }

  &__scene {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    background: #000;
  }

  &__overlay {
    position: absolute;
    inset-block: 0;
    z-index: 1;
    width: var(--overlay-width);
    padding: var(--overlay-padding);
    overflow: auto;
    overscroll-behavior: contain;
    background: linear-gradient(180deg, #253a4a91, #101a2470);
    -webkit-backdrop-filter: blur(16px) saturate(145%);
    backdrop-filter: blur(16px) saturate(145%);
  }

  &__left {
    inset-inline-start: 0;
    border-inline-end: 1px solid #bbd9ed38;
  }

  &__right {
    inset-inline-end: 0;
    border-inline-start: 1px solid #bbd9ed38;
  }

  @media (max-width: 760px) {
    &__workspace {
      --overlay-width: min(28vw, 200px);
      --overlay-padding: 8px;
    }
  }
}
</style>
