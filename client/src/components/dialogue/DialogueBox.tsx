import { useState, useCallback } from 'react'
import { Html } from '@react-three/drei'
import { useGameStore } from '../../store/useGameStore'
import { useVoiceDistortion } from '../../hooks/useVoiceDistortion'
import { CONFESSABLE_SINS, JUDGMENT_LINE } from './sins.data'

type DialogueStep = 'choosing' | 'absolving' | 'judging'

export function DialogueBox() {
  const [step, setStep] = useState<DialogueStep>('choosing')
  const setPhase = useGameStore((s) => s.setPhase)
  const setSelectedSin = useGameStore((s) => s.setSelectedSin)
  const { play } = useVoiceDistortion()

  const handleSinSelection = useCallback(
    async (sinId: string, distortion: number) => {
      setSelectedSin(sinId)
      setStep('absolving')
      await play('/audio/padre_respuesta.mp3', distortion)

      setStep('judging')
      await play('/audio/padre_juicio.mp3', 0.9)

      setPhase('falling')
    },
    [play, setPhase, setSelectedSin]
  )

  return (
    <Html fullscreen>
      <div className="dialogue-box">
        {step === 'choosing' && (
          <div className="dialogue-choices">
            <p className="dialogue-prompt">Padre, he venido a confesar...</p>
            {CONFESSABLE_SINS.map((sin) => (
              <button
                key={sin.id}
                className="dialogue-choice"
                onClick={() => handleSinSelection(sin.id, sin.distortionOnChoice)}
              >
                {sin.label}
              </button>
            ))}
          </div>
        )}
        {step === 'absolving' && (
          <p className="dialogue-line dialogue-line--soft">"...Ego te... absolvo..."</p>
        )}
        {step === 'judging' && (
          <p className="dialogue-line dialogue-line--broken">{JUDGMENT_LINE}</p>
        )}
      </div>
    </Html>
  )
}