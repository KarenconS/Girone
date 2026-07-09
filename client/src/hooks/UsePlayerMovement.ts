import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Euler } from 'three'
import type { MovementState } from '../types/game.types'

const WALK_SPEED = 3.2

export function usePlayerMovement(enabled: boolean) {
  const { camera } = useThree()
  const movement = useRef<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })
  const direction = useRef(new Vector3())

  useEffect(() => {
    if (!enabled) return

    const handleKey = (event: KeyboardEvent, isPressed: boolean) => {
      switch (event.code) {
        case 'KeyW':
          movement.current.forward = isPressed
          break
        case 'KeyS':
          movement.current.backward = isPressed
          break
        case 'KeyA':
          movement.current.left = isPressed
          break
        case 'KeyD':
          movement.current.right = isPressed
          break
      }
    }

    const onKeyDown = (e: KeyboardEvent) => handleKey(e, true)
    const onKeyUp = (e: KeyboardEvent) => handleKey(e, false)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [enabled])

  useFrame((_, delta) => {
    if (!enabled) return

    const m = movement.current
    direction.current.set(
      Number(m.right) - Number(m.left),
      0,
      Number(m.backward) - Number(m.forward)
    )

    if (direction.current.lengthSq() > 0) {
      direction.current
        .normalize()
        .multiplyScalar(WALK_SPEED * delta)
        .applyEuler(new Euler(0, camera.rotation.y, 0))

      camera.position.add(direction.current)
    }
  })
}