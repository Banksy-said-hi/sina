'use client';

import { useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export default function DenseSphere() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree() as {
    camera: THREE.PerspectiveCamera;
    gl: THREE.WebGLRenderer;
  };

  // --- CONFIGURATION ---
  // We scale down p5 units to Three.js units (approx /100)
  const boxSize = 0.3; 
  const spacing = 0.5; 
  const radius = 5;    
  
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
    const textureUrl = '/image.png';
    const texture = textureLoader.load(textureUrl);
    
    // Red material for non-textured faces
    const redMaterial = new THREE.MeshPhongMaterial({
      color: '#ff3232',
      specular: '#ffffff',
      shininess: 50,
    });
    
    // Material with texture for front face
    const textureMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      specular: '#ffffff',
      shininess: 50,
    });
    
    return [textureMaterial, redMaterial, redMaterial, redMaterial, redMaterial, redMaterial];
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

  // --- 3. ANIMATION LOOP (Runs every frame) ---
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (meshRef.current && originalPositions.length > 0) {
      const tempObject = new THREE.Object3D();
      const tempDir = new THREE.Vector3();

      // Breathing oscillation: 0 to 1 cycle (0 = normal, 1 = expanded, 0 = back to normal)
      const breathe = (Math.sin(time * 1.2) + 1) / 2; // Ranges from 0 to 1
      const expandAmount = breathe * 6; // Expand up to 6 units outward

      originalPositions.forEach((originalPos, i) => {
        // Get direction from center
        tempDir.copy(originalPos).normalize();
        
        // Create new position: move along direction by expand amount
        const newPos = originalPos.clone().addScaledVector(tempDir, expandAmount);
        
        tempObject.position.copy(newPos);
        tempObject.updateMatrix();
        meshRef.current!.setMatrixAt(i, tempObject.matrix);
      });

      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (groupRef.current) {
      // Rotation logic (slower)
      const angle = time * 0.06;
      groupRef.current.rotation.x = angle;
      groupRef.current.rotation.y = angle;
      groupRef.current.rotation.z = angle;
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      
      {/* Lights matching your p5 sketch */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[1, 1, -1]} intensity={1} />
      <pointLight position={[5, -5, 6]} intensity={50} distance={20} decay={2} color="#c8c8ff" />

      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[undefined, materials, particles.length]}>
          <boxGeometry args={[boxSize, boxSize, boxSize]} />
        </instancedMesh>
      </group>
    </>
  );
}