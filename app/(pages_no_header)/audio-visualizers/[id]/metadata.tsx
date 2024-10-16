import { Metadata } from 'next'

type VisualizerMetadata = {
  [key: string]: Metadata
}

export const visualizerMetadata: VisualizerMetadata = {
  beat: {
    title: 'Beat Visualizer | Interactive Sound Visualization',
    description: 'Experience the rhythm with our Beat Visualizer. Watch as your music comes to life in pulsating visual form, transforming audio beats into a mesmerizing display of synchronized light and motion.',
    keywords: 'beat visualizer, rhythm visualization, interactive audio, web audio api, music visualization',
    openGraph: {
      title: 'Beat Visualizer - Feel the Rhythm',
      description: 'Transform your music into a visual spectacle with our Beat Visualizer. See every beat come alive!',
      images: [
        {
          url: '/images/og/beat-visualizer.png',
          width: 1200,
          height: 630,
          alt: 'Beat Visualizer Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Beat Visualizer - Feel the Rhythm',
      description: 'Transform your music into a visual spectacle with our Beat Visualizer. See every beat come alive!',
      images: ['/images/og/beat-visualizer.png'],
    },
  },
  spectrum: {
    title: 'Spectrum Visualizer | Interactive Sound Visualization',
    description: 'Explore the full spectrum of your audio with our Spectrum Visualizer. See your music in a new light as it unfolds across the frequency spectrum, revealing hidden patterns and textures in your favorite tracks.',
    keywords: 'spectrum visualizer, frequency visualization, audio spectrum, web audio api, music analysis',
    openGraph: {
      title: 'Spectrum Visualizer - See Your Sound',
      description: 'Dive into the full spectrum of your music. Visualize frequencies and discover the hidden beauty in your audio.',
      images: [
        {
          url: '/images/og/spectrum-visualizer.png',
          width: 1200,
          height: 630,
          alt: 'Spectrum Visualizer Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Spectrum Visualizer - See Your Sound',
      description: 'Dive into the full spectrum of your music. Visualize frequencies and discover the hidden beauty in your audio.',
      images: ['/images/og/spectrum-visualizer.png'],
    },
  },
  particle: {
    title: 'Particle Visualizer | Interactive Sound Visualization',
    description: 'Watch your music transform into a mesmerizing dance of particles with our Particle Visualizer. Experience sound as a dynamic, flowing visual spectacle that responds to every nuance of your audio.',
    keywords: 'particle visualizer, audio particles, interactive visualization, web audio api, generative art',
    openGraph: {
      title: 'Particle Visualizer - Your Music in Motion',
      description: 'See your sound come to life as a swarm of particles. Every beat, every note, visualized in stunning detail.',
      images: [
        {
          url: '/images/og/particle-visualizer.png',
          width: 1200,
          height: 630,
          alt: 'Particle Visualizer Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Particle Visualizer - Your Music in Motion',
      description: 'See your sound come to life as a swarm of particles. Every beat, every note, visualized in stunning detail.',
      images: ['/images/og/particle-visualizer.png'],
    },
  },
  ripple: {
    title: 'Ripple Visualizer | Interactive Sound Visualization',
    description: 'See your sound waves come to life with our Ripple Visualizer. A hypnotic journey through your audio landscape, where every sound creates ripples that interact and evolve in real-time.',
    keywords: 'ripple visualizer, wave visualization, interactive audio, web audio api, sound waves',
    openGraph: {
      title: 'Ripple Visualizer - Ride the Sound Waves',
      description: 'Immerse yourself in a sea of sound. Watch as your audio creates mesmerizing ripples and waves in real-time.',
      images: [
        {
          url: '/images/og/ripple-visualizer.png',
          width: 1200,
          height: 630,
          alt: 'Ripple Visualizer Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Ripple Visualizer - Ride the Sound Waves',
      description: 'Immerse yourself in a sea of sound. Watch as your audio creates mesmerizing ripples and waves in real-time.',
      images: ['/images/og/ripple-visualizer.png'],
    },
  },
  circular: {
    title: 'Circular Spectrum Visualizer | Interactive Sound Visualization',
    description: 'Experience sound in a new dimension with our Circular Spectrum Visualizer. Watch as your audio input transforms into a mesmerizing, colorful circular pattern that pulses and evolves in real-time, offering a unique 360-degree view of your sound.',
    keywords: 'circular spectrum, radial visualization, interactive audio, web audio api, 360 sound visualization',
    openGraph: {
      title: 'Circular Spectrum Visualizer - Sound in the Round',
      description: 'Transform sound into visual art with our real-time Circular Spectrum Visualizer. Experience your audio in full 360 degrees.',
      images: [
        {
          url: '/images/og/circular-spectrum-visualizer.jpg',
          width: 1200,
          height: 630,
          alt: 'Circular Spectrum Visualizer Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Circular Spectrum Visualizer - Sound in the Round',
      description: 'Transform sound into visual art with our real-time Circular Spectrum Visualizer. Experience your audio in full 360 degrees.',
      images: ['/images/og/circular-spectrum-visualizer.jpg'],
    },
  },
}