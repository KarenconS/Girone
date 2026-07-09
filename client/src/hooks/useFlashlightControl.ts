import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useFlashlightStore } from '../store/useFlashlightStore'

const LOW_BATTERY_THRESHOLD = 15
const FLICKER_CHANCE_PER_SECOND = 0.4

export function useFlashlightControl(enabled: boolean) {
  const toggle = useFlashlightStore((s) => s.toggle)
  const drainBattery = useFlashlightStore((s) => s.drainBattery)
  const setFlickering = useFlashlightStore((s) => s.setFlickering)
  const flickerTimerRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyF') toggle()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, toggle])

  useFrame((_, delta) => {
    if (!enabled) return

    const { isOn, batteryLevel, drainRate } = useFlashlightStore.getState()

    if (isOn && batteryLevel > 0) {
      drainBattery(drainRate * delta)
    }

    if (isOn && batteryLevel < LOW_BATTERY_THRESHOLD && batteryLevel > 0) {
      flickerTimerRef.current += delta
      if (flickerTimerRef.current > 1 / FLICKER_CHANCE_PER_SECOND) {
        flickerTimerRef.current = 0
        setFlickering(Math.random() < 0.5)
      }
    } else {
      setFlickering(false)
    }
  })
}