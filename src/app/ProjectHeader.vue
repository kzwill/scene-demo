<script setup lang="ts">
defineSlots<{
  primary(): unknown
  secondary(): unknown
}>()
</script>

<template>
  <header class="project-header">
    <div class="project-header__top">
      <div class="project-header__brand">
        <svg class="project-header__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="m16 3 13 7-13 7L3 10 16 3Z" />
          <path d="m3 16 13 7 13-7M3 22l13 7 13-7" />
        </svg>
        <h1 class="project-header__title">可视化工程</h1>
      </div>
      <div class="project-header__primary"><slot name="primary" /></div>
    </div>
    <div class="project-header__secondary"><slot name="secondary" /></div>
  </header>
</template>

<style scoped lang="scss">
.project-header {
  min-width: 0;
  border-bottom: 1px solid #2c3032;
  background: #101213;
  color: #f0f1f2;

  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    min-height: 48px;
    padding-inline: 16px;
    border-bottom: 1px solid #2c3032;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
    padding-inline-end: 16px;
  }

  &__mark {
    flex: none;
    width: 22px;
    height: 22px;
    color: #70bbce;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &__title {
    overflow: hidden;
    margin: 0;
    font-size: 18px;
    font-weight: 650;
    letter-spacing: .04em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__primary {
    min-width: 0;
    max-width: 55vw;
    height: 47px;
  }

  &__secondary {
    min-width: 0;
    height: 39px;
    padding-inline: 20px;
    background: #111516;
  }

  @media (max-width: 640px) {
    &__top {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    &__brand {
      gap: 7px;
      padding-inline-end: 10px;
    }

    &__mark {
      width: 20px;
      height: 20px;
    }

    &__title {
      font-size: 16px;
    }

    &__primary {
      max-width: 60vw;
    }

    &__secondary {
      padding-inline: 16px;
    }
  }

  @media (max-width: 420px) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
    }

    &__brand {
      min-height: 40px;
    }

    &__primary {
      justify-self: center;
      max-width: 100%;
      height: 44px;
    }
  }
}
</style>
