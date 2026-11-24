<script setup lang="ts">
defineProps<{ theme: string }>()
</script>

<template>
  <section class="panel-2d" aria-labelledby="theme-summary-title">
    <h2 id="theme-summary-title">当前主题</h2>
    <p>{{ theme }}</p>
  </section>
</template>
