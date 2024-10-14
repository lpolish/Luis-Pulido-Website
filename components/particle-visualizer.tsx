"use client"

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Fullscreen, Volume2 } from 'lucide-react'

const ParticleSystem = ({ audioData, sensitivity }) => {
  const particlesRef = useRef()
  const particleCount = 1000
  const [positions] = useState(() => new Float32Array(particleCount * 3))
  const [colors] = useState(() => new Float32Array(particleCount * 3))

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = Math.random()
    }
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const audioIndex = i % audioData.length
        const audioValue = audioData[audioIndex] * sensitivity

        positions[i3] += Math.sin(Date.now() * 0.001 + i) * 0.01 * audioValue
        positions[i3 + 1] += Math.cos(Date.now() * 0.002 + i) * 0.01 * audioValue
        positions[i3 + 2] += Math.sin(Date.now() * 0.001 + i) * 0.01 * audioValue
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors />
    </points>
  )
}

const Scene = ({ audioData, sensitivity }) => {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ParticleSystem audioData={audioData} sensitivity={sensitivity} />
      <OrbitControls />
    </>
  )
}

const ParticleVisualizer = () => {
  const [audioData, setAudioData] = useState(new Float32Array(128).fill(0.1))
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [sensitivity, setSensitivity] = useState(5)
  const [audioPermission, setAudioPermission] = useState(false)
  const analyserRef = useRef()
  const controlsTimeoutRef = useRef()

  useEffect(() => {
    let audioContext, analyser, microphone

    const setupAudio = async () => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyserRef.current = analyser
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        microphone = audioContext.createMediaStreamSource(stream)
        microphone.connect(analyser)
        setAudioPermission(true)
      } catch (err) {
        console.error('Error accessing the microphone', err)
        setAudioPermission(false)
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
    const updateAudioData = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(data)
        const normalizedData = Array.from(data).map(value => value / 255)
        setAudioData(normalizedData)
      }
      requestAnimationFrame(updateAudioData)
    }

    updateAudioData()
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
    clearTimeout(controlsTimeoutRef.current)
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

  if (!audioPermission) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Audio Permission Required</h1>
          <p>Please allow microphone access to use the particle visualizer.</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen" onMouseMove={handleMouseMove} onTouchStart={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <Scene audioData={audioData} sensitivity={sensitivity} />
      </Canvas>

      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black bg-opacity-50 p-4 rounded-lg">
          <Button onClick={toggleFullscreen} variant="ghost" className="text-white">
            <Fullscreen className="w-6 h-6" />
          </Button>
          <div className="flex items-center space-x-4">
            <Volume2 className="w-6 h-6 text-white" />
            <Slider
              value={[sensitivity]}
              onValueChange={([value]) => setSensitivity(value)}
              min={1}
              max={20}
              step={0.1}
              className="w-32"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticleVisualizer