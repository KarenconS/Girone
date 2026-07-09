import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { useEnemyAI } from '../../hooks/useEnemyAI'
import type { EnemyConfig } from '../../types/enemy.types'

const WANDERER_CONFIG: EnemyConfig = {
    patrolPoints: [
        [1, 0.9, -4],
        [-1, 0.9, -8],
        [1, 0.9, -12],
        [-0.5, 0.9, -17],
    ],
    detectionRadius: 3.5,
    chaseSpeed: 1.6,
    patrolSpeed: 0.8,
    loseTrackAfterSeconds: 4,
}

export function Wanderer() {
    const meshRef = useRef<Mesh>(null)
    const { positionRef, stateRef } = useEnemyAI(WANDERER_CONFIG)

    useFrame(() => {
        if (!meshRef.current) return
        meshRef.current.position.copy(positionRef.current)

        const material = meshRef.current.material as any
        if (material?.emissive) {
            material.emissive.setHex(
                stateRef.current === 'chasing' ? 0x661111 :
                    stateRef.current === 'losing-track' ? 0x443311 :
                        0x000000
            )
        }
    })

    return (
        <mesh ref={meshRef}>
            <capsuleGeometry args={[0.3, 1.4, 4, 8]} />
            <meshStandardMaterial color="#1a1a1a" emissive="#000000" roughness={1} />
        </mesh>
    )
}