'use client';

import { useRef, useMemo, useLayoutEffect, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useDialogue } from '../context/DialogueContext';
import EdgesSphere from './EdgesSphere';

function AngelModel({ opacity = 1 }: { opacity?: number }) {
  const gltf = useGLTF('/angel.glb'); // Make sure to place your angel.glb in /public folder
  
  return (
    <primitive
      object={gltf.scene}
      position={[0, -1.8, 0]} // Adjusted Y to center the head, moved 10% upwards
      scale={[0.1, 0.1, 0.1]} // One tenth in size
      onUpdate={(obj) => {
        // Recursively update opacity of all materials in the angel model
        obj.traverse((child: any) => {
          if (child.material) {
            child.material.opacity = opacity;
            child.material.transparent = true;
          }
        });
      }}
    />
  );
}

export default function DenseSphere() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const hitBoxRef = useRef<THREE.Mesh>(null);
  const ambientLightRef = useRef<THREE.Light>(null);
  const directionalLightRef = useRef<THREE.Light>(null);
  const pointLight1Ref = useRef<THREE.Light>(null);
  const pointLight2Ref = useRef<THREE.Light>(null);
  const edgesSphereRef = useRef<{ triggerShine: () => void } | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const lastClickTimeRef = useRef(0);
  const [scatterProgress, setScatterProgress] = useState(0);
  const [lightColorIndex, setLightColorIndex] = useState(0);
  const scatterStartTimeRef = useRef<number | null>(null);
  const { advanceDialogue, hasSubmittedName, setScatterComplete } = useDialogue();
  const { camera, gl } = useThree() as {
    camera: THREE.PerspectiveCamera;
    gl: THREE.WebGLRenderer;
  };

  // --- CONFIGURATION ---
  // We scale down p5 units to Three.js units (approx /100)
  const boxSize = 0.3; 
  const spacing = 0.5; 
  const radius = 5;
  
  // Light color palette - cycles with each click
  const lightColors = ['#c8c8ff', '#ff1493', '#00ff00', '#ffaa00', '#00ffff', '#ff0000'];
  const currentLightColor = lightColors[lightColorIndex % lightColors.length];    
  
  // --- 1. CALCULATE POSITIONS (Runs once) ---
  const particles = useMemo(() => {
    const temp = [];
    const limit = Math.floor(radius / spacing);

    for (let x = -limit; x <= limit; x++) {
      for (let y = -limit; y <= limit; y++) {
        for (let z = -limit; z <= limit; z++) {
          let xPos = x * spacing;
          let yPos = y * spacing;
          let zPos = z * spacing;

          // Euclidean distance check
          const d = Math.sqrt(xPos ** 2 + yPos ** 2 + zPos ** 2);

          if (d < radius) {
            temp.push({ x: xPos, y: yPos, z: zPos });
          }
        }
      }
    }
    return temp;
  }, [radius, spacing]);

  // --- 2. SET INSTANCES (Runs once) ---
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    const tempObject = new THREE.Object3D();

    particles.forEach((particle, i) => {
      tempObject.position.set(particle.x, particle.y, particle.z);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particles]);

  // --- 2.3 LOAD TEXTURE ---
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  
  const materials = useMemo(() => {
    const brickTextureUrl = '/brick.jpg';
    const brickTexture = textureLoader.load(brickTextureUrl);
    const imageTextureUrl = '/image.png';
    const imageTexture = textureLoader.load(imageTextureUrl);
    
    // Brick material for 5 faces
    const brickMaterial = new THREE.MeshPhongMaterial({
      map: brickTexture,
      specular: '#1d1919ff',
      shininess: 1,
    });
    
    // Image material for 1 front face
    const imageMaterial = new THREE.MeshPhongMaterial({
      map: imageTexture,
      specular: '#ffffff',
      shininess: 90,
    });
    
    return [imageMaterial, brickMaterial, brickMaterial, brickMaterial, brickMaterial, brickMaterial];
  }, [textureLoader]);

  // --- 2.4 STORE ORIGINAL PARTICLE POSITIONS ---
  const originalPositions = useMemo(() => {
    return particles.map(p => new THREE.Vector3(p.x, p.y, p.z));
  }, [particles]);
  useLayoutEffect(() => {
    // Make near plane small so camera can enter the sphere without clipping
    if (camera) {
      camera.near = 0.001;
      camera.updateProjectionMatrix();
      // Start camera close to/inside the object so user scrolls back to see the whole thing
      if (camera.position.length() === 0) {
        camera.position.set(0, 0, 0.1);
      }
    }
  }, [camera]);

  // --- 2.6 CUSTOM WHEEL: move camera along view direction so scrolling zooms "inside" ---
  useEffect(() => {
    if (!gl || !camera) return;

    const el = gl.domElement;
    const tempDir = new THREE.Vector3();

    const onWheel = (e: WheelEvent) => {
      // prevent the browser from scrolling the page
      e.preventDefault();

      // Small multiplier so scroll isn't too fast; invert sign to make scroll-up zoom-in
      const delta = e.deltaY * 0.002;

      // Get forward direction and move camera along it
      camera.getWorldDirection(tempDir);
      camera.position.addScaledVector(tempDir, delta);
      camera.updateProjectionMatrix();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [gl, camera]);

  // --- 2.7 CLICK HANDLER: Raycast to hit box ---
  useEffect(() => {
    if (!gl || !camera) return;

    const el = gl.domElement;

    const onMouseDown = (event: MouseEvent) => {
      // Debounce: prevent multiple clicks within 300ms
      const now = Date.now();
      if (now - lastClickTimeRef.current < 300) return;
      lastClickTimeRef.current = now;

      // Get normalized device coordinates
      const rect = el.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      if (hitBoxRef.current) {
        const intersects = raycasterRef.current.intersectObject(hitBoxRef.current);
        if (intersects.length > 0) {
          advanceDialogue();
          // Cycle to next light color
          setLightColorIndex((prev) => prev + 1);
          // Trigger shine effect on EdgesSphere
          if (edgesSphereRef.current?.triggerShine) {
            edgesSphereRef.current.triggerShine();
          }
        }
      }
    };

    el.addEventListener('mousedown', onMouseDown);
    return () => el.removeEventListener('mousedown', onMouseDown);
  }, [gl, camera, advanceDialogue]);

  // --- 2.8 SCATTER ANIMATION: Trigger when name is submitted ---
  useEffect(() => {
    if (hasSubmittedName && scatterStartTimeRef.current === null) {
      scatterStartTimeRef.current = Date.now();
    }
  }, [hasSubmittedName]);

  // --- 2.9 UPDATE SCATTER PROGRESS ---
  useEffect(() => {
    if (!hasSubmittedName) return;

    const animationDuration = 5000; // 5 seconds (80% faster than original 25s)
    const interval = setInterval(() => {
      if (!scatterStartTimeRef.current) return;
      const elapsed = Date.now() - scatterStartTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);
      setScatterProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setScatterComplete(true); // Trigger reward display
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [hasSubmittedName, setScatterComplete]);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current && originalPositions.length > 0) {
      const tempObject = new THREE.Object3D();
      const tempDir = new THREE.Vector3();

      // Smooth step easing for scatter (cubic ease-out)
      const easedScatter = scatterProgress < 1 
        ? 1 - Math.pow(1 - scatterProgress, 3) 
        : 1;

      // Breathing oscillation: only apply if not scattering
      const breathe = scatterProgress < 1 
        ? (Math.sin(time * 1.2) + 1) / 2 
        : 0;
      const expandAmount = breathe * 6;

      originalPositions.forEach((originalPos, i) => {
        tempDir.copy(originalPos).normalize();
        
        let newPos: THREE.Vector3;
        
        if (scatterProgress > 0) {
          // Scatter phase: move particles outward rapidly
          const scatterDistance = 50 * easedScatter; // Particles fly up to 50 units away
          newPos = originalPos.clone().addScaledVector(tempDir, scatterDistance);
        } else {
          // Normal breathing phase
          newPos = originalPos.clone().addScaledVector(tempDir, expandAmount);
        }
        
        tempObject.position.copy(newPos);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(i, tempObject.matrix);
      });

      meshRef.current.instanceMatrix.needsUpdate = true;

      // Fade out particle opacity during scatter
      if (meshRef.current.material) {
        const materials = meshRef.current.material as THREE.Material[];
        materials.forEach((material: any) => {
          material.opacity = Math.max(0, 1 - scatterProgress * 1.5);
          material.transparent = true;
          material.needsUpdate = true;
        });
      }
    }

    // Fade out lights during scatter
    if (ambientLightRef.current) {
      (ambientLightRef.current as any).intensity = 0.2 * (1 - scatterProgress);
    }
    if (directionalLightRef.current) {
      (directionalLightRef.current as any).intensity = 1 * (1 - scatterProgress);
    }
    if (pointLight1Ref.current) {
      (pointLight1Ref.current as any).intensity = 50 * (1 - scatterProgress);
    }
    if (pointLight2Ref.current) {
      (pointLight2Ref.current as any).intensity = 90 * (1 - scatterProgress);
    }

    if (groupRef.current) {
      // Rotation logic (slower)
      if (scatterProgress < 1) {
        const angle = time * 0.06;
        groupRef.current.rotation.x = angle;
        groupRef.current.rotation.y = angle;
        groupRef.current.rotation.z = angle;
      }
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      
      {/* Lights matching your p5 sketch */}
      <ambientLight ref={ambientLightRef} intensity={0.2} />
      <directionalLight ref={directionalLightRef} position={[1, 1, -1]} intensity={1} />
      <pointLight ref={pointLight1Ref} position={[5, -5, 6]} intensity={80} distance={25} decay={2} color={currentLightColor} />
      {/* Light from top of angel's head */}
      <pointLight ref={pointLight2Ref} position={[0, 2, 0]} intensity={120} distance={20} decay={2} color={currentLightColor} />

      {/* Angel model at center */}
      <AngelModel opacity={Math.max(0, 1 - scatterProgress * 1.5)} />

      {/* Invisible hit box for dialogue interaction */}
      <mesh 
        ref={hitBoxRef}
        position={[0, -1.8, 0]}
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial 
          transparent 
          opacity={0}
          wireframe={false}
        />
      </mesh>

      {/* Glowing border sphere */}
      <EdgesSphere 
        ref={edgesSphereRef as any}
        position={[0, -1.8, 0]} 
        radius={1.5} 
        scatterProgress={scatterProgress} 
      />

      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[undefined, materials, particles.length]}>
          <boxGeometry args={[boxSize, boxSize, boxSize]} />
        </instancedMesh>
      </group>
    </>
  );
}