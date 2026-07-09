export type EnemyState = 'idle' | 'alert' | 'chasing' | 'losing-track'

export interface EnemyConfig {
  patrolPoints: [number, number, number][]
  detectionRadius: number
  chaseSpeed: number
  patrolSpeed: number
  loseTrackAfterSeconds: number
}