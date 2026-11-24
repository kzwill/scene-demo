<script setup lang="ts">
import { computed } from 'vue'
import type { Theme } from '../../themes/config'

const props = defineProps<{
  themes: readonly Theme[]
  activePath: Theme[]
  level: 'primary' | 'nested'
}>()
const emit = defineEmits<{ select: [id: string] }>()
const groups = computed(() => props.level === 'primary'
  ? [{ depth: 0, nodes: props.themes }]
  : props.activePath.flatMap((theme, index) => theme.children?.length
    ? [{ depth: index + 1, nodes: theme.children }]
    : []))
</script>

<template>
  <nav v-if="groups.length" class="theme-nav" :class="`theme-nav--${level}`"
    :aria-label="level === 'primary' ? '一级主题切换' : '下级主题切换'">
    <div v-for="group in groups" :key="group.depth" class="theme-nav__group"
      role="group" :aria-label="group.depth === 0 ? '一级主题' : group.depth === 1 ? '二级主题' : `第 ${group.depth + 1} 级主题`">
      <button v-for="node in group.nodes" :key="node.id" type="button" class="theme-nav__button"
        :aria-pressed="node.id === activePath[group.depth]?.id"
        @click="emit('select', node.id)">
        {{ node.title }}
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.theme-nav {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #424649 transparent;

  &__group {
    display: flex;
    flex: none;
    align-items: center;
    height: 100%;
  }

  &__button {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    color: #a3a5a7;
    font: inherit;
    line-height: 1.4;
    white-space: nowrap;
    cursor: pointer;
    transition: color 150ms ease, background-color 150ms ease;

    &:hover {
      background-color: #ffffff06;
      color: #f5f5f5;
    }

    &:focus-visible {
      outline: 1px solid #d9dfe3;
      outline-offset: -3px;
    }

    &[aria-pressed='true'] {
      color: #f5f5f5;
    }
  }

  &--primary &__group {
    gap: 24px;
  }

  &--primary &__button {
    min-width: 112px;
    height: 100%;
    padding: 0 20px;
    font-size: 15px;
    font-weight: 650;
    letter-spacing: .08em;

    &::after {
      position: absolute;
      bottom: 6px;
      left: calc(50% - 12px);
      width: 24px;
      height: 2px;
      background: #f5f5f5;
      content: '';
      transform: scaleX(0);
      transition: transform 150ms ease;
    }

    &[aria-pressed='true']::after {
      transform: scaleX(1);
    }
  }

  &--nested &__group {
    gap: 6px;

    & + .theme-nav__group {
      height: 28px;
      margin-inline-start: 12px;
      padding-inline-start: 12px;
      border-inline-start: 1px solid #303436;
    }
  }

  &--nested &__button {
    min-width: 82px;
    min-height: 28px;
    padding: 5px 16px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;

    &[aria-pressed='true'] {
      background-color: #25282a;
    }
  }

  @media (max-width: 640px) {
    &--primary &__group {
      gap: 8px;
    }

    &--primary &__button {
      min-width: 96px;
      padding-inline: 12px;
      font-size: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__button,
    &__button::after {
      transition: none;
    }
  }
}
</style>
