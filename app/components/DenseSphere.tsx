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
  const boxSize = 0.2; 
  const spacing = 0.5; 
  const radius = 3;    
  
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

  // --- 2.5 CAMERA CONFIG (Runs once) ---
  useLayoutEffect(() => {
    // Make near plane small so camera can enter the sphere without clipping
    if (camera) {
      camera.near = 0.01;
      camera.updateProjectionMatrix();
      // If the camera is still at origin, move it out along z so zoom starts outside
      if (camera.position.length() === 0) {
        camera.position.set(0, 0, 10);
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
    
    if (groupRef.current) {
      // Rotation logic (slower)
      const angle = time * 0.06;
      groupRef.current.rotation.x = angle;
      groupRef.current.rotation.y = angle;
      groupRef.current.rotation.z = angle;

      // Oscillation logic (reduced amplitude and slower frequency)
      const oscillation = Math.sin(time * 0.6) * 0.6;
      groupRef.current.position.set(oscillation, oscillation, oscillation);
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
        <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]}>
          <boxGeometry args={[boxSize, boxSize, boxSize]} />
          <meshPhongMaterial 
            color="#ff3232" 
            specular="#ffffff" 
            shininess={10} 
          />
        </instancedMesh>
      </group>
    </>
  );
}