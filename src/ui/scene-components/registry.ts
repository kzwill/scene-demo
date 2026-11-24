import CityPointLayer from '../../components/3d/CityPointLayer.vue'
import { keyAreaPoints } from '../../data/key-area-points'

export const sceneRegistry = {
  'city-points': {
    component: CityPointLayer,
    props: { points: keyAreaPoints },
  },
}

export type SceneComponentId = keyof typeof sceneRegistry
