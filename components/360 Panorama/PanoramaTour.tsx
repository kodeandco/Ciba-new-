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
  color1: string;
  color2: string;
  color3: string;
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

  // Scenes with color schemes for procedural generation
  const scenes: Scene[] = [
    {
      name: "Main Workspace",
      color1: '#1e3a8a',
      color2: '#3b82f6',
      color3: '#60a5fa',
      hotspots: [
        { position: [5, 0, -3], nextScene: 1, label: "Go to Meeting Rooms" }
      ]
    },
    {
      name: "Meeting Rooms",
      color1: '#7c3aed',
      color2: '#a78bfa',
      color3: '#c4b5fd',
      hotspots: [
        { position: [-5, 0, 3], nextScene: 0, label: "Back to Main Workspace" },
        { position: [5, 0, 2], nextScene: 2, label: "Go to Innovation Lab" }
      ]
    },
    {
      name: "Innovation Lab",
      color1: '#059669',
      color2: '#10b981',
      color3: '#6ee7b7',
      hotspots: [
        { position: [-5, 0, -2], nextScene: 1, label: "Back to Meeting Rooms" },
        { position: [3, 0, -5], nextScene: 3, label: "Go to Lounge Area" }
      ]
    },
    {
      name: "Lounge Area",
      color1: '#dc2626',
      color2: '#f97316',
      color3: '#fbbf24',
      hotspots: [
        { position: [5, 0, 3], nextScene: 2, label: "Back to Innovation Lab" },
        { position: [-5, 0, -3], nextScene: 0, label: "Go to Main Workspace" }
      ]
    }
  ];

  // Generate a procedural 360° panorama texture
  const generatePanoramaTexture = (scene: Scene): THREE.Texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, scene.color1);
    gradient.addColorStop(0.5, scene.color2);
    gradient.addColorStop(1, scene.color3);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some visual interest - grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;

    // Vertical lines
    for (let x = 0; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < canvas.height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Add scene name text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(scene.name, canvas.width / 2, canvas.height / 2);

    // Add subtitle
    ctx.font = '36px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('CIBA WorkHub - 360° Tour', canvas.width / 2, canvas.height / 2 + 80);

    // Add decorative elements - dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 5 + 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

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

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      isMobile ? 85 : 75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

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

  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas || !cameraRef.current) return;

    const camera = cameraRef.current;

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

      const moveDistance = Math.sqrt(
        Math.pow(mouseRef.current.x - mouseRef.current.startX, 2) +
        Math.pow(mouseRef.current.y - mouseRef.current.startY, 2)
      );

      mouseRef.current.isDragging = false;

      if (moveDistance > 10) return;

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
      if (e.type === 'click' && !('ontouchstart' in window)) {
        const moveDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - mouseRef.current.startX, 2) +
          Math.pow(mouseRef.current.y - mouseRef.current.startY, 2)
        );

        if (moveDistance > 10) return;

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

  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    setIsLoading(true);
    const scene = sceneRef.current;

    // Clean up previous scene
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

    // Generate panorama texture
    const texture = generatePanoramaTexture(scenes[currentScene]);

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add hotspots
    scenes[currentScene].hotspots.forEach((hotspot) => {
      const hotspotSize = isMobile ? 0.6 : 0.4;
      const hotspotGeometry = new THREE.SphereGeometry(hotspotSize, 16, 16);
      const hotspotMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.85
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
    <div className="w-full h-screen overflow-hidden relative bg-black">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-50 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <div className="text-foreground text-base sm:text-xl font-medium px-4 text-center">
              Loading {scenes[currentScene].name}...
            </div>
          </div>
        </div>
      )}

      {/* Scene Info */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-card/90 backdrop-blur-md text-card-foreground p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg max-w-[90%] sm:max-w-xs z-10 border border-border animate-slide-in-left">
        <h2 className="text-base sm:text-lg font-bold mb-1 text-primary">
          {scenes[currentScene].name}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isMobile ? 'Swipe to explore • Tap purple spheres' : 'Drag to look around • Click purple spheres to move'}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-20 sm:bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length)}
          className="p-2 sm:p-3 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full border border-primary/50 hover:bg-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          aria-label="Previous scene"
        >
          <ChevronLeft size={isMobile ? 20 : 24} />
        </button>
        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
          className="p-2 sm:p-3 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full border border-primary/50 hover:bg-primary transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
          aria-label="Next scene"
        >
          <ChevronRight size={isMobile ? 20 : 24} />
        </button>
      </div>

      {/* Instructions - Desktop only */}
      {!isMobile && (
        <div className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-md text-card-foreground p-3 rounded-xl shadow-lg flex items-center gap-2 text-sm z-10 border border-border animate-slide-in-right max-w-xs">
          <Info size={16} className="text-primary flex-shrink-0" />
          <span>Look for glowing purple spheres to navigate</span>
        </div>
      )}

      {/* Mobile hint */}
      {isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-md text-card-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs flex items-center gap-1.5 sm:gap-2 z-10 border border-border animate-bounce-subtle max-w-[90%]">
          <Maximize size={12} className="text-primary flex-shrink-0" />
          <span className="whitespace-nowrap">Rotate device for better view</span>
        </div>
      )}

      {/* Scene indicators */}
      <div className="absolute bottom-32 sm:bottom-36 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScene(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${index === currentScene
                ? 'bg-primary w-6 sm:w-8 shadow-lg shadow-primary/50'
                : 'bg-muted w-1.5 sm:w-2 hover:bg-muted-foreground/60'
              }`}
            aria-label={`Go to ${scenes[index].name}`}
          />
        ))}
      </div>
    </div>
  );
}