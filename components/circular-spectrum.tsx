"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

const CircularSpectrum: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const setupAudio = async () => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const newAudioContext = new AudioContext()
      const newAnalyser = newAudioContext.createAnalyser()
      newAnalyser.fftSize = 256

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const source = newAudioContext.createMediaStreamSource(stream)
        source.connect(newAnalyser)
        setAudioContext(newAudioContext)
        setAnalyser(newAnalyser)
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    setupAudio()

    return () => {
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !analyser) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const draw = () => {
      requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < dataArray.length; i++) {
        const angle = (i / dataArray.length) * Math.PI * 2
        const amplitude = dataArray[i] * 0.7
        const x = centerX + Math.cos(angle) * amplitude
        const y = centerY + Math.sin(angle) * amplitude

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${i}, 100%, 50%)`
        ctx.fill()

        if (i > 0) {
          const prevAngle = ((i - 1) / dataArray.length) * Math.PI * 2
          const prevAmplitude = dataArray[i - 1] * 0.7
          const prevX = centerX + Math.cos(prevAngle) * prevAmplitude
          const prevY = centerY + Math.sin(prevAngle) * prevAmplitude

          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x, y)
          ctx.strokeStyle = `hsl(${i}, 100%, 50%)`
          ctx.stroke()
        }
      }
    }

    draw()
  }, [analyser])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <button
        onClick={toggleFullscreen}
        className="absolute top-16 right-4 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>
    </div>
  )
}

export default CircularSpectrum