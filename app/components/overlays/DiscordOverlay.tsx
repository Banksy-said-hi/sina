'use client';

import { useDialogue } from '@/app/context/DialogueContext';
import Overlay from '@/app/components/ui/Overlay';
import { DISCORD_INVITE_URL } from '@/app/types';
import { validateExternalUrl } from '@/app/lib/security';

export default function DiscordOverlay() {
  const { scatterComplete } = useDialogue();

  const isVisible = scatterComplete;
  const isValidUrl = validateExternalUrl(DISCORD_INVITE_URL);

  const handleDiscordClick = () => {
    if (isValidUrl) {
      window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Overlay
      isVisible={isVisible}
      zIndex={30}
      transitionDuration="0.4s"
    >
      <div
        className="flex flex-col items-center gap-6 pointer-events-auto"
        style={{
          animation: isVisible ? 'fadeInScale 0.4s ease-out' : 'none',
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center">
          You've unlocked the inner circle
        </h2>

        <button
          onClick={handleDiscordClick}
          disabled={!isValidUrl}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Our Discord
        </button>

        <p className="text-sm md:text-base text-gray-400 text-center max-w-md">
          Welcome to the community
        </p>
      </div>
    </Overlay>
  );
}
