'use client';

import { useDialogue } from '@/app/context/DialogueContext';

/**
 * Progress Indicator Component
 * 
 * Shows the user which stage of the riddle they're at
 * Visual progression: clicks → name input → scatter → reward
 */
export default function ProgressIndicator() {
  const { currentDialogueIndex, isListeningForKeystrokes, hasSubmittedName, scatterComplete } = useDialogue();

  // Determine current stage
  const stage = hasSubmittedName ? (scatterComplete ? 4 : 3) : isListeningForKeystrokes ? 2 : 1;
  
  // Stage labels and descriptions
  const stages = [
    { label: 'Interact', description: 'Click the sphere' },
    { label: 'Name', description: 'Type your name' },
    { label: 'Reveal', description: 'Particles scatter' },
    { label: 'Unlock', description: 'Inner circle' },
  ];

  // Progress percentage (0-100)
  const progress = (stage / stages.length) * 100;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-8 md:right-8 z-20">
      {/* Progress bar background */}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        {/* Progress bar fill */}
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage indicators */}
      <div className="flex justify-between mt-3 gap-2">
        {stages.map((s, index) => {
          const isCompleted = index < stage - 1;
          const isCurrent = index === stage - 1;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Dot indicator */}
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-cyan-400 scale-125'
                    : isCompleted
                      ? 'bg-cyan-600'
                      : 'bg-white/20'
                }`}
              />
              
              {/* Label - hidden on mobile, shown on md+ */}
              <span
                className={`text-xs hidden md:block whitespace-nowrap transition-colors duration-300 ${
                  isCurrent
                    ? 'text-cyan-400 font-semibold'
                    : isCompleted
                      ? 'text-cyan-600'
                      : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current stage description - shown on mobile, hidden on md+ */}
      <div className="mt-2 md:hidden text-center">
        <p className="text-xs text-cyan-400 font-medium">
          {stages[stage - 1].description}
        </p>
      </div>
    </div>
  );
}
