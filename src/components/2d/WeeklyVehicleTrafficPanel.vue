<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { init, use, type ComposeOption, type EChartsType } from "echarts/core";
import { BarChart, LineChart, type BarSeriesOption, type LineSeriesOption } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  type GridComponentOption,
  type TooltipComponentOption,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import type { DailyVehicleTraffic } from "../../data/weekly-vehicle-traffic";

use([BarChart, LineChart, GridComponent, TooltipComponent, SVGRenderer]);

type TrafficChartOption = ComposeOption<BarSeriesOption | LineSeriesOption | GridComponentOption | TooltipComponentOption>;
const props = withDefaults(defineProps<{
  days: readonly DailyVehicleTraffic[];
  variant?: "bar" | "line";
}>(), { variant: "bar" });
const headingId = useId();
const chartEl = ref<HTMLDivElement | null>(null);
let chart: EChartsType | undefined;
let resizeObserver: ResizeObserver | undefined;

function updateChart() {
  const el = chartEl.value;
  if (!el || !chart) return;

  const styles = getComputedStyle(el);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  const labelStyle = { color: color("--muted"), fontSize: 9 };
  const isLine = props.variant === "line";
  const series = (name: string, seriesColor: string, field: "entries" | "exits"): BarSeriesOption | LineSeriesOption => {
    const data = props.days.map((day) => day[field]);
    return isLine
      ? { name, type: "line", data, smooth: 0.45, smoothMonotone: "x", symbol: "circle", symbolSize: 5, lineStyle: { color: seriesColor }, itemStyle: { color: seriesColor } }
      : { name, type: "bar", data, barMaxWidth: 9, itemStyle: { color: seriesColor, borderRadius: [2, 2, 0, 0] } };
  };

  const option: TrafficChartOption = {
    animation: false,
    textStyle: { fontFamily: styles.fontFamily },
    grid: { left: 26, right: 4, top: 8, bottom: 32 },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: isLine ? "line" : "shadow" },
      appendTo: "body",
      backgroundColor: color("--surface-raised"),
      borderColor: color("--frame-border"),
      textStyle: { color: color("--ink"), fontSize: 12 },
      valueFormatter: (value) => `${value} 辆`,
    },
    xAxis: {
      type: "category",
      data: props.days.map(({ date }) => date),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: color("--frame-border") } },
      axisLabel: { ...labelStyle, interval: 0, rotate: 90, margin: 5, hideOverlap: false },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitNumber: 2,
      axisLabel: { ...labelStyle, margin: 4 },
      splitLine: { lineStyle: { color: color("--frame-border") } },
    },
    series: [series("入园", color("--entry-color"), "entries"), series("出园", color("--exit-color"), "exits")],
  };
  chart.setOption(option, { notMerge: true });
}

onMounted(() => {
  const el = chartEl.value;
  if (!el) return;

  const syncSize = () => {
    if (!el.clientWidth || !el.clientHeight) return;
    if (chart) {
      chart.resize();
    } else {
      chart = init(el, undefined, { renderer: "svg" });
      updateChart();
    }
  };

  syncSize();
  resizeObserver = new ResizeObserver(syncSize);
  resizeObserver.observe(el);
});

watch([() => props.days, () => props.variant], updateChart, { deep: true, flush: "post" });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chart?.dispose();
});

function describeDay({ date, entries, exits }: DailyVehicleTraffic) {
  return `${date}：入园 ${entries} 辆，出园 ${exits} 辆`;
}
</script>

<template>
  <section class="panel-2d vehicle-traffic" :class="{ 'vehicle-traffic--line': variant === 'line' }" :aria-labelledby="headingId">
    <h2 :id="headingId">{{ variant === "line" ? "近7天车辆出入趋势" : "近7天车辆出入园" }}</h2>
    <div class="vehicle-traffic__meta">
      <span class="vehicle-traffic__key vehicle-traffic__key--entry">入园</span>
      <span class="vehicle-traffic__key vehicle-traffic__key--exit">出园</span>
      <span class="vehicle-traffic__source">示例数据 · 辆</span>
    </div>
    <div ref="chartEl" class="vehicle-traffic__chart" role="img" :aria-label="days.map(describeDay).join('；')" />
  </section>
</template>

<style scoped lang="scss">
.vehicle-traffic {
  --entry-color: #4ade80;
  --exit-color: #ff6b5e;
  min-width: 0;

  &--line {
    --exit-color: #60a5fa;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 8px;
    margin-bottom: 4px;
    color: var(--muted);
    font-size: 10px;
  }

  &__source {
    margin-inline-start: auto;
  }

  &__key {
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &::before {
      width: 6px;
      height: 6px;
      border-radius: 2px;
      background: var(--series-color);
      content: "";
    }
  }

  &__key--entry {
    --series-color: var(--entry-color);
  }

  &__key--exit {
    --series-color: var(--exit-color);
  }

  &__chart {
    width: 100%;
    height: 134px;
  }
}
</style>
