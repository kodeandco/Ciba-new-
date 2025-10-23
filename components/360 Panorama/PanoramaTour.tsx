/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Info, Maximize } from 'lucide-react';

interface Hotspot {
  position: [number, number, number];
  nextScene: number;
  label: string;
}

interface Scene {
  name: string;
  image: string;
  hotspots: Hotspot[];
}

interface MouseState {
  x: number;
  y: number;
  isDragging: boolean;
  startX: number;
  startY: number;
}

export default function PanoramaTour() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 });
  const hotspotRefs = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Define your tour scenes with 360° images and hotspot positions
  const scenes: Scene[] = [
    {
      name: "Living Room",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2048&h=1024&fit=crop",
      hotspots: [
        { position: [5, 0, -3], nextScene: 1, label: "Go to Kitchen" }
      ]
    },
    {
      name: "Kitchen",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=2048&h=1024&fit=crop",
      hotspots: [
        { position: [-5, 0, 3], nextScene: 0, label: "Back to Living Room" },
        { position: [5, 0, 2], nextScene: 2, label: "Go to Bedroom" }
      ]
    },
    {
      name: "Bedroom",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=2048&h=1024&fit=crop",
      hotspots: [
        { position: [-5, 0, -2], nextScene: 1, label: "Back to Kitchen" }
      ]
    }
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 85 : 75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMobile]);

  // Separate effect for interaction handlers
  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas || !cameraRef.current) return;

    const camera = cameraRef.current;

    // Mouse/Touch handlers
    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      mouseRef.current.isDragging = true;

      const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
      mouseRef.current.startX = clientX;
      mouseRef.current.startY = clientY;
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mouseRef.current.isDragging) return;
      e.preventDefault();

      const clientX = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - mouseRef.current.x;
      const deltaY = clientY - mouseRef.current.y;

      const sensitivity = isMobile ? 0.008 : 0.005;

      camera.rotation.y += deltaX * sensitivity;
      camera.rotation.x += deltaY * sensitivity;

      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));

      mouseRef.current.x = clientX;
      mouseRef.current.y = clientY;
    };

    const handleEnd = (e: MouseEvent | TouchEvent) => {
      if (!mouseRef.current.isDragging) return;

      // Check if it was a drag
      const moveDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - mouseRef.current.startX, 2) +
        Math.pow(mouseRef.current.y - mouseRef.current.startY, 2)
      );

      mouseRef.current.isDragging = false;

      if (moveDistance > 10) return; // Was a drag, not a tap

      // Handle tap on mobile
      if ((e as TouchEvent).changedTouches) {
        const rect = canvas.getBoundingClientRect();
        const touch = (e as TouchEvent).changedTouches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2(x, y);
        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObjects(hotspotRefs.current);
        if (intersects.length > 0) {
          const nextScene = intersects[0].object.userData.nextScene as number;
          setCurrentScene(nextScene);
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Only handle mouse clicks (not touch)
      if (e.type === 'click' && !('ontouchstart' in window)) {
        // Check if it was a drag
        const moveDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - mouseRef.current.startX, 2) +
          Math.pow(mouseRef.current.y - mouseRef.current.startY, 2)
        );

        if (moveDistance > 10) return; // Was a drag, not a click

        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2(x, y);
        raycaster.setFromCamera(mouseVector, camera);

        const intersects = raycaster.intersectObjects(hotspotRefs.current);
        if (intersects.length > 0) {
          const nextScene = intersects[0].object.userData.nextScene as number;
          setCurrentScene(nextScene);
        }
      }
    };

    // Add event listeners
    canvas.addEventListener('mousedown', handleStart as EventListener);
    canvas.addEventListener('mousemove', handleMove as EventListener);
    canvas.addEventListener('mouseup', handleEnd as EventListener);
    canvas.addEventListener('mouseleave', handleEnd as EventListener);
    canvas.addEventListener('click', handleClick as EventListener);

    canvas.addEventListener('touchstart', handleStart as EventListener, { passive: false });
    canvas.addEventListener('touchmove', handleMove as EventListener, { passive: false });
    canvas.addEventListener('touchend', handleEnd as EventListener);
    canvas.addEventListener('touchcancel', handleEnd as EventListener);

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleStart as EventListener);
      canvas.removeEventListener('mousemove', handleMove as EventListener);
      canvas.removeEventListener('mouseup', handleEnd as EventListener);
      canvas.removeEventListener('mouseleave', handleEnd as EventListener);
      canvas.removeEventListener('click', handleClick as EventListener);
      canvas.removeEventListener('touchstart', handleStart as EventListener);
      canvas.removeEventListener('touchmove', handleMove as EventListener);
      canvas.removeEventListener('touchend', handleEnd as EventListener);
      canvas.removeEventListener('touchcancel', handleEnd as EventListener);
    };
  }, [isMobile, currentScene]);

  // Load scene
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    setIsLoading(true);
    const scene = sceneRef.current;

    // Clear existing objects
    while (scene.children.length > 0) {
      const child = scene.children[0];
      scene.remove(child);
      if ((child as THREE.Mesh).geometry) (child as THREE.Mesh).geometry.dispose();
      if ((child as THREE.Mesh).material) {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      }
    }
    hotspotRefs.current = [];

    // Load panorama
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      scenes[currentScene].image,
      (texture: any) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Add hotspots
        scenes[currentScene].hotspots.forEach((hotspot) => {
          const hotspotSize = isMobile ? 0.5 : 0.3;
          const hotspotGeometry = new THREE.SphereGeometry(hotspotSize, 16, 16);
          const hotspotMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
          });
          const hotspotMesh = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
          hotspotMesh.position.set(...hotspot.position);

          hotspotMesh.userData = {
            scale: 1,
            growing: true,
            nextScene: hotspot.nextScene
          };

          scene.add(hotspotMesh);
          hotspotRefs.current.push(hotspotMesh);
        });

        setIsLoading(false);
      },
      undefined,
      (error: any) => {
        console.error('Error loading texture:', error);
        setIsLoading(false);
      }
    );

    // Animate hotspots
    let animationId: number;
    const animateHotspots = () => {
      hotspotRefs.current.forEach((hotspot) => {
        if (hotspot.userData.growing) {
          hotspot.userData.scale += 0.02;
          if (hotspot.userData.scale >= 1.3) hotspot.userData.growing = false;
        } else {
          hotspot.userData.scale -= 0.02;
          if (hotspot.userData.scale <= 0.8) hotspot.userData.growing = true;
        }
        hotspot.scale.setScalar(hotspot.userData.scale);
      });
      animationId = requestAnimationFrame(animateHotspots);
    };
    animateHotspots();

    // Reset camera rotation
    if (cameraRef.current) {
      cameraRef.current.rotation.set(0, 0, 0);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [currentScene, isMobile]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      backgroundColor: 'transparent'
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab', backgroundColor: 'transparent' }} />

      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 50
        }}>
          <div style={{ color: 'white', fontSize: '20px' }}>
            Loading {scenes[currentScene].name}...
          </div>
        </div>
      )}

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '8px' : '16px',
        left: isMobile ? '8px' : '16px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: isMobile ? '8px 12px' : '8px 16px',
        borderRadius: '8px',
        maxWidth: '320px',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
          {scenes[currentScene].name}
        </h2>
        <p style={{ fontSize: isMobile ? '12px' : '14px', opacity: 0.8, margin: 0 }}>
          {isMobile ? 'Swipe to look • Tap cyan spheres' : 'Drag to look around • Click cyan spheres to move'}
        </p>
      </div>

      {/* Navigation buttons */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? '80px' : '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        zIndex: 10
      }}>
        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: isMobile ? '8px' : '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
        >
          <ChevronLeft size={isMobile ? 20 : 24} />
        </button>
        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: isMobile ? '8px' : '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)')}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')}
        >
          <ChevronRight size={isMobile ? 20 : 24} />
        </button>
      </div>

      {/* Instructions */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          zIndex: 10
        }}>
          <Info size={16} />
          <span>Look for glowing cyan spheres to navigate</span>
        </div>
      )}

      {/* Mobile hint */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          zIndex: 10
        }}>
          <Maximize size={12} />
          <span>Rotate device for better view</span>
        </div>
      )}
    </div>
  );
}