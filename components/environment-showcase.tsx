"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Text, Html, Billboard } from "@react-three/drei"
import * as THREE from 'three'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Menu, X, ZoomIn, ZoomOut, Play, Pause, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const environments = [
  "night",
  "city",
  "dawn",
  "forest",
  "lobby",
  "apartment",
  "park",
  "studio",
  "sunset",
  "warehouse",
] as const

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Latest Medical News", path: "https://medicaldevs.com" },
  { name: "Alebrijes Gallery", path: "/alebrijes", sameTarget: true },
  { name: "Audio Visualizers", path: "/audio-visualizers" },
  { name: "X", path: "https://twitter.com/pulidoman" },
  { name: "Instagram", path: "https://instagram.com/lu1s0n1" },
  { name: "More Links", path: "https://linktr.ee/polishai" },
  { name: "GitHub", path: "https://github.com/lpolish" },
  { name: "Book Pair Programming", path: "https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true" },
]

function createRandomShape(): THREE.ShapeGeometry {
  const shape = new THREE.Shape()
  const width = 2
  const height = 0.75

  shape.moveTo(-width / 2, -height / 2)

  for (let i = 0; i < 4; i++) {
    const x = i % 2 === 0 ? width / 2 : -width / 2
    const y = i < 2 ? height / 2 : -height / 2
    const controlX = (Math.random() - 0.5) * 0.2
    const controlY = (Math.random() - 0.5) * 0.2

    shape.quadraticCurveTo(x + controlX, y + controlY, x, y)
  }

  shape.closePath()
  return new THREE.ShapeGeometry(shape)
}

function AbstractForm() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry] = useState(() => {
    const baseGeometry = new THREE.IcosahedronGeometry(1, 1)
    const geometry = new THREE.BufferGeometry()
    const positions = baseGeometry.attributes.position.array.slice()
    const normals = baseGeometry.attributes.normal.array.slice()

    for (let i = 0; i < positions.length; i += 3) {
      const noise = Math.sin(positions[i] * 5) * 0.15 +
        Math.sin(positions[i + 1] * 5) * 0.15 +
        Math.sin(positions[i + 2] * 5) * 0.15
      positions[i] += normals[i] * noise
      positions[i + 1] += normals[i + 1] * noise
      positions[i + 2] += normals[i + 2] * noise
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.computeVertexNormals()
    return geometry
  })

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color="#ffffff" metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

interface FloatingLinkProps {
  children: React.ReactNode
  href?: string
  position: [number, number, number]
  onClick?: () => void
  isContactFormOpen: boolean
  sameTarget?: boolean
}

function FloatingLink({ children, href, position, onClick, isContactFormOpen, sameTarget = false }: FloatingLinkProps) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)
  const shapeGeometry = useRef<THREE.ShapeGeometry>(createRandomShape())
  const target = sameTarget ? "_self" : "_blank"

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position)
    }
  })

  return (
    <group position={position} ref={groupRef}>
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <mesh geometry={shapeGeometry.current}>
          <meshBasicMaterial color="#000000" opacity={0.5} transparent />
        </mesh>
        <Text
          fontSize={0.15}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          position={[0, 0, 0.01]}
          color="#ffffff"
        >
          {children as string}
        </Text>
        <Html transform distanceFactor={10} style={{ display: isContactFormOpen ? 'none' : 'block' }}>
          <div className="bg-black bg-opacity-50 p-2 rounded">
            {onClick ? (
              <button onClick={onClick} className="text-white hover:text-blue-300 transition-colors">
                {children}
              </button>
            ) : (
              <a href={href} target={target} rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors">
                {children}
              </a>
            )}
          </div>
        </Html>
      </Billboard>
    </group>
  )
}

interface SceneProps {
  environment: typeof environments[number]
  setShowContactForm: (show: boolean) => void
  isContactFormOpen: boolean
}

// <!-- Google Calendar Appointment Scheduling begin -->
// <link href="https://calendar.google.com/calendar/scheduling-button-script.css" rel="stylesheet">
// <script src="https://calendar.google.com/calendar/scheduling-button-script.js" async></script>
// <script>
// (function() {
//   var target = document.currentScript;
//   window.addEventListener('load', function() {
//     calendar.schedulingButton.load({
//       url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1XxJTsN0LfqR5uMsw_nRudXRVb23OZjMymSThFjbsqbQq3EO6Q2Fh0SHzgpR_yfDG4fSxQEREU?gv=true',
//       color: '#039BE5',
//       label: 'Book an appointment',
//       target,
//     });
//   });
// })();
// </script>
// <!-- end Google Calendar Appointment Scheduling --></link>

// <!-- Google Calendar Appointment Scheduling begin -->
// <link href="https://calendar.google.com/calendar/scheduling-button-script.css" rel="stylesheet">
// <script src="https://calendar.google.com/calendar/scheduling-button-script.js" async></script>
// <script>
// (function() {
//   var target = document.currentScript;
//   window.addEventListener('load', function() {
//     calendar.schedulingButton.load({
//       url: 'https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true',
//       color: '#039BE5',
//       label: 'Book an appointment',
//       target,
//     });
//   });
// })();
// </script>
// <!-- end Google Calendar Appointment Scheduling --></link>

