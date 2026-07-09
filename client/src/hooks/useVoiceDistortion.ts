import { useCallback, useRef } from 'react'

let sharedContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
  }
  return sharedContext
}

function buildDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 44100
  const curve = new Float32Array(samples) as Float32Array<ArrayBuffer>
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1
    curve[i] = Math.tanh(x * (1 + amount * 8))
  }
  return curve
}

export function useVoiceDistortion() {
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const play = useCallback(async (url: string, distortion: number) => {
    const ctx = getAudioContext()
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const decoded = await ctx.decodeAudioData(arrayBuffer)

    const source = ctx.createBufferSource()
    source.buffer = decoded
    source.playbackRate.value = 1 - distortion * 0.35

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 4000 - distortion * 3000

    const shaper = ctx.createWaveShaper()
    shaper.curve = buildDistortionCurve(distortion)

    source.connect(filter).connect(shaper).connect(ctx.destination)
    source.start()

    activeSourceRef.current = source
    return new Promise<void>((resolve) => {
      source.onended = () => resolve()
    })
  }, [])

  return { play }
}