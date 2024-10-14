"use client"

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Glitch } from '@react-three/postprocessing'
import { UnrealBloomPass } from 'three-stdlib'
import { Fullscreen, Settings } from 'lucide-react'
import * as THREE from 'three'

extend({ UnrealBloomPass })

interface BeatDetectorProps {
  audioData: Uint8Array;
  onBeat: () => void;
}

const BeatDetector: React.FC<BeatDetectorProps> = ({ audioData, onBeat }) => {
  const energyThreshold = 1.15
  const beatHoldTime = 60
  const beatDecayRate = 0.98

  const [energy, setEnergy] = useState<number>(0)
  const [beatCutOff, setBeatCutOff] = useState<number>(0)
  const [beatTime, setBeatTime] = useState<number>(0)

  useEffect(() => {
    const currentEnergy = audioData.reduce((sum, amplitude) => sum + amplitude, 0) / audioData.length

    if (currentEnergy > beatCutOff && currentEnergy > energy) {
      onBeat()
      setBeatCutOff(currentEnergy * 1.1)
      setBeatTime(0)
    } else {
      if (beatTime <= beatHoldTime) {
        setBeatTime(beatTime + 1)
      } else {
        setBeatCutOff(beatCutOff * beatDecayRate)
        setBeatCutOff(Math.max(beatCutOff, energy * energyThreshold))
      }
    }

    setEnergy(currentEnergy)
  }, [audioData, onBeat, energy, beatCutOff, beatTime, energyThreshold, beatHoldTime, beatDecayRate])

  return null
}

interface AudioReactiveShapeProps {
  audioData: Uint8Array;
  beatDetected: boolean;
}

const AudioReactiveShape: React.FC<AudioReactiveShapeProps> = ({ audioData, beatDetected }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform float audioLevel;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 newPosition = position;
      newPosition += normal * sin(time * 2.0 + position.x * 10.0) * audioLevel * 0.2;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  const fragmentShader = `
    uniform float time;
    uniform float audioLevel;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec3 color = mix(color1, color2, sin(vUv.x * 10.0 + time) * 0.5 + 0.5);
      color = mix(color, color3, sin(vUv.y * 8.0 - time * 2.0) * 0.5 + 0.5);
      
      float pulse = sin(time * 4.0) * 0.5 + 0.5;
      color *= 1.0 + pulse * audioLevel;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    audioLevel: { value: 0 },
    color1: { value: new THREE.Color(0xff00ff) },
    color2: { value: new THREE.Color(0x00ffff) },
    color3: { value: new THREE.Color(0xffff00) },
  }), [])

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3

      const audioLevel = audioData.reduce((sum, value) => sum + value, 0) / audioData.length / 255
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.audioLevel.value = audioLevel

      if (beatDetected) {
        meshRef.current.scale.set(1.2, 1.2, 1.2)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

interface ParticleSystemProps {
  audioData: Uint8Array;
  beatDetected: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ audioData, beatDetected }) => {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 2000
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  })

  useFrame((state) => {
    if (particlesRef.current) {
      const audioLevel = audioData.reduce((sum, value) => sum + value, 0) / audioData.length / 255
      particlesRef.current.rotation.y += 0.001 + audioLevel * 0.05
      if (particlesRef.current.material instanceof THREE.PointsMaterial) {
        particlesRef.current.material.size = 0.05 + audioLevel * 0.2
      }

      if (beatDetected) {
        if (particlesRef.current.material instanceof THREE.PointsMaterial) {
          particlesRef.current.material.color.setHSL(Math.random(), 1, 0.5)
        }
      }

      const positionAttribute = particlesRef.current.geometry.getAttribute('position')
      const array = positionAttribute.array as Float32Array

      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01 * audioLevel
      }
      positionAttribute.needsUpdate = true
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={0xffffff}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </points>
  )
}

interface SceneProps {
  audioData: Uint8Array;
  effect: number;
  beatDetected: boolean;
}

const Scene: React.FC<SceneProps> = ({ audioData, effect, beatDetected }) => {
  const { camera } = useThree()

  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
    camera.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} />
      
      <AudioReactiveShape audioData={audioData} beatDetected={beatDetected} />
      <ParticleSystem audioData={audioData} beatDetected={beatDetected} />

      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Glitch 
          delay={new THREE.Vector2(1.5, 3.5)} 
          duration={new THREE.Vector2(0.6, 1.0)} 
          strength={new THREE.Vector2(0.3, 1.0)} 
        />
      </EffectComposer>
    </>
  )
}

const BeatVisualizer: React.FC = () => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128))
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [effect, setEffect] = useState<number>(0)
  const [audioPermission, setAudioPermission] = useState<boolean>(false)
  const [beatDetected, setBeatDetected] = useState<boolean>(false)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const controlsTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    let audioContext: AudioContext | undefined
    let analyser: AnalyserNode | undefined
    let microphone: MediaStreamAudioSourceNode | undefined

    const setupAudio = async () => {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
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
        setAudioData(data)
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
    if (controlsTimeoutRef.current !== null) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleMouseMove)
    }
  }, [])

  const handleBeat = () => {
    setBeatDetected(true)
    setTimeout(() => setBeatDetected(false), 100)
  }

  if (!audioPermission) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Permiso de Audio Requerido</h1>
          <p>Por favor, permite el acceso al micrófono para usar el visualizador de audio.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen" onMouseMove={handleMouseMove} onTouchStart={handleMouseMove}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene audioData={audioData} effect={effect} beatDetected={beatDetected} />
      </Canvas>

      <BeatDetector audioData={audioData} onBeat={handleBeat} />

      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black bg-opacity-50 p-4 rounded-lg">
          <button onClick={toggleFullscreen} className="text-white">
            <Fullscreen size={24} />
          </button>
          <div>
            <button onClick={() => setEffect((prev) => (prev + 1) % 3)} className="text-white ml-4">
              <Settings size={24} />
            </button>
            <span className="text-white ml-2">Effect: {effect + 1}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BeatVisualizer