import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, useGLTF } from '@react-three/drei'
import { RepeatWrapping, Group, Box3, Vector3, DoubleSide } from 'three'
import { useGameStore } from '../store/useGameStore'
import { usePlayerMovement } from '../hooks/UsePlayerMovement'
import { DialogueBox } from '../components/dialogue/DialogueBox'
import { FadeOverlay } from '../components/scene/FadeOverlay'

interface ChurchSceneProps {
  onEnterLevelOne: () => void
}

const FALL_SPEED = 4
const DOOR_OPEN_ANGLE = Math.PI / 1.7
const DOOR_OPEN_SPEED = 3
const CONFESSIONAL_HEIGHT = 3.275
const TARGET_PRIEST_HEIGHT = CONFESSIONAL_HEIGHT - 0.1
const FLOOR_Y = -1
const GRILLE_HEIGHT = 2.6
const PRIEST_ROOM_DEPTH = 1.6
const PRIEST_SIT_OFFSET = 0.45

function Priest() {
  const { scene } = useGLTF('/models/priest.glb')

  const scale = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = new Vector3()
    box.getSize(size)
    return TARGET_PRIEST_HEIGHT / size.y
  }, [scene])

  return (
    <primitive
      object={scene}
      position={[1 + PRIEST_ROOM_DEPTH / 2, FLOOR_Y - PRIEST_SIT_OFFSET, -6]}
      scale={scale}
      rotation={[0, -Math.PI / 2, 0]}
    />
  )
}

function TexturedGrille({
  position,
  rotationY = 0,
  size = [1, 0.5] as [number, number],
}: {
  position: [number, number, number]
  rotationY?: number
  size?: [number, number]
}) {
  const grilleTexture = useTexture('/textures/grille_alpha.png')

  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        map={grilleTexture}
        transparent
        alphaTest={0.3}
        side={DoubleSide}
      />
    </mesh>
  )
}

function HorizontalGrille({
  position,
  rotationY = 0,
  width = 1.4,
  height = 0.75,
}: {
  position: [number, number, number]
  rotationY?: number
  width?: number
  height?: number
}) {
  const slatCount = 9
  const slatSpacing = height / slatCount
  const bars = []

  for (let i = 0; i < slatCount; i++) {
    const offset = i * slatSpacing - height / 2 + slatSpacing / 2
    bars.push(
      <mesh key={`h-${i}`} position={[0, offset, 0]}>
        <boxGeometry args={[width, 0.04, 0.03]} />
        <meshStandardMaterial color="#1a0d06" />
      </mesh>
    )
  }

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {bars}
    </group>
  )
}

function Candle({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<any>(null)

  useFrame((state) => {
    if (lightRef.current) {
      const flicker =
        6 + Math.sin(state.clock.elapsedTime * 9 + position[0]) * 1.2 + Math.random() * 0.8
      lightRef.current.intensity = flicker
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 12]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.35, 10]} />
        <meshStandardMaterial color="#e8dcc0" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffaa33" emissive="#ff8811" emissiveIntensity={3} />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.45, 0]}
        intensity={6}
        color="#ff9944"
        distance={9}
        decay={1}
      />
    </group>
  )
}

function Kneeler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.15, 0.5]} />
        <meshStandardMaterial color="#5a1a1a" />
      </mesh>
      <mesh position={[0.15, GRILLE_HEIGHT - FLOOR_Y - 0.85, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.35]} />
        <meshStandardMaterial color="#4a2a18" />
      </mesh>
    </group>
  )
}

