import { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useFlashlightStore } from '../../store/useFlashlightStore'
import type { PickupData } from '../../data/level1.pickups'

const PICKUP_RADIUS = 1.2

export function BatteryPickup({ id, position, amount }: PickupData) {
  const [collected, setCollected] = useState(false)
  const { camera } = useThree()
  const addBattery = useFlashlightStore((s) => s.addBattery)
  const meshPosition = useRef(new Vector3(...position))

  useFrame((state) => {
    if (collected) return

    const distance = camera.position.distanceTo(meshPosition.current)
    if (distance < PICKUP_RADIUS) {
      addBattery(amount)
      setCollected(true)
      return
    }

    state.scene.getObjectByName(id)?.rotateY(0.02)
  })

  if (collected) return null

  return (
    <mesh name={id} position={position}>
      <boxGeometry args={[0.15, 0.3, 0.15]} />
      <meshStandardMaterial color="#ffdd55" emissive="#886600" emissiveIntensity={0.6} />
    </mesh>
  )
}