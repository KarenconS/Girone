import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { SpotLight } from 'three'
import { useFlashlightStore } from '../../store/useFlashlightStore'
import { useFlashlightControl } from '../../hooks/useFlashlightControl'

interface FlashlightProps {
  enabled: boolean
}

export function Flashlight({ enabled }: FlashlightProps) {
  const { camera } = useThree()
  const lightRef = useRef<SpotLight>(null)
  const targetRef = useRef<[number, number, number]>([0, 0, -1])

  useFlashlightControl(enabled)

  const isOn = useFlashlightStore((s) => s.isOn)
  const isFlickering = useFlashlightStore((s) => s.isFlickering)

  useFrame(() => {
    if (!lightRef.current) return

    lightRef.current.position.copy(camera.position)

    const direction = camera.getWorldDirection(
      lightRef.current.position.clone()
    )
    targetRef.current = [
      camera.position.x + direction.x * 5,
      camera.position.y + direction.y * 5,
      camera.position.z + direction.z * 5,
    ]
    lightRef.current.target.position.set(...targetRef.current)
    lightRef.current.target.updateMatrixWorld()
  })

  const intensity = isOn ? (isFlickering ? 0.3 : 2.2) : 0

  return (
    <spotLight
      ref={lightRef}
      angle={0.45}
      penumbra={0.6}
      intensity={intensity}
      distance={9}
      decay={2}
      color="#fff3d6"
      castShadow
    />
  )
}