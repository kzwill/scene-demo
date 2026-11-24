interface EarthObject {
  destroy(): void
}

interface ThingLayer extends EarthObject {
  add(point: EarthObject): unknown
}

type EnumValue = string | number

interface GeoPointOptions {
  name: string
  coordinates: [longitude: number, latitude: number]
  userData: { name: string }
  style: { pointType: EnumValue; url: string; size: number }
  infoWindow: {
    title: string
    displayMode: EnumValue
    type: EnumValue
    style: EnumValue
    pivot: [number, number]
    fieldData: { field: string; alias: string }[]
  }
}

interface ThingApp {
  background: [number, number, number]
  resize?(width: number, height: number): void
  dispose(): void
}

interface EarthMap {
  addLayer(layer: EarthObject): unknown
  removeLayer(layer: EarthObject): boolean
  destroy(): void
}

interface ThingSdk {
  App: new (options: { container: HTMLElement }) => ThingApp
  Utils: { login(options: { url: string; wasmRootPath: string }): Promise<unknown> }
  EARTH: {
    Map: new (options: { attribution: string; maximumLevel: number; style: { night: boolean } }) => EarthMap
    TileLayer: new (options: { name: string; url: string; maximumLevel: number }) => EarthObject
    ThingLayer: new (options: { id: string; name: string }) => ThingLayer
    GeoPoint: new (options: GeoPointOptions) => EarthObject
    SymbolType: { Image: EnumValue }
    DisplayMode: { Click: EnumValue }
    InfoWindowType: { Standard: EnumValue }
    InfoWindowStyle: { Default: EnumValue }
  }
}

/** 常驻地图就绪后传给场景组件的 SDK 与地图实例。 */
export interface ThingMapContext {
  sdk: ThingSdk
  map: EarthMap
}

/** 读取由 index.html 加载的 ThingJS 和 Earth SDK。 */
export function getThingSdk(): ThingSdk {
  const sdk = (window as Window & { THING?: ThingSdk }).THING
  if (!sdk?.App || !sdk.EARTH?.Map || !sdk.EARTH?.TileLayer)
    throw new Error('ThingJS 地图接口不可用，请检查 index.html 中的 SDK 引用')
  return sdk
}

/** 可选的部署授权与地图构造分开，默认按示例直接创建 App。 */
export function authorizeThingSdk(sdk: ThingSdk, url: string) {
  const wasmRootPath = new URL(`${import.meta.env.BASE_URL}libs/wasm/`, document.baseURI).href
  return sdk.Utils.login({ url, wasmRootPath })
}
