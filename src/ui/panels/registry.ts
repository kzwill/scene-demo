import type { Component } from "vue";
import ThemePathPanel from "../../components/2d/ThemePathPanel.vue";
import ThemeSummaryPanel from "../../components/2d/ThemeSummaryPanel.vue";
import VehicleTrafficTotalsPanel from "../../components/2d/VehicleTrafficTotalsPanel.vue";
import WeeklyVehicleTrafficPanel from "../../components/2d/WeeklyVehicleTrafficPanel.vue";
import { getWeeklyVehicleTraffic, sumVehicleTraffic } from "../../data/weekly-vehicle-traffic";

export interface PanelContext {
  themeTitle: string;
  themePath: string[];
}

interface PanelDefinition {
  component: Component;
  props(context: PanelContext): Record<string, unknown>;
}

/** 统一注册面板，并把场景上下文转换成每个组件自己的 props。 */
export const panelRegistry = {
  "theme-summary": {
    component: ThemeSummaryPanel,
    props: ({ themeTitle }) => ({ theme: themeTitle }),
  },
  "theme-path": {
    component: ThemePathPanel,
    props: ({ themePath }) => ({ path: themePath }),
  },
  "overview-vehicle-traffic": {
    component: WeeklyVehicleTrafficPanel,
    props: () => ({ days: getWeeklyVehicleTraffic() }),
  },
  "overview-vehicle-trend": {
    component: WeeklyVehicleTrafficPanel,
    props: () => ({ days: getWeeklyVehicleTraffic(), variant: "line" }),
  },
  "overview-vehicle-today": {
    component: VehicleTrafficTotalsPanel,
    props: () => ({
      title: "今日车辆出入园",
      ...sumVehicleTraffic(getWeeklyVehicleTraffic().slice(-1)),
      source: "示例数据",
    }),
  },
  "overview-vehicle-week-total": {
    component: VehicleTrafficTotalsPanel,
    props: () => ({
      title: "近7天车辆出入园累计",
      ...sumVehicleTraffic(getWeeklyVehicleTraffic()),
      source: "示例数据",
    }),
  },
} satisfies Record<string, PanelDefinition>;

export interface PanelInstance {
  /** 同一页面上的稳定实例 ID。 */
  id: string;
  component: keyof typeof panelRegistry;
}
