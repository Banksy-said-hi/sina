'use client';

import { DialogueProvider } from './context/DialogueContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import KeystrokeListener from './components/KeystrokeListener';
import ThreeCanvas from './components/three/ThreeCanvas';
import HamburgerMenu from './components/HamburgerMenu';
import AudioPlayer from './components/AudioPlayer';
import ProgressIndicator from './components/ProgressIndicator';
import InputPromptOverlay from './components/overlays/InputPromptOverlay';
import WelcomeOverlay from './components/overlays/WelcomeOverlay';
import DiscordOverlay from './components/overlays/DiscordOverlay';
import { GoogleAnalytics } from './lib/analytics';
import { ANIMATIONS } from './constants/animations';

export default function Home() {
  return (
    <ErrorBoundary>
      <GoogleAnalytics />
      <DialogueProvider>
        <KeystrokeListener />
        <style>{ANIMATIONS.fadeInScale}</style>

        <main className="relative w-full h-screen bg-[#141414] overflow-hidden">
          {/* 3D Scene */}
          <ThreeCanvas />

        {/* UI Components */}
        <HamburgerMenu />
        <AudioPlayer />
        <ProgressIndicator />

        {/* Overlays */}
        <InputPromptOverlay />
        <WelcomeOverlay />
        <DiscordOverlay />
      </main>
      </DialogueProvider>
    </ErrorBoundary>
  );
}