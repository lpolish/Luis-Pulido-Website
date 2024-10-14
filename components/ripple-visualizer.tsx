"use client"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Fullscreen, Volume2 } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"

const RippleVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [sensitivity, setSensitivity] = useState(2)
  const [mainColor, setMainColor] = useState("#4a9eff")
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number>(0)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startVisualization = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyserRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      analyserRef.current!.getByteFrequencyData(dataArray)

      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      const scaledAverage = average * sensitivity / 255

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let i = 0; i < 5; i++) {
        const radius = (scaledAverage * 150) + (i * 50)
        const hue = (parseInt(mainColor.slice(1), 16) + i * 30) % 360

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
        gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0)`)
        gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, ${0.5 - i * 0.1})`)
        gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`)

        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${1 - i * 0.2})`
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Add particle effect
      for (let i = 0; i < 20; i++) {
        const particleRadius = Math.random() * 3 + 1
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * scaledAverage * 150

        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        ctx.beginPath()
        ctx.arc(x, y, particleRadius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${parseInt(mainColor.slice(1), 16)}, 100%, 50%, 0.8)`
        ctx.fill()
      }
    }

    animate()
  }, [mainColor, sensitivity])

  useEffect(() => {
    const setupAudioContext = async () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const analyser = audioContextRef.current.createAnalyser()
      analyser.fftSize = 1024
      analyserRef.current = analyser

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyser)
      } catch (err) {
        console.error('Error accessing the microphone', err)
      }

      startVisualization()
    }

    setupAudioContext()

    return () => {
      cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [startVisualization])

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleMouseMove)
    }
  }, [])

  const handleColorChange = (color: string) => {
    setMainColor(color)
  }

  return (
    <div className="relative w-full h-screen" onMouseMove={handleMouseMove} onTouchStart={handleMouseMove}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black bg-opacity-50 p-4 rounded-lg">
          <Button onClick={toggleFullscreen} variant="ghost" className="text-white">
            <Fullscreen className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-10 h-10 p-0">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: mainColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <HexColorPicker color={mainColor} onChange={handleColorChange} />
              </PopoverContent>
            </Popover>
            <Volume2 className="w-6 h-6 text-white" />
            <Slider
              value={[sensitivity]}
              onValueChange={([value]) => setSensitivity(value)}
              min={0.1}
              max={5}
              step={0.1}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RippleVisualizer