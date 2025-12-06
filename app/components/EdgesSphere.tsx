'use client';

import { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgesSphereProps {
  position: [number, number, number];
  radius: number;
  scatterProgress: number;
}

export interface EdgesSphereHandle {
  triggerShine: () => void;
}

const EdgesSphere = forwardRef<EdgesSphereHandle, EdgesSphereProps>(
  ({ position, radius, scatterProgress }, ref) => {
    const lineSegmentsRef = useRef<THREE.LineSegments>(null);
    const clickTimestampRef = useRef<number | null>(null);
    const [shineProgress, setShineProgress] = useState(0);

    useImperativeHandle(ref, () => ({
      triggerShine: () => {
        clickTimestampRef.current = Date.now();
      },
    }), []);

  // Create edges geometry
  const edgesGeometry = useMemo(() => {
    const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const edges = new THREE.EdgesGeometry(sphereGeometry);
    return edges;
  }, [radius]);

  // Animate glow intensity
  useFrame(({ clock }) => {
    if (!lineSegmentsRef.current) return;

    const material = lineSegmentsRef.current.material as THREE.LineBasicMaterial;
    
    // Check if recently clicked (within 2 seconds)
    let shineAmount = 0;
    if (clickTimestampRef.current !== null) {
      const timeSinceClick = Date.now() - clickTimestampRef.current;
      const shineDuration = 2000; // 2 seconds
      
      if (timeSinceClick < shineDuration) {
        // Aggressive ease-out with multiple oscillations (lightning effect)
        const progress = timeSinceClick / shineDuration;
        const easeOut = 1 - Math.pow(progress, 1.5);
        
        // Add flickering/pulsing like lightning (5 rapid pulses in first 400ms)
        const flickerPhase = timeSinceClick % 400;
        const flicker = Math.sin(flickerPhase / 50) > 0.3 ? 1 : 0.3;
        
        shineAmount = easeOut * flicker;
        setShineProgress(shineAmount);
      } else {
        // Shine is over
        clickTimestampRef.current = null;
        setShineProgress(0);
      }
    }
    
    // Pulsate between 0.5 and 1.0 (normal glow)
    const pulse = (Math.sin(clock.getElapsedTime() * 2) + 1) / 2; // 0 to 1
    const glowIntensity = 0.5 + pulse * 0.5; // 0.5 to 1.0
    
    // Blend normal glow with shine effect - MUCH MORE AGGRESSIVE
    const finalIntensity = glowIntensity * (1 - shineAmount) + shineAmount * 3; // 3x multiplier instead of 0.7
    
    // Fade out during scatter
    const opacity = Math.max(0, 1 - scatterProgress * 1.5);
    material.opacity = Math.min(1, (finalIntensity + shineAmount * 1.5) * opacity); // 1.5x boost instead of 0.5
    
    // Interpolate color: cyan (#00ccff) → white (#ffffff) → electric blue on peak
    const baseColor = new THREE.Color(0x00ccff);
    const shineColor = new THREE.Color(0xffffff);
    const electricBlue = new THREE.Color(0x00ffff); // Bright cyan/electric blue
    
    let interpolatedColor: THREE.Color;
    if (shineAmount > 0.5) {
      // Peak shine: white to electric blue
      const peakBlend = (shineAmount - 0.5) * 2; // 0 to 1 at peak
      interpolatedColor = shineColor.clone().lerp(electricBlue, peakBlend * 0.6);
    } else {
      // Fade in: cyan to white
      const fadeIn = shineAmount * 2; // 0 to 1
      interpolatedColor = baseColor.clone().lerp(shineColor, fadeIn);
    }
    material.color.copy(interpolatedColor);
    
    material.linewidth = 2 + shineAmount * 3; // Line width increases during shine
  });

  return (
    <lineSegments
      ref={lineSegmentsRef}
      position={position}
      geometry={edgesGeometry}
    >
      <lineBasicMaterial
        color={0x00ccff}
        fog={false}
        transparent
        opacity={0.75}
      />
    </lineSegments>
  );
}
);

export default EdgesSphere;
