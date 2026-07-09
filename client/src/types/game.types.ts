export type GamePhase = 'entering' | 'approaching' | 'confessing' | 'falling' | 'level1' | 'level2'

export interface Sin {
  id: string
  label: string
  distortionOnChoice: number
}

export interface MovementState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}