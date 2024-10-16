"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Zap, Waves, Sparkles, Radio, Droplet, Code } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Visualizer {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  codeUrl: string;
  path: string;
}

const visualizers: Visualizer[] = [
  {
    id: 'beat',
    name: 'Beat Visualizer',
    description: 'Pulsating core ignites the party.',
    icon: Zap,
    color: '#FF6B6B',
    codeUrl: 'https://github.com/lpolish/Luis-Pulido-Website/blob/main/components/beat-visualizer.tsx',
    path: '/audio-visualizers/beat'
  },
  {
    id: 'spectrum',
    name: 'Spectrum Visualizer',
    description: 'Your music, your canvas, infinite possibilities.',
    icon: Waves,
    color: '#4ECDC4',
    codeUrl: 'https://github.com/lpolish/Luis-Pulido-Website/blob/main/components/spectrum-visualizer.tsx',
    path: '/audio-visualizers/spectrum'
  },
  {
    id: 'particle',
    name: 'Particle Visualizer',
    description: 'Cosmic dance of sound and light.',
    icon: Sparkles,
    color: '#45B7D1',
    codeUrl: 'https://github.com/lpolish/Luis-Pulido-Website/blob/main/components/particle-visualizer.tsx',
    path: '/audio-visualizers/particle'
  },
  {
    id: 'ripple',
    name: 'Ripple Visualizer',
    description: 'Hypnotic waves paint your audio journey.',
    icon: Droplet,
    color: '#6C5CE7',
    codeUrl: 'https://github.com/lpolish/Luis-Pulido-Website/blob/main/components/ripple-visualizer.tsx',
    path: '/audio-visualizers/ripple'
  },
  {
    id: 'circular',
    name: 'Circular Spectrum',
    description: 'Circular symphony of color and sound.',
    icon: Radio,
    color: '#FFA41B',
    codeUrl: 'https://github.com/lpolish/Luis-Pulido-Website/blob/main/components/circular-spectrum.tsx',
    path: '/audio-visualizers/circular'
  }
]

interface VisualizerCardProps {
  visualizer: Visualizer;
}

const VisualizerCard: React.FC<VisualizerCardProps> = ({ visualizer }) => {
  const router = useRouter()

  const handleLaunch = () => {
    router.push(visualizer.path)
  }

  const handleViewCode = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
    // The default behavior of opening the link in a new tab will occur
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gray-900 p-6 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLaunch}
      style={{
        boxShadow: `0 0 20px ${visualizer.color}40, 0 0 60px ${visualizer.color}20`
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-white">{visualizer.name}</h3>
        {React.createElement(visualizer.icon, { className: "w-8 h-8", style: { color: visualizer.color } })}
      </div>
      <p className="text-gray-300 mb-6">{visualizer.description}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleLaunch()
          }}
          className="flex items-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200 z-50"
        >
          <span className="mr-2">Launch</span>
          <ChevronRight className="w-5 h-5" />
        </button>
        <a
          href={visualizer.codeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200 z-50"
          onClick={handleViewCode}
        >
          <Code className="w-5 h-5 mr-2" />
          <span>View Code</span>
        </a>
      </div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${visualizer.color}, transparent)`,
        }}
      />
    </motion.div>
  )
}

const AudioVisualizerSelector: React.FC = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-white text-center mb-12 mt-8">
          Choose Your Audio Visualizer
        </h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {visualizers.map((visualizer) => (
            <VisualizerCard
              key={visualizer.id}
              visualizer={visualizer}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AudioVisualizerSelector