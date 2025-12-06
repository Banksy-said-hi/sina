/**
 * Dialogue Context Types
 */
export interface DialogueContextType {
  advanceDialogue: () => void;
  currentDialogueIndex: number;
  isListeningForKeystrokes: boolean;
  inputBuffer: string;
  setInputBuffer: (buffer: string) => void;
  hasSubmittedName: boolean;
  userName: string;
  submitName: (name: string) => void;
  scatterComplete: boolean;
  setScatterComplete: (complete: boolean) => void;
}

/**
 * Overlay Props Types
 */
export interface OverlayProps {
  isVisible: boolean;
  zIndex?: number;
  backgroundColor?: string;
  transitionDuration?: string;
  children: React.ReactNode;
}

/**
 * Three.js Canvas Props
 */
export interface ThreeCanvasProps {
  width?: string;
  height?: string;
}

/**
 * Animation Types
 */
export interface AnimationDurations {
  inputPrompt: string;
  welcome: string;
  discord: string;
}

/**
 * Menu Item Types
 */
export interface MenuItem {
  label: string;
  href: string;
}

/**
 * Dialogue Configuration
 */
export const CLICKS_REQUIRED_FOR_INPUT = 5;
export const DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/MDCheUbH';

/**
 * Security Configuration
 */
export const MAX_NAME_LENGTH = 50;
export const VALID_NAME_PATTERN = /^[a-zA-Z0-9\s'-]*$/;
export const KEYBOARD_INPUT_THROTTLE_MS = 50; // Prevent DOS attacks from rapid key input
