'use client';

import { useDialogue } from '@/app/context/DialogueContext';
import Overlay from '@/app/components/ui/Overlay';

export default function InputPromptOverlay() {
  const { isListeningForKeystrokes, hasSubmittedName, inputBuffer } = useDialogue();

  const isVisible = isListeningForKeystrokes && !hasSubmittedName;

  return (
    <Overlay isVisible={isVisible} zIndex={25} transitionDuration="0.5s">
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-white tracking-wide mb-4">
          type your name and enter
        </div>
        <div className="text-lg md:text-xl text-cyan-400 font-mono tracking-wider">
          {inputBuffer}
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </Overlay>
  );
}
