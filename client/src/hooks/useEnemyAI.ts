import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useFlashlightStore } from '../store/useFlashlightStore'
import type { EnemyState, EnemyConfig } from '../types/enemy.types'

export function useEnemyAI(config: EnemyConfig) {
  const { camera } = useThree()
  const stateRef = useRef<EnemyState>('idle')
  const patrolIndexRef = useRef(0)
  const positionRef = useRef(new Vector3(...config.patrolPoints[0]))
  const timeSinceLastSeenRef = useRef(0)
  const lastKnownPlayerPos = useRef(new Vector3())

  useFrame((_, delta) => {
    const distanceToPlayer = camera.position.distanceTo(positionRef.current)
    const flashlightOn = useFlashlightStore.getState().isOn

    const isLit = flashlightOn && distanceToPlayer < config.detectionRadius * 1.5
    const isTooClose = distanceToPlayer < config.detectionRadius
    const canSeePlayer = isLit || isTooClose

    if (canSeePlayer) {
      stateRef.current = 'chasing'
      timeSinceLastSeenRef.current = 0
      lastKnownPlayerPos.current.copy(camera.position)
    } else if (stateRef.current === 'chasing') {
      timeSinceLastSeenRef.current += delta
      if (timeSinceLastSeenRef.current > config.loseTrackAfterSeconds) {
        stateRef.current = 'losing-track'
      }
    }

    if (stateRef.current === 'chasing') {
      const direction = camera.position.clone().sub(positionRef.current).normalize()
      positionRef.current.addScaledVector(direction, config.chaseSpeed * delta)
    } else if (stateRef.current === 'losing-track') {
      const direction = lastKnownPlayerPos.current.clone().sub(positionRef.current)
      if (direction.length() < 0.5) {
        stateRef.current = 'idle'
      } else {
        direction.normalize()
        positionRef.current.addScaledVector(direction, config.chaseSpeed * 0.5 * delta)
      }
    } else {
      const target = new Vector3(...config.patrolPoints[patrolIndexRef.current])
      const direction = target.clone().sub(positionRef.current)

      if (direction.length() < 0.3) {
        patrolIndexRef.current = (patrolIndexRef.current + 1) % config.patrolPoints.length
      } else {
        direction.normalize()
        positionRef.current.addScaledVector(direction, config.patrolSpeed * delta)
      }
    }
  })

  return { positionRef, stateRef }
}