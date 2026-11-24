<script setup lang="ts">
import { useId } from "vue";

defineProps<{
  title: string;
  entries: number;
  exits: number;
  source: string;
}>();

const headingId = useId();
</script>

<template>
  <section class="panel-2d vehicle-totals" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ title }}</h2>
    <dl class="vehicle-totals__metrics">
      <div>
        <dt>入园</dt>
        <dd>{{ entries }} <span>辆</span></dd>
      </div>
      <div>
        <dt>出园</dt>
        <dd>{{ exits }} <span>辆</span></dd>
      </div>
    </dl>
    <small class="vehicle-totals__source">{{ source }}</small>
  </section>
</template>

<style scoped lang="scss">
.vehicle-totals {
  min-width: 0;

  &__metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(52px, 1fr));
    gap: 8px;
    margin: 0;

    dt,
    span {
      color: var(--muted);
      font-size: 11px;
      font-weight: 400;
    }

    dd {
      margin: 2px 0 0;
      color: var(--accent);
      font-size: 18px;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }

  &__source {
    display: block;
    margin-top: 6px;
    color: var(--muted);
    font-size: 10px;
  }
}
</style>