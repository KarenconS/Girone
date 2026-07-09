import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'
import { useGameStore } from '../../store/useGameStore'

interface ExitDoorProps {
  position: [number, number, number]
  triggerRadius?: number
}

export function ExitDoor({ position, triggerRadius = 1.5 }: ExitDoorProps) {
  const { camera } = useThree()
  const setPhase = useGameStore((s) => s.setPhase)
  const meshRef = useRef<Mesh>(null)
  const positionVector = useRef(new Vector3(...position))
  const hasTriggeredRef = useRef(false)

  useFrame(() => {
    if (hasTriggeredRef.current) return

    const distance = camera.position.distanceTo(positionVector.current)
    if (distance < triggerRadius) {
      hasTriggeredRef.current = true
      setPhase('level2')
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1.2, 2.4, 0.15]} />
      <meshStandardMaterial color="#0a0a0a" emissive="#442200" emissiveIntensity={0.4} />
    </mesh>
  )
}