<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import type { CityPoint } from "../../data/key-area-points";
import type { ThingMapContext } from "../../scene/thingjs-sdk";

const props = defineProps<{
  context: ThingMapContext;
  points: readonly CityPoint[];
}>();
const { map, sdk } = props.context;
const earth = sdk.EARTH;
let layer: InstanceType<typeof earth.ThingLayer> | undefined;
const markerUrl = new URL(`https://www.thingjs.com/static/image/uGeo/pop.png`, document.baseURI).href;

function removeLayer() {
  if (!layer) return;
  const current = layer;
  layer = undefined;
  map.removeLayer(current);
}

onMounted(async () => {
  try {
    const current = new earth.ThingLayer({ id: "key-area-city-points", name: "重点区域城市点位" });
    layer = current;
    await map.addLayer(current);
    if (layer !== current) return;

    for (const point of props.points) {
      const geoPoint = new earth.GeoPoint({
        name: point.id,
        coordinates: [...point.coordinates],
        userData: { name: point.name },
        style: { pointType: earth.SymbolType.Image, url: markerUrl, size: 5 },
        infoWindow: {
          title: point.name,
          displayMode: earth.DisplayMode.Click,
          type: earth.InfoWindowType.Standard,
          style: earth.InfoWindowStyle.Default,
          pivot: [0.5, -0.3],
          fieldData: [{ field: "name", alias: "名称" }],
        },
      });
      try {
        current.add(geoPoint);
      } catch (error) {
        geoPoint.destroy();
        throw error;
      }
    }
  } catch (error) {
    removeLayer();
    console.error("重点区域点位加载失败", error);
  }
});

onBeforeUnmount(removeLayer);
</script>

<template>
  <!-- 点位和弹窗由 ThingJS 绘制。 -->
</template>
