import React from 'react'
import './App.css'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { ChurchScene } from './scenes/ChurchScene'
import { Level1Limbo } from './scenes/levels/Level1Limbo'
import { BatteryIndicator } from './components/ui/BatteryIndicator'
import { useGameStore } from './store/useGameStore'

export default function App() {
  const phase = useGameStore((s) => s.phase)
  const setPhase = useGameStore((s) => s.setPhase)

  return (
    <div id="canvas-root" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 70 }} shadows>
        <PointerLockControls makeDefault />
        {phase !== 'level1' && (
          <ChurchScene onEnterLevelOne={() => setPhase('level1')} />
        )}
        {phase === 'level1' && <Level1Limbo />}
      </Canvas>

      {phase === 'level1' && <BatteryIndicator />}
    </div>
  )
}