function Scene({ environment, setShowContactForm, isContactFormOpen }: SceneProps) {
  return (
    <>
      <Environment preset={environment} background />
      <AbstractForm />
      <FloatingLink href="https://medicaldevs.com" position={[-6, 2, -5]} isContactFormOpen={isContactFormOpen}>Latest Medical News</FloatingLink>
      <FloatingLink href="/alebrijes" position={[0, 4, -7]} isContactFormOpen={isContactFormOpen} sameTarget={true}>Alebrijes Gallery</FloatingLink>
      <FloatingLink href="https://twitter.com/pulidoman" position={[6, -2, -5]} isContactFormOpen={isContactFormOpen}>X</FloatingLink>
      <FloatingLink href="https://instagram.com/lu1s0n1" position={[-6, -1, -4]} isContactFormOpen={isContactFormOpen}>Instagram</FloatingLink>
      <FloatingLink href="/audio-visualizers" position={[4, 3, -6]} isContactFormOpen={isContactFormOpen} sameTarget={true}>Audio Visualizers</FloatingLink>
      <FloatingLink href="https://linktr.ee/polishai" position={[6, 1, -6]} isContactFormOpen={isContactFormOpen}>Linktree</FloatingLink>
      <FloatingLink href="https://github.com/lpolish" position={[6, 4, -6]} isContactFormOpen={isContactFormOpen}>GitHub</FloatingLink>
      <FloatingLink href="https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true" position={[-4, 4, -7]} isContactFormOpen={isContactFormOpen}>Book Pair Programming</FloatingLink>
      <FloatingLink position={[-3, -2, -6]} onClick={() => setShowContactForm(true)} isContactFormOpen={isContactFormOpen}>Contact</FloatingLink>
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </>
  )
}

interface ContactFormProps {
  onClose: () => void
}

function ContactForm({ onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSubmitted(true)
    } catch (error) {
      setSubmitError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4 z-[99999999]"
    >
      <div className="bg-gray-900 text-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isSubmitted ? "Thank You!" : "Contact Me"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg mb-4">Your message has been sent successfully!</p>
              <p>I&apos;ll get back to you as soon as possible.</p>
              <Button onClick={onClose} className="mt-6">
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="contact-form"
              onSubmit={handleSubmit}
              className="space-y-4 z-[99999999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <Input id="name" name="name" type="text" placeholder="Your name" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="Your email" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <Textarea id="message" name="message" placeholder="Your message" required className="bg-gray-800 border-gray-700 text-white" />
              </div>
              {submitError && <p className="text-red-500" role="alert">{submitError}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function EnvironmentShowcase() {
  const [currentEnv, setCurrentEnv] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const orbitControlsRef = useRef<any>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  const nextEnv = useCallback(() => {
    setCurrentEnv((prev) => (prev + 1) % environments.length)
  }, [])

  const prevEnv = useCallback(() => {
    setCurrentEnv((prev) => (prev - 1 + environments.length) % environments.length)
  }, [])

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.zoom *= 1.1
      cameraRef.current.updateProjectionMatrix()
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.zoom /= 1.1
      cameraRef.current.updateProjectionMatrix()
    }
  }

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => !prev)
  }

  useEffect(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  const buttonClass = "w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-colors rounded-full flex items-center justify-center"

  return (
    <div className="w-full h-screen relative flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-[99999999] bg-black bg-opacity-50 text-white backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="upptercase text-xl sm:text-2xl font-bold cursor-default text-gray-100 hover:text-white transition-colors">Luis Pulido Díaz</h1>
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div className="absolute top-[60px] left-0 right-0 z-10 bg-black bg-opacity-30 text-white backdrop-blur-md">
        <div className="container mx-auto px-4 py-2">
          <p className="uppercase text-2xs text-left">
            <a className="hover:underline cursor-pointer text-2xs" onClick={(e) => { e.preventDefault(); setShowContactForm(true) }}>Contact Me to Build Your Next Web Project</a> or <a className="hover:underline cursor-pointer text-2xs" href="https://calendar.google.com/calendar/appointments/AcZssZ1x_Avc7CEO0ABnqDxWR8vuSoZ9SwKV3llSUu4=?gv=true" target="_blank" rel="noopener noreferrer">Book a Pair Programming Session</a>
          </p>
        </div>
      </div>
      {menuOpen && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-0 left-0 w-full h-full z-[99999999] bg-black bg-opacity-95 text-white px-12 pb-12 pt-12 md:pt-36 backdrop-blur-md text-center"
            >
              <X className="h-6 w-6 absolute top-4 right-4 cursor-pointer" onClick={() => setMenuOpen(false)} />
              {menuItems.map((item) => (
                <a key={item.path} href={item.path} target={item.sameTarget ? '_self' : '_blank'} rel="noopener noreferrer" className="block py-2 hover:text-blue-300 transition-colors mb-4 md:mb-8">
                  {item.name}
                </a>
              ))}
              <button onClick={() => setShowContactForm(true)} className="block py-2 hover:text-blue-300 transition-colors mx-auto">
                Contact
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <div className="flex-grow">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} ref={cameraRef} />
          <Scene environment={environments[currentEnv]} setShowContactForm={setShowContactForm} isContactFormOpen={showContactForm} />
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={20}
            autoRotate={autoRotate}
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>
      <div className="absolute bottom-24 md:bottom-0 left-4 right-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={prevEnv} variant="outline" size="icon" className={buttonClass}>
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button onClick={nextEnv} variant="outline" size="icon" className={buttonClass}>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleZoomIn} variant="outline" size="icon" className={buttonClass}>
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button onClick={handleZoomOut} variant="outline" size="icon" className={buttonClass}>
            <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button onClick={toggleAutoRotate} variant="outline" size="icon" className={buttonClass}>
            {autoRotate ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
      </AnimatePresence>
    </div>
  )
}
