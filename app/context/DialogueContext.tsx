'use client';

import { createContext, useContext, useRef, useCallback, useState, useEffect } from 'react';
import { DialogueContextType, MAX_NAME_LENGTH, VALID_NAME_PATTERN, KEYBOARD_INPUT_THROTTLE_MS } from '@/app/types';

/**
 * Sanitize and validate user input
 * - Max length: 50 characters
 * - Allowed: alphanumeric, spaces, hyphens, apostrophes
 */
function sanitizeInput(input: string): string {
  // Remove any characters that don't match the pattern
  const sanitized = input.replace(/[^a-zA-Z0-9\s'-]/g, '');
  // Trim to max length
  return sanitized.slice(0, MAX_NAME_LENGTH);
}

const DialogueContext = createContext<DialogueContextType | undefined>(undefined);

export function DialogueProvider({ children }: { children: React.ReactNode }) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [isListeningForKeystrokes, setIsListeningForKeystrokes] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [hasSubmittedName, setHasSubmittedName] = useState(false);
  const [userName, setUserName] = useState('');
  const [scatterComplete, setScatterComplete] = useState(false);

  const advanceDialogue = useCallback(() => {
    setCurrentDialogueIndex((prev) => {
      const nextIndex = prev + 1;
      // Start listening for keystrokes after 5 clicks
      if (nextIndex === 5) {
        setIsListeningForKeystrokes(true);
      }
      return nextIndex;
    });
  }, []);

  const submitName = useCallback((name: string) => {
    // Validate and sanitize the name before storing
    const sanitizedName = sanitizeInput(name.trim());
    
    // Only submit if name is not empty after sanitization
    if (sanitizedName.length > 0) {
      setUserName(sanitizedName);
      setHasSubmittedName(true);
    }
  }, []);


  return (
    <DialogueContext.Provider value={{ advanceDialogue, currentDialogueIndex, isListeningForKeystrokes, inputBuffer, setInputBuffer, hasSubmittedName, userName, submitName, scatterComplete, setScatterComplete }}>
      {children}
    </DialogueContext.Provider>
  );
}

export function useDialogue() {
  const context = useContext(DialogueContext);
  if (!context) {
    throw new Error('useDialogue must be used within DialogueProvider');
  }
  return context;
}

export function useKeystrokeListener() {
  const { isListeningForKeystrokes, inputBuffer, setInputBuffer, submitName } = useDialogue();
  const lastKeyTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isListeningForKeystrokes) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Throttle keyboard input to prevent DOS attacks
      const now = Date.now();
      if (now - lastKeyTimeRef.current < KEYBOARD_INPUT_THROTTLE_MS) return;
      lastKeyTimeRef.current = now;

      if (event.key === 'Enter') {
        // User pressed Enter: submit the name
        if (inputBuffer.trim()) {
          submitName(inputBuffer);
        }
        setInputBuffer('');
      } else if (event.key === 'Backspace') {
        // Backspace: remove last character
        setInputBuffer((prev) => prev.slice(0, -1));
      } else if (event.key.length === 1) {
        // Regular character: sanitize before adding to buffer
        const sanitizedChar = sanitizeInput(event.key);
        
        // Only add character if it's valid and doesn't exceed max length
        setInputBuffer((prev) => {
          const newBuffer = prev + sanitizedChar;
          return sanitizeInput(newBuffer); // Ensure final buffer is valid
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListeningForKeystrokes, inputBuffer, setInputBuffer, submitName]);
}
