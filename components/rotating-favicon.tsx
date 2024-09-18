'use client'

import { useEffect, useRef } from 'react'

export default function RotatingFavicon() {
  const faviconRef = useRef<HTMLLinkElement | null>(null)
  const angleRef = useRef(0)
  const originalImageRef = useRef<HTMLImageElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    faviconRef.current = document.querySelector("link[rel*='icon']") || document.createElement('link')
    faviconRef.current.type = 'image/x-icon'
    faviconRef.current.rel = 'shortcut icon'
    document.getElementsByTagName('head')[0].appendChild(faviconRef.current)

    originalImageRef.current = new Image()
    originalImageRef.current.src = '/favicon.ico' // Update this path to your favicon
    originalImageRef.current.crossOrigin = 'anonymous'

    originalImageRef.current.onload = () => {
      animateFavicon()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const animateFavicon = () => {
    const rotateFavicon = () => {
      if (!originalImageRef.current) return

      const canvas = document.createElement('canvas')
      canvas.width = 32 // Standard favicon size
      canvas.height = 32
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      ctx.clearRect(0, 0, 32, 32)
      ctx.save()

      // Rotate around Y-axis
      angleRef.current += 0.02 // Very small increment for smoother rotation
      const scale = Math.cos(angleRef.current) * 0.2 + 0.8 // Scale between 0.6 and 1

      ctx.translate(16, 16)
      ctx.scale(scale, 1) // Only scale in X direction for Y-axis rotation effect
      ctx.translate(-16, -16)

      ctx.drawImage(originalImageRef.current, 0, 0, 32, 32)
      ctx.restore()

      if (faviconRef.current) {
        faviconRef.current.href = canvas.toDataURL('image/x-icon')
      }

      animationFrameRef.current = requestAnimationFrame(rotateFavicon)
    }

    rotateFavicon()
  }

  return null
}