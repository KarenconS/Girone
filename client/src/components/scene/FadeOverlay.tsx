import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useGameStore } from '../../store/useGameStore'

interface FadeOverlayProps {
  onComplete: () => void
  durationSeconds?: number
}

export function FadeOverlay({ onComplete, durationSeconds = 1.5 }: FadeOverlayProps) {
  const phase = useGameStore((s) => s.phase)
  const elapsedRef = useRef(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)

  useFrame((_, delta) => {
    if (phase !== 'falling' || completedRef.current) return

    elapsedRef.current += delta
    const progress = Math.min(elapsedRef.current / durationSeconds, 1)

    if (overlayRef.current) {
      overlayRef.current.style.opacity = String(progress)
    }

    if (progress >= 1) {
      completedRef.current = true
      onComplete()
    }
  })

  return (
    <Html fullscreen>
      <div
        ref={overlayRef}
        className="fade-overlay"
        style={{ opacity: 0 }}
      />
    </Html>
  )
}