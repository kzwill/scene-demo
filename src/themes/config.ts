import type { PanelInstance } from "../ui/panels/registry";
import type { SceneComponentId } from "../ui/scene-components/registry";

export interface ThemePanels {
  left: readonly PanelInstance[];
  right: readonly PanelInstance[];
}

export interface Theme {
  id: string;
  title: string;
  children?: readonly Theme[];
  panels?: Partial<ThemePanels>;
  sceneComponents?: readonly SceneComponentId[];
}

export const themes: readonly [Theme, ...Theme[]] = [
  {
    id: "overview",
    title: "园区总览",
    panels: {
      left: [
        { id: "overview-summary", component: "theme-summary" },
        { id: "overview-vehicle-traffic", component: "overview-vehicle-traffic" },
        { id: "overview-vehicle-today", component: "overview-vehicle-today" },
      ],
      right: [
        { id: "overview-path", component: "theme-path" },
        { id: "overview-vehicle-trend", component: "overview-vehicle-trend" },
        { id: "overview-vehicle-week-total", component: "overview-vehicle-week-total" },
      ],
    },
    children: [
      {
        id: "key-areas",
        title: "重点区域",
        sceneComponents: ["city-points"],
        panels: {
          left: [{ id: "areas-path", component: "theme-path" }],
          right: [{ id: "areas-summary", component: "theme-summary" }],
        },
      },
    ],
  },
  {
    id: "operations",
    title: "运行监测",
    panels: {
      left: [
        { id: "operations-summary", component: "theme-summary" },
        { id: "operations-path", component: "theme-path" },
      ],
      right: [],
    },
  },
];

/** 从一级主题开始查找选中主题的完整路径，支持继续增加下级。 */
export function findThemePath(nodes: readonly Theme[], id: string): Theme[] | undefined {
  for (const node of nodes) {
    if (node.id === id) return [node];
    const nested = node.children && findThemePath(node.children, id);
    if (nested) return [node, ...nested];
  }
}

/** 沿主题路径逐侧继承。省略某侧时沿用上级，空数组清空该侧。 */
export function resolveThemePanels(path: readonly Theme[]): ThemePanels {
  return path.reduce<ThemePanels>((panels, theme) => ({
    left: theme.panels?.left ?? panels.left,
    right: theme.panels?.right ?? panels.right,
  }), { left: [], right: [] });
}

/** 子主题可覆盖上级的场景组件，空列表表示清空。 */
export function resolveThemeSceneComponents(path: readonly Theme[]): readonly SceneComponentId[] {
  return path.reduce<readonly SceneComponentId[]>(
    (components, theme) => theme.sceneComponents ?? components,
    [],
  );
}
