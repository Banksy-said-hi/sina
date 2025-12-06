'use client';

import { useEffect, useRef } from 'react';
import { logger } from '@/app/lib/logger';

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const startAudio = () => {
      if (hasStartedRef.current) return;
      if (!audioRef.current) {
        logger.log('Audio ref not available yet');
        return;
      }
      
      hasStartedRef.current = true;
      audioRef.current.volume = 0.3;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            logger.log('Music started playing');
          })
          .catch((err) => {
            logger.error('Error playing audio:', err);
            hasStartedRef.current = false; // Reset to try again
          });
      }
    };

    // Add listeners
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('keydown', startAudio);
    
    logger.log('Audio player mounted, waiting for user interaction...');

    return () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      preload="auto"
      src="/music.mp3"
    />
  );
}
