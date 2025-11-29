'use client';

import { Canvas } from '@react-three/fiber';
import DenseSphere from './components/DenseSphere';
import HamburgerMenu from './components/HamburgerMenu';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#141414] overflow-hidden">
      
      {/* 3D SCENE LAYER */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 9], fov: 50 }}
          dpr={[1, 2]} // Optimizes for retina screens
        >
          <DenseSphere />
        </Canvas>
      </div>

      {/* TEXT/UI LAYER
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter mix-blend-difference">
          Sina
        </h1>
      </div> */}

      {/* HAMBURGER MENU */}
      <HamburgerMenu />
    </main>
  );
}