export function ChurchScene({ onEnterLevelOne }: ChurchSceneProps) {
  const phase = useGameStore((s) => s.phase)
  const isFalling = phase === 'falling'
  const isConfessing = phase === 'confessing'
  usePlayerMovement(!isFalling)

  const doorRef = useRef<Group>(null)
  const [doorAngle, setDoorAngle] = useState(0)
  const [doorManuallyOpen, setDoorManuallyOpen] = useState(false)

  const concreteTexture = useTexture('/textures/concrete_block_wall_diff_1k.jpg')
  concreteTexture.wrapS = RepeatWrapping
  concreteTexture.wrapT = RepeatWrapping
  concreteTexture.repeat.set(8, 8)

  const pointLightRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (isFalling) {
      state.camera.position.y -= delta * FALL_SPEED
    }

    const target = isConfessing || doorManuallyOpen ? DOOR_OPEN_ANGLE : 0
    setDoorAngle((prev) => {
      const next = prev + (target - prev) * Math.min(delta * DOOR_OPEN_SPEED, 1)
      if (doorRef.current) doorRef.current.rotation.y = next
      return next
    })

    if (pointLightRef.current) {
      const flicker = 5 + Math.sin(state.clock.elapsedTime * 6) * 0.6 + Math.random() * 0.4
      pointLightRef.current.intensity = flicker
    }
  })

  return (
    <>
      <color attach="background" args={['#0a0604']} />
      <fog attach="fog" args={['#0a0604', 8, 25]} />

      <ambientLight intensity={0.9} color="#5a4030" />
      <pointLight
        ref={pointLightRef}
        position={[0, 3, 5]}
        intensity={5}
        color="#d98c4a"
        distance={18}
        decay={1}
      />
      <pointLight
        position={[1 + PRIEST_ROOM_DEPTH / 2, 2.2, -6]}
        intensity={1.2}
        color="#a85a2a"
        distance={6}
        decay={1}
      />

      <mesh position={[0, FLOOR_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={concreteTexture} color="#cfcfcf" />
      </mesh>

      <mesh position={[0, 3, -12]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial map={concreteTexture} color="#cfcfcf" />
      </mesh>

      <Candle position={[-2.5, FLOOR_Y + 0.9, -6]} />
      <Candle position={[3.8, FLOOR_Y + 0.9, -6]} />

      <group position={[0, FLOOR_Y, -6]}>
        <mesh position={[0, 1.6, -0.75]} castShadow>
          <boxGeometry args={[2, 3.2, 0.1]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>

        <mesh position={[-1, 1.6, 0]} castShadow>
          <boxGeometry args={[0.1, 3.2, 1.5]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>

        {/* Pared lateral con hueco: rejilla con textura PNG */}
        <mesh position={[1, 0.9, 0]} castShadow>
          <boxGeometry args={[0.1, 1.8, 1.5]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>
        <mesh position={[1, GRILLE_HEIGHT + 0.35, 0]} castShadow>
          <boxGeometry args={[0.1, 0.75, 1.5]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>
        <TexturedGrille position={[1.03, GRILLE_HEIGHT, 0]} rotationY={Math.PI / 2} size={[1.45, 1.65]} />

        {/* Moldura decorativa alrededor de la rejilla lateral */}
        <mesh position={[1.08, GRILLE_HEIGHT, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.55, 0.03, 8, 24]} />
          <meshStandardMaterial color="#2e1a0f" />
        </mesh>

        <Kneeler position={[0.7, 0, 0]} />

        {/* Cojín del reclinatorio */}
        <mesh position={[0.85, 0.18, 0]} castShadow>
          <boxGeometry args={[0.35, 0.06, 0.45]} />
          <meshStandardMaterial color="#6b1a1a" roughness={0.8} />
        </mesh>

        <mesh position={[0.55, 1.6, 0.75]} castShadow>
          <boxGeometry args={[0.9, 3.2, 0.1]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>

        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[2.1, 0.15, 1.6]} />
          <meshStandardMaterial color="#4a2a18" />
        </mesh>

        <group position={[-1, 0, 0.75]} ref={doorRef}>
          <mesh
            position={[0.45, 1.4, 0]}
            castShadow
            onClick={() => setDoorManuallyOpen((prev) => !prev)}
          >
            <boxGeometry args={[0.9, 2.8, 0.08]} />
            <meshStandardMaterial color="#6b4028" />
          </mesh>
          {/* Cortina de tela en la puerta */}
          <mesh position={[0.45, 1.3, 0.05]} rotation={[0, 0, 0.02]}>
            <planeGeometry args={[0.85, 2.5, 8, 8]} />
            <meshStandardMaterial color="#3a0d0d" roughness={0.9} side={DoubleSide} />
          </mesh>
          {/* Tirador de latón */}
          <mesh position={[0.75, 1.4, 0.09]} castShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        {/* Compartimento cerrado del sacerdote */}
        <mesh position={[1 + PRIEST_ROOM_DEPTH, 1.6, 0]} castShadow>
          <boxGeometry args={[0.1, 3.2, 1.6]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>

        {/* Ventanilla frontal derecha, con rejilla de listones horizontales */}
        <mesh position={[1 + PRIEST_ROOM_DEPTH / 2, 0.95, -0.8]} castShadow>
          <boxGeometry args={[PRIEST_ROOM_DEPTH, 1.9, 0.1]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>
        <mesh position={[1 + PRIEST_ROOM_DEPTH / 2, 2.75, -0.8]} castShadow>
          <boxGeometry args={[PRIEST_ROOM_DEPTH, 0.9, 0.1]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>
        <HorizontalGrille
          position={[1 + PRIEST_ROOM_DEPTH / 2, 2.1, -0.8]}
          rotationY={0}
          width={PRIEST_ROOM_DEPTH - 0.15}
          height={0.75}
        />

        <mesh position={[1 + PRIEST_ROOM_DEPTH / 2, 1.6, 0.8]} castShadow>
          <boxGeometry args={[PRIEST_ROOM_DEPTH, 3.2, 0.1]} />
          <meshStandardMaterial color="#5a3320" />
        </mesh>
        <mesh position={[1 + PRIEST_ROOM_DEPTH / 2, 3.2, 0]} castShadow>
          <boxGeometry args={[PRIEST_ROOM_DEPTH + 0.1, 0.15, 1.7]} />
          <meshStandardMaterial color="#4a2a18" />
        </mesh>

        {/* Pilastras laterales talladas */}
        <mesh position={[-1, 1.6, -0.7]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
          <meshStandardMaterial color="#3d2415" roughness={0.7} />
        </mesh>
        <mesh position={[1 + PRIEST_ROOM_DEPTH, 1.6, -0.7]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
          <meshStandardMaterial color="#3d2415" roughness={0.7} />
        </mesh>
        <mesh position={[-1, 1.6, 0.7]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
          <meshStandardMaterial color="#3d2415" roughness={0.7} />
        </mesh>
        <mesh position={[1 + PRIEST_ROOM_DEPTH, 1.6, 0.7]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
          <meshStandardMaterial color="#3d2415" roughness={0.7} />
        </mesh>

        {/* Remate superior con pequeño frontón */}
        <mesh position={[0, 3.35, 0]} castShadow>
          <boxGeometry args={[2.3, 0.1, 1.8]} />
          <meshStandardMaterial color="#2e1a0f" />
        </mesh>
        <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.06]} />
          <meshStandardMaterial color="#4a2a18" />
        </mesh>

        {/* Cruz decorativa sobre el confesionario */}
        <mesh position={[0, 3.85, 0]} castShadow>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#1a0d06" />
        </mesh>
        <mesh position={[0, 3.95, 0]} castShadow>
          <boxGeometry args={[0.25, 0.05, 0.05]} />
          <meshStandardMaterial color="#1a0d06" />
        </mesh>
      </group>

      <Priest />

      {phase === 'confessing' && <DialogueBox />}
      <FadeOverlay onComplete={onEnterLevelOne} />
    </>
  )
}