import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Info, Maximize, Moon, Sun } from 'lucide-react';

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
  const [isDark, setIsDark] = useState<boolean>(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 });
  const hotspotRefs = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number | null>(null);

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

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

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
      alpha: true
    });
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

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      scenes[currentScene].image,
      (texture) => {
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        scenes[currentScene].hotspots.forEach((hotspot) => {
          const hotspotSize = isMobile ? 0.5 : 0.3;
          const hotspotGeometry = new THREE.SphereGeometry(hotspotSize, 16, 16);
          const hotspotMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066cc,
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
      (error) => {
        console.error('Error loading texture:', error);
        setIsLoading(false);
      }
    );

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

    if (cameraRef.current) {
      cameraRef.current.rotation.set(0, 0, 0);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [currentScene, isMobile]);

  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: 'transparent' }}>
      <div ref={containerRef} className="w-full h-full cursor-grab" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 animate-fade-in">
          <div className="text-white text-xl font-medium">
            Loading {scenes[currentScene].name}...
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-4 right-4 p-3 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:bg-card transition-all z-20 hover-lift"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      {/* Scene Info */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-card-foreground p-4 rounded-lg shadow-xl max-w-xs z-10 border border-border animate-slide-in-left">
        <h2 className="text-lg font-bold mb-1 text-primary">
          {scenes[currentScene].name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isMobile ? 'Swipe to look • Tap blue spheres' : 'Drag to look around • Click blue spheres to move'}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length)}
          className="p-3 bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-full border border-primary hover:bg-primary transition-all hover-lift"
          aria-label="Previous scene"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
          className="p-3 bg-primary/80 backdrop-blur-sm text-primary-foreground rounded-full border border-primary hover:bg-primary transition-all hover-lift"
          aria-label="Next scene"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Instructions */}
      {!isMobile && (
        <div className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-sm text-card-foreground p-3 rounded-lg shadow-lg flex items-center gap-2 text-sm z-10 border border-border animate-slide-in-right">
          <Info size={16} className="text-primary" />
          <span>Look for glowing blue spheres to navigate</span>
        </div>
      )}

      {/* Mobile hint */}
      {isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm text-card-foreground px-4 py-2 rounded-full text-xs flex items-center gap-2 z-10 border border-border animate-bounce-subtle">
          <Maximize size={12} className="text-primary" />
          <span>Rotate device for better view</span>
        </div>
      )}

      {/* Scene indicators */}
      <div className="absolute bottom-32 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {scenes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentScene(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentScene
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
            }`}
            aria-label={`Go to ${scenes[index].name}`}
          />
        ))}
      </div>
    </div>
  );
}