import { Metadata } from 'next'
import { EnvironmentShowcase } from '@/components/environment-showcase'

export const metadata: Metadata = {
  title: 'Luis Pulido - Full Stack Software Engineer & Web Developer',
  description: 'Discover Luis Pulido, a full stack software engineer specializing in web development services using Next.js and Amazon Web Services. Explore his interactive 3D portfolio.',
  openGraph: {
    title: 'Luis Pulido - Full Stack Software Engineer & Web Developer',
    description: 'Discover Luis Pulido, a full stack software engineer specializing in web development services using Next.js and Amazon Web Services. Explore his interactive 3D portfolio.',
    url: 'https://luispulido.com',
    siteName: 'Luis Pulido Portfolio',
    images: [
      {
        url: 'https://luispulido.com/opengraph-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luis Pulido - Full Stack Software Engineer & Web Developer',
    description: 'Discover Luis Pulido, a full stack software engineer specializing in web development services using Next.js and Amazon Web Services. Explore his interactive 3D portfolio.',
    creator: '@pulidoman',
    images: ['https://luispulido.com/opengraph-image.png'],
  },
}

export default function Home() {
  return <EnvironmentShowcase />
}