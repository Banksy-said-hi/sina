'use client';

import { Canvas } from '@react-three/fiber';
import DenseSphere from './components/DenseSphere';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-[#141414] overflow-hidden">
      
      {/* 3D SCENE LAYER */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 15], fov: 50 }}
          dpr={[1, 2]} // Optimizes for retina screens
        >
          <DenseSphere />
        </Canvas>
      </div>

      {/* TEXT/UI LAYER */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter mix-blend-difference">
          PORTFOLIO
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Interactive 3D Experience
        </p>

        {/* Enable pointer events on button so it's clickable */}
        <button className="pointer-events-auto px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition">
          Enter Site
        </button>

      </div>
    </main>
  );
}