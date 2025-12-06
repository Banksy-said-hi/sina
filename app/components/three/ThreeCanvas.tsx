'use client';

import { Canvas } from '@react-three/fiber';
import DenseSphere from '../DenseSphere';
import { ThreeCanvasProps } from '@/app/types';

export default function ThreeCanvas({ width = 'w-full', height = 'h-screen' }: ThreeCanvasProps) {
  return (
    <div className={`absolute inset-0 z-0 ${width} ${height}`}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 50 }}
        dpr={[1, 2]}
      >
        <DenseSphere />
      </Canvas>
    </div>
  );
}
