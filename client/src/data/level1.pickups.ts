export interface PickupData {
  id: string
  position: [number, number, number]
  amount: number
}

export const LEVEL1_BATTERIES: PickupData[] = [
  { id: 'bat-1', position: [1.5, 0.4, -3], amount: 25 },
  { id: 'bat-2', position: [-1.2, 0.4, -9], amount: 30 },
  { id: 'bat-3', position: [0.8, 0.4, -16], amount: 25 },
]