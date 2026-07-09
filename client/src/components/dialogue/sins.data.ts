// components/dialogue/sins.data.ts
import type { Sin } from '../../types/game.types'

export const CONFESSABLE_SINS: Sin[] = [
  { id: 'gula', label: 'He sido incapaz de controlar mis excesos.', distortionOnChoice: 0.2 },
  { id: 'ira', label: 'Le hice daño a alguien que no lo merecía.', distortionOnChoice: 0.25 },
  { id: 'avaricia', label: 'Mentí para quedarme con algo que no era mío.', distortionOnChoice: 0.2 },
]

export const JUDGMENT_LINE =
  '...NO. Antes debes... PAGAR cada peldaño.'