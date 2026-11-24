export interface CityPoint {
  id: string
  name: string
  coordinates: [longitude: number, latitude: number]
}

export const keyAreaPoints: readonly CityPoint[] = [
  { id: 'beijing', name: '北京', coordinates: [116.4074, 39.9042] },
  { id: 'shanghai', name: '上海', coordinates: [121.4737, 31.2304] },
]
