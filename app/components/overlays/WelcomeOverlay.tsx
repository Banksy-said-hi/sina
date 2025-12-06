'use client';

import { useDialogue } from '@/app/context/DialogueContext';
import Overlay from '@/app/components/ui/Overlay';

export default function WelcomeOverlay() {
  const { hasSubmittedName, userName, scatterComplete } = useDialogue();

  const isVisible = hasSubmittedName && !scatterComplete;

  return (
    <Overlay
      isVisible={isVisible}
      zIndex={25}
      backgroundColor="rgba(20, 20, 20, 0.95)"
      transitionDuration="0.3s"
    >
      <div className="text-center">
        <div
          className="text-5xl md:text-6xl font-bold text-white tracking-tighter"
          style={{
            animation: isVisible ? 'fadeInScale 0.3s ease-out' : 'none',
          }}
        >
          {userName}
        </div>
        <div
          className="text-xl md:text-2xl text-cyan-400 tracking-wide mt-4"
          style={{
            animation: isVisible ? 'fadeInScale 0.3s ease-out' : 'none',
          }}
        >
          welcome to enigma77
        </div>
      </div>
    </Overlay>
  );
}
