"use client"

import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const fragmentShader = `
  precision highp float;
  uniform vec2 resolution;
  uniform float time;
  uniform vec2 center;
  uniform float zoom;
  uniform vec3 color1;
  uniform vec3 color2;

  vec2 sqr( vec2 a )
  {
    return vec2( a.x*a.x - a.y*a.y, 2.0*a.x*a.y );
  }

  void main()
  {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    p = p / zoom + center;
    
    vec2 z = vec2(0.0);
    bool escaped = false;
    int iterations = 0;
    
    for(int i = 0; i < 1000; i++)
    {
      z = sqr(z) + p;
      if(dot(z,z) > 4.0)
      {
        escaped = true;
        break;
      }
      iterations = i;
    }
    
    if(escaped)
    {
      float smooth_i = float(iterations) + 1.0 - log(log(length(z)))/log(2.0);
      smooth_i = sqrt(smooth_i / 100.0);
      gl_FragColor = vec4(mix(color1, color2, smooth_i), 1.0);
    }
    else
    {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }
`

const FractalVisualizer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [center, setCenter] = useState<[number, number]>([-0.5, 0])
  const [zoom, setZoom] = useState(1)
  const [color1, setColor1] = useState<[number, number, number]>([1, 0, 0])
  const [color2, setColor2] = useState<[number, number, number]>([0, 0, 1])

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const newAudioContext = new AudioContextClass()
        setAudioContext(newAudioContext)

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const source = newAudioContext.createMediaStreamSource(stream)
        const newAnalyser = newAudioContext.createAnalyser()
        newAnalyser.fftSize = 256
        source.connect(newAnalyser)
        setAnalyser(newAnalyser)
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    }

    setupAudio()

    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close()
      }
    }
  }, [audioContext])

  useFrame(({ clock }) => {
    if (!meshRef.current || !analyser) return

    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)

    const lowerHalf = dataArray.slice(0, dataArray.length / 2)
    const upperHalf = dataArray.slice(dataArray.length / 2)
    const lowerMax = Math.max.apply(null, Array.from(lowerHalf))
    const upperAvg = Array.from(upperHalf).reduce((a, b) => a + b, 0) / upperHalf.length

    // Update zoom based on lower frequencies
    const targetZoom = 1 + (lowerMax / 256) * 10
    setZoom(prev => prev * 0.95 + targetZoom * 0.05)

    // Update colors based on higher frequencies
    const hue1 = (upperAvg / 256)
    const hue2 = (hue1 + 0.5) % 1
    setColor1([hue1, 1, 0.5])
    setColor2([hue2, 1, 0.5])

    // Slowly move the center for additional motion
    const t = clock.getElapsedTime() * 0.1
    setCenter([
      -0.5 + Math.sin(t) * 0.1,
      Math.cos(t) * 0.1
    ])

    if (meshRef.current.material instanceof THREE.ShaderMaterial) {
      meshRef.current.material.uniforms.time.value = clock.getElapsedTime()
      meshRef.current.material.uniforms.center.value = center
      meshRef.current.material.uniforms.zoom.value = zoom
      meshRef.current.material.uniforms.color1.value = new THREE.Color().setHSL(...color1)
      meshRef.current.material.uniforms.color2.value = new THREE.Color().setHSL(...color2)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        uniforms={{
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          time: { value: 0 },
          center: { value: new THREE.Vector2(-0.5, 0) },
          zoom: { value: 1 },
          color1: { value: new THREE.Color().setHSL(...color1) },
          color2: { value: new THREE.Color().setHSL(...color2) },
        }}
      />
    </mesh>
  )
}

export default FractalVisualizer