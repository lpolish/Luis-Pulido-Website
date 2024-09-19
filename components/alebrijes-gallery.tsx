'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Share2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import MemoryGame from './memory-game'

const TOTAL_IMAGES = 153
const IMAGES_PER_PAGE = 20

const generateImages = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => ({
    id: end - i,
    src: `/alebrijes/image_${end - i}.jpg`,
    alt: `Alebrije ${end - i}`
  }))

export function AlebrijesGallery() {
  const [images, setImages] = useState(generateImages(TOTAL_IMAGES - IMAGES_PER_PAGE, TOTAL_IMAGES))
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const loader = useRef(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const openFullscreen = (index: number) => setSelectedImage(index)
  const closeFullscreen = () => {
    setSelectedImage(null)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const nextImage = () => {
    setSelectedImage(prev => (prev === images.length - 1 ? 0 : (prev || 0) + 1))
    resetZoomAndPosition()
  }
  const prevImage = () => {
    setSelectedImage(prev => (prev === 0 ? images.length - 1 : (prev || 0) - 1))
    resetZoomAndPosition()
  }

  const shareImage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this amazing Alebrije!',
        text: 'I found this beautiful Alebrije in an online gallery.',
        url: window.location.href,
      })
    } else {
      alert('Sharing is not supported on this device')
    }
  }

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0]
    if (target.isIntersecting && images.length < TOTAL_IMAGES) {
      setPage((prev) => prev + 1)
    }
  }

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 1))

  const handleImageMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (scale > 1 && imageRef.current) {
      const touch = e.touches[0]
      const rect = imageRef.current.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top
      setPosition({ x: -x * (scale - 1), y: -y * (scale - 1) })
    }
  }

  const resetZoomAndPosition = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    })
    if (loader.current) {
      observer.observe(loader.current)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (page > 1) {
      const newImages = generateImages(images.length, Math.min(images.length + IMAGES_PER_PAGE, TOTAL_IMAGES))
      setImages(prev => [...prev, ...newImages])
    }
  }, [page])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="bg-gray-900 text-white p-4">
      <div className="mt-24 mb-8 pt-2 max-w-[69rem] mx-auto">
        <p className="text-center text-lg sm:text-base mt-2">
          A collection of {TOTAL_IMAGES} colorful Alebrijes made every now and then using different generative models. Although they were created using AI and prompts, I would like to cheer to all the real alebrije artists out there who have been creating these creatures for years.
        </p>
        <p className="text-center text-xl sm:text-xl mt-5">
          Want to play them as a memory game? Click the button below!
        </p>
        <div className="flex justify-center mt-4 mx-auto">
          <MemoryGame asButton={true} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, i) => (
          <div key={image.id} className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              onClick={() => openFullscreen(i)}
            />
          </div>
        ))}
      </div>
      <div ref={loader} className="h-10 w-full"></div>
      <Dialog open={selectedImage !== null} onOpenChange={closeFullscreen}>
        <DialogContent className="max-w-none h-full m-0 p-0 bg-black">
          <div className="relative w-full h-full overflow-hidden" ref={imageRef}>
            {selectedImage !== null && (
              <div
                className="w-full h-full transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                }}
                onTouchMove={handleImageMove}
              >
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  layout="fill"
                  objectFit="contain"
                  className="select-none"
                />
              </div>
            )}
            <div className="absolute top-4 right-4 z-10">
              <Button variant="ghost" size="icon" onClick={closeFullscreen}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
              <Button variant="ghost" size="icon" onClick={prevImage}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <div className="flex gap-2">
                {isMobile && (
                  <>
                    <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                      <ZoomOut className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                      <ZoomIn className="h-6 w-6" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={shareImage}>
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={nextImage}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}