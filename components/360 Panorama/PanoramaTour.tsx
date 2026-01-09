'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'

interface Hotspot {
  position: [number, number, number]
  nextScene: number
  label: string
}

interface Scene {
  name: string
  image: string
  hotspots: Hotspot[]
}

export default function PanoramaTour() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationRef = useRef<number | null>(null)
  const [currentScene, setCurrentScene] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })

  const scenes: Scene[] = [
    {
      name: 'Living Room',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2048&h=1024&fit=crop',
      hotspots: [{ position: [5, 0, -3], nextScene: 1, label: 'Go to Kitchen' }]
    },
    {
      name: 'Kitchen',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=2048&h=1024&fit=crop',
      hotspots: [
        { position: [-5, 0, 3], nextScene: 0, label: 'Back to Living Room' },
        { position: [5, 0, 2], nextScene: 2, label: 'Go to Bedroom' }
      ]
    },
    {
      name: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=2048&h=1024&fit=crop',
      hotspots: [{ position: [-5, 0, -2], nextScene: 1, label: 'Back to Kitchen' }]
    }
  ]

  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize Three.js
  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(isMobile ? 85 : 75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      if (cameraRef.current) {
        cameraRef.current.rotation.y = rotationRef.current.y
        cameraRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x))
      }
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isMobile])

  // Load panorama texture
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current) return
    const scene = sceneRef.current
    
    setIsLoading(true)

    // Clear previous
    while (scene.children.length > 0) {
      const child = scene.children[0]
      scene.remove(child)
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose()
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material as THREE.Material
        mat.dispose()
      }
    }

    const loader = new THREE.TextureLoader()
    loader.load(
      scenes[currentScene].image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        const geometry = new THREE.SphereGeometry(500, isMobile ? 32 : 60, isMobile ? 16 : 40)
        geometry.scale(-1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ map: texture })
        const sphere = new THREE.Mesh(geometry, material)
        scene.add(sphere)
        setIsLoading(false)
      },
      undefined,
      () => setIsLoading(false)
    )

    rotationRef.current = { x: 0, y: 0 }
  }, [currentScene, isMobile])

  // Mouse/Touch controls
  useEffect(() => {
    const canvas = rendererRef.current?.domElement
    if (!canvas) return

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      setIsDragging(true)
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      dragStartRef.current = { x: clientX, y: clientY }
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      
      const deltaX = clientX - dragStartRef.current.x
      const deltaY = clientY - dragStartRef.current.y
      
      rotationRef.current.y += deltaX * 0.005
      rotationRef.current.x += deltaY * 0.005
      
      dragStartRef.current = { x: clientX, y: clientY }
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onMouseDown)
    canvas.addEventListener('touchmove', onMouseMove)
    canvas.addEventListener('touchend', onMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onMouseDown)
      canvas.removeEventListener('touchmove', onMouseMove)
      canvas.removeEventListener('touchend', onMouseUp)
    }
  }, [isDragging])

  const goToNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1)
    }
  }

  const goToPrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1)
    }
  }

  const goToHome = () => {
    setCurrentScene(0)
  }

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-lg font-medium">Loading panorama...</div>
        </div>
      )}

      {/* Scene Info */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg">
        <h3 className="font-semibold text-lg">{scenes[currentScene].name}</h3>
        <p className="text-sm text-white/70">Drag to look around</p>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <button
          onClick={goToPrevScene}
          disabled={currentScene === 0}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToHome}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/90 transition-all"
        >
          <Home size={24} />
        </button>

        <button
          onClick={goToNextScene}
          disabled={currentScene === scenes.length - 1}
          className="bg-black/70 backdrop-blur-md text-white p-3 rounded-full hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scene Counter */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm">
        {currentScene + 1} / {scenes.length}
      </div>
    </div>
  )
}