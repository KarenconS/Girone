import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { Flashlight } from '../../components/player/Flashlight'
import { BatteryPickup } from '../../components/pickups/BatteryPickup'
import { LEVEL1_BATTERIES } from '../../data/level1.pickups'
import { Wanderer } from '../../components/enemies/Wanderer'
import { ExitDoor } from '../../components/scene/ExitDoor'

const ROOM_WIDTH = 8
const ROOM_LENGTH = 20
const ROOM_HEIGHT = 3.5

export function Level1Limbo() {
  const wallTexture = useTexture('/textures/concrete_block_wall.jpg')

  wallTexture.wrapS = RepeatWrapping
  wallTexture.wrapT = RepeatWrapping
  wallTexture.repeat.set(4, 1.5)

  return (
    <group>
      <ambientLight intensity={0.08} color="#3a3a3a" />
      <pointLight position={[0, 2.8, -5]} intensity={0.6} color="#e8e0c8" distance={6} decay={2} />
      <pointLight position={[0, 2.8, -15]} intensity={0.4} color="#e8e0c8" distance={6} decay={2} />

      <mesh position={[0, 0, -ROOM_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      <mesh position={[0, ROOM_HEIGHT, -ROOM_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH, ROOM_LENGTH]} />
        <meshStandardMaterial map={wallTexture} roughness={0.95} />
      </mesh>

      <mesh position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2, -ROOM_LENGTH / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_LENGTH, ROOM_HEIGHT]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      <mesh position={[ROOM_WIDTH / 2, ROOM_HEIGHT / 2, -ROOM_LENGTH / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_LENGTH, ROOM_HEIGHT]} />
        <meshStandardMaterial map={wallTexture} roughness={0.9} />
      </mesh>

      <Flashlight enabled />

      {LEVEL1_BATTERIES.map((battery) => (
        <BatteryPickup key={battery.id} {...battery} />
      ))}

      <Wanderer />

      <ExitDoor position={[0, 1.2, -19.5]} />
    </group>
  )
}