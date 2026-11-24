import { mapConfig } from './map.config'
import { authorizeThingSdk, getThingSdk, type ThingMapContext } from './thingjs-sdk'

/** 创建地图及默认瓦片层，并交由调用方管理实例生命周期。 */
export async function createThingMap(container: HTMLElement, signal: AbortSignal) {
  signal.throwIfAborted()
  const sdk = getThingSdk()
  const authUrl = import.meta.env.VITE_THINGJS_AUTH_URL?.trim()
  if (authUrl) {
    await authorizeThingSdk(sdk, authUrl)
    signal.throwIfAborted()
  }

  const app = new sdk.App({ container })
  let map: InstanceType<typeof sdk.EARTH.Map> | undefined
  let tiles: InstanceType<typeof sdk.EARTH.TileLayer> | undefined
  let mounted = false
  let disposed = false

  function dispose() {
    if (disposed) return
    disposed = true
    try {
      if (!mounted) tiles?.destroy()
    } finally {
      try { map?.destroy() } finally { app.dispose() }
    }
  }

  try {
    app.background = [0, 0, 0]
    const { style, attribution, maximumLevel } = mapConfig
    map = new sdk.EARTH.Map({ style, attribution, maximumLevel })
    tiles = new sdk.EARTH.TileLayer({ ...mapConfig.tiles, maximumLevel })
    await map.addLayer(tiles)
    mounted = true
    signal.throwIfAborted()
  } catch (error) {
    try { dispose() } catch (cleanupError) { console.warn('地图释放失败', cleanupError) }
    throw error
  }

  const context: ThingMapContext = { sdk, map }
  return {
    context,
    resize() {
      const { clientWidth, clientHeight } = container
      if (clientWidth > 0 && clientHeight > 0) app.resize?.(clientWidth, clientHeight)
    },
    dispose,
  }
}
