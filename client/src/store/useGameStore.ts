import { create } from 'zustand'
import type { GamePhase } from '../types/game.types'

interface GameState {
  phase: GamePhase
  selectedSin: string | null
  setPhase: (phase: GamePhase) => void
  setSelectedSin: (sinId: string) => void
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'entering',
  selectedSin: null,
  setPhase: (phase) => set({ phase }),
  setSelectedSin: (sinId) => set({ selectedSin: sinId }),
}))