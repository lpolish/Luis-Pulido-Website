import { Metadata } from 'next'
import AudioVisualizerSelector from '@/components/audio-visualizer-selector'

export const metadata: Metadata = {
  title: 'Audio Visualizer Selector | Interactive Sound Visualization',
  description: 'Explore our collection of interactive audio visualizers. Choose from beat, spectrum, particle, ripple, and circular visualizations to transform your music into stunning visual experiences.',
  keywords: 'audio visualizer, sound visualization, interactive audio, web audio api, music visualization',
  openGraph: {
    title: 'Audio Visualizer Selector - Choose Your Visual Experience',
    description: 'Dive into a world of sound and visuals. Select from our range of stunning audio visualizers and see your music come to life.',
    images: [
      {
        url: '/images/og/audio-visualizer-selector.png',
        width: 1200,
        height: 630,
        alt: 'Audio Visualizer Selector Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Audio Visualizer Selector - Choose Your Visual Experience',
    description: 'Dive into a world of sound and visuals. Select from our range of stunning audio visualizers and see your music come to life.',
    images: ['/images/og/audio-visualizer-selector.png'],
  },
}

export default function Page() {
  return <AudioVisualizerSelector />
}