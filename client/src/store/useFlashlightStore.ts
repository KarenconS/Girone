import { create } from 'zustand'
import type { FlashlightState } from '../types/flashlight.types'

interface FlashlightStore extends FlashlightState {
  toggle: () => void
  drainBattery: (amount: number) => void
  addBattery: (amount: number) => void
  setFlickering: (value: boolean) => void
}

const MAX_BATTERY = 100

export const useFlashlightStore = create<FlashlightStore>((set, get) => ({
  isOn: false,
  batteryLevel: MAX_BATTERY,
  maxBattery: MAX_BATTERY,
  drainRate: 1.8,
  isFlickering: false,

  toggle: () => {
    const { batteryLevel } = get()
    if (batteryLevel <= 0) return
    set((state) => ({ isOn: !state.isOn }))
  },

  drainBattery: (amount) => {
    set((state) => {
      const next = Math.max(0, state.batteryLevel - amount)
      return {
        batteryLevel: next,
        isOn: next <= 0 ? false : state.isOn,
      }
    })
  },

  addBattery: (amount) => {
    set((state) => ({
      batteryLevel: Math.min(state.maxBattery, state.batteryLevel + amount),
    }))
  },

  setFlickering: (value) => set({ isFlickering: value }),
}))