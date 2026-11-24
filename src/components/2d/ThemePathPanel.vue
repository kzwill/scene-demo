<script setup lang="ts">
defineProps<{ path: string[] }>()
</script>

<template>
  <section class="panel-2d" aria-labelledby="theme-path-title">
    <h2 id="theme-path-title">主题路径</h2>
    <p>{{ path.join(' / ') }}</p>
  </section>
</template>
