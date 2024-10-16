import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import LoadingFallback from '@/components/loading-fallback'
import { Metadata } from 'next'
import { visualizerMetadata } from './metadata'

const visualizers = {
  beat: dynamic(() => import('@/components/beat-visualizer'), { ssr: false }),
  spectrum: dynamic(() => import('@/components/spectrum-visualizer'), { ssr: false }),
  particle: dynamic(() => import('@/components/particle-visualizer'), { ssr: false }),
  ripple: dynamic(() => import('@/components/ripple-visualizer'), { ssr: false }),
  circular: dynamic(() => import('@/components/circular-spectrum'), { ssr: false }),
}

interface VisualizerPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: VisualizerPageProps): Promise<Metadata> {
  const { id } = params
  const metadata = visualizerMetadata[id]

  if (!metadata) {
    return {
      title: 'Visualizer Not Found',
      description: 'The requested audio visualizer does not exist.',
    }
  }

  return metadata
}

const VisualizerPage: React.FC<VisualizerPageProps> = ({ params }) => {
  const { id } = params
  const VisualizerComponent = visualizers[id as keyof typeof visualizers]

  if (!VisualizerComponent) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <VisualizerComponent />
    </Suspense>
  )
}

export default VisualizerPage