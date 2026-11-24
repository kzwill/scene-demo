# 可视化工程

Vue 3、Vite、TypeScript 和 SCSS 模板。启动即加载 ThingJS Earth 高德地图。

```sh
npm ci
npm run dev
```

在本目录运行 `npm run build` 可以生成静态部署产物。

- `src/scene/map.config.ts` 定义底图样式、级别和瓦片 URL。
- `src/scene/thingjs-map.ts` 封装 App、地图和瓦片层的创建、尺寸更新及销毁。
- `index.html` 在应用启动前依次加载 ThingJS 核心和 Earth SDK。`src/scene/thingjs-sdk.ts` 提供全局 SDK 的类型检查和授权入口。
- `src/app/ProjectHeader.vue` 定义页头标题，`src/ui/layouts/VisualizationLayout.vue` 定义铺满工作区的地图和左右全高的毛玻璃侧栏。
- `src/themes/config.ts` 配置主题树、左右面板和 `sceneComponents`。省略配置时继承上级，空列表表示清空。
- `src/ui/panels/registry.ts` 注册组件和它所需的 props，`ThemePanelHost.vue` 根据主题配置加载左右面板。地图拥有独立的常驻区域。
- `src/components/2d/` 存放只负责展示的 Vue 组件，组件通过自己的 props 取值。新增界面样式使用 SCSS。
- `src/components/3d/CityPointLayer.vue` 创建 ThingJS 点位及点击弹窗，只在「重点区域」主题挂载。点位数据放在 `src/data/key-area-points.ts`，场景组件及数据在 `src/ui/scene-components/registry.ts` 注册。

使用浏览器能访问的网络打开高德底图。如果部署环境要求 ThingJS 授权，在本地 `.env.local` 中设置 `VITE_THINGJS_AUTH_URL`。该值会被浏览器用于授权请求，只填写可公开访问的授权地址。
