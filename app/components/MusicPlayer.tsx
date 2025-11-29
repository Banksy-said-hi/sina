'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;

      try {
        audioRef.current.volume = 0.3;
        
        // Wait for audio to be loadable
        await new Promise((resolve) => {
          const handleCanPlay = () => {
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            resolve(null);
          };
          audioRef.current?.addEventListener('canplay', handleCanPlay);
          
          // Timeout in case canplay never fires
          setTimeout(resolve, 500);
        });

        // Try unmuted first
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          return;
        }
      } catch (error) {
        console.log('Autoplay with sound failed, trying muted:', error);
        
        // Fallback: play muted, then unmute
        try {
          audioRef.current.muted = true;
          await audioRef.current.play();
          
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.muted = false;
              setIsPlaying(true);
            }
          }, 100);
        } catch (mutedError) {
          console.log('Muted autoplay also failed:', mutedError);
        }
      }
    };

    playAudio();
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/music.mp3"
      />
    </>
  );
}
