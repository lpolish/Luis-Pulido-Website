'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Maximize2, Minimize2 } from 'lucide-react'

type Particle = {
  x: number
  y: number
  color: string
  size: number
  growthRate: number
  angle: number
  speed: number
}

interface Visualization {
  name: string
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dataArray: Uint8Array, waveformArray: Uint8Array) => void
}

export default function SpectrumVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isListening, setIsListening] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [activeVisualizations, setActiveVisualizations] = useState<Record<string, boolean>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const streamRef = useRef<MediaStream | null>(null)

  const visualizations = useRef<Visualization[]>([
    {
      name: 'Spiral Galaxy',
      draw: (ctx, canvas, dataArray) => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        particlesRef.current.forEach((particle, index) => {
          const angle = index / particlesRef.current.length * Math.PI * 2
          const radius = (dataArray[index % dataArray.length] / 256) * (Math.min(canvas.width, canvas.height) / 3)
          
          particle.x = centerX + Math.cos(angle) * radius
          particle.y = centerY + Math.sin(angle) * radius

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        })
      }
    },
    {
      name: 'Growing Dots Galaxy',
      draw: (ctx, canvas, dataArray) => {
        particlesRef.current.forEach((particle, index) => {
          particle.size = (dataArray[index % dataArray.length] / 256) * 10 + 1
          particle.x += (Math.random() - 0.5) * 2
          particle.y += (Math.random() - 0.5) * 2
          if (particle.x < 0 || particle.x > canvas.width) particle.x = Math.random() * canvas.width
          if (particle.y < 0 || particle.y > canvas.height) particle.y = Math.random() * canvas.height

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = particle.color
          ctx.fill()
        })
      }
    },
    {
      name: 'Frequency Bars',
      draw: (ctx, canvas, dataArray) => {
        const barWidth = canvas.width / dataArray.length
        let x = 0

        for (let i = 0; i < dataArray.length; i++) {
          const barHeight = dataArray[i] / 2
          const y = canvas.height - barHeight

          ctx.fillStyle = `hsl(${i / dataArray.length * 360}, 100%, 50%)`
          ctx.fillRect(x, y, barWidth, barHeight)

          x += barWidth + 1
        }
      }
    },
    {
      name: 'Circular Waveform',
      draw: (ctx, canvas, _, waveformArray) => {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const radius = Math.min(centerX, centerY) - 10

        ctx.beginPath()
        for (let i = 0; i < waveformArray.length; i++) {
          const angle = (i / waveformArray.length) * Math.PI * 2
          const amplitude = waveformArray[i] / 128.0
          const x = centerX + Math.cos(angle) * radius * amplitude
          const y = centerY + Math.sin(angle) * radius * amplitude

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    },
    {
      name: 'Fractal Tree',
      draw: (ctx, canvas, dataArray) => {
        const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
          if (depth === 0) return

          const endX = x + length * Math.cos(angle)
          const endY = y + length * Math.sin(angle)

          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(endX, endY)
          ctx.strokeStyle = `hsl(${(dataArray[depth * 10] / 255) * 360}, 100%, 50%)`
          ctx.lineWidth = depth
          ctx.stroke()

          const branchAngle = (dataArray[depth * 5] / 255) * Math.PI / 2
          drawBranch(endX, endY, length * 0.7, angle - branchAngle, depth - 1)
          drawBranch(endX, endY, length * 0.7, angle + branchAngle, depth - 1)
        }

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) return

        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
        drawBranch(tempCanvas.width / 2, tempCanvas.height, tempCanvas.height / 4, -Math.PI / 2, 9)

        ctx.globalAlpha = 0.7
        ctx.drawImage(tempCanvas, 0, 0)
        ctx.globalAlpha = 1.0
      }
    },
    {
      name: 'Audio Oscilloscope',
      draw: (ctx, canvas, _, waveformArray) => {
        ctx.beginPath()
        ctx.strokeStyle = 'lime'
        ctx.lineWidth = 2

        const sliceWidth = canvas.width / waveformArray.length
        let x = 0

        for (let i = 0; i < waveformArray.length; i++) {
          const v = waveformArray[i] / 128.0
          const y = (v * canvas.height) / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          x += sliceWidth
        }

        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.stroke()
      }
    }
  ])

  useEffect(() => {
    const initialActiveVisualizations: Record<string, boolean> = {}
    visualizations.current.forEach((vis, index) => {
      initialActiveVisualizations[vis.name] = index === 0 // Activate only the first visualization by default
    })
    setActiveVisualizations(initialActiveVisualizations)
  }, [])

  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 2048

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
      } catch (err) {
        console.error('Error accessing microphone:', err)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 1000 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        size: Math.random() * 2 + 1,
        growthRate: Math.random() * 0.1 + 0.05,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 0.5
      }))
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleInteraction = () => {
      setShowControls(true)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setShowControls(false), 3000)
    }

    let timeoutId: NodeJS.Timeout
    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  const startListening = useCallback(async () => {
    await initializeAudioContext()
    setIsListening(true)
    animate()
  }, [initializeAudioContext])

  const stopListening = useCallback(() => {
    setIsListening(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
    // Clear the canvas when stopping the visualization
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    // Reset audio context and stream
    if (audioContextRef.current) {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null
        analyserRef.current = null
      })
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const waveformArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isListening || !analyserRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = undefined
        }
        return
      }

      animationRef.current = requestAnimationFrame(draw)
      analyserRef.current.getByteFrequencyData(dataArray)
      analyserRef.current.getByteTimeDomainData(waveformArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      visualizations.current.forEach(vis => {
        if (activeVisualizations[vis.name]) {
          vis.draw(ctx, canvas, dataArray, waveformArray)
        }
      })
    }

    draw()
  }, [activeVisualizations, isListening])

  useEffect(() => {
    if (isListening) {
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [isListening, animate])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleVisualization = (name: string) => {
    setActiveVisualizations(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {showControls && (
        <div className="absolute top-32 left-4 flex flex-col gap-4 bg-black/50 p-4 rounded-lg">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant="outline"
            className="bg-white text-black hover:bg-gray-200"
          >
            {isListening ? 'Stop Visualizer' : 'Start Visualizer'}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            {visualizations.current.map((vis) => (
              <div key={vis.name} className="flex items-center space-x-2">
                <Switch
                  id={`switch-${vis.name}`}
                  checked={activeVisualizations[vis.name]}
                  onCheckedChange={() => toggleVisualization(vis.name)}
                />
                <Label htmlFor={`switch-${vis.name}`} className="text-white">
                  {vis.name}
                </Label>
              </div>
            ))}
          </div>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            className="bg-white text-black hover:bg-gray-200"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}