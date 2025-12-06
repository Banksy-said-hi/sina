/**
 * TypeScript Setup Documentation
 * 
 * This project follows strict TypeScript best practices with centralized type management.
 */

// ============================================================================
// TYPE ORGANIZATION STRUCTURE
// ============================================================================

/**
 * Location: app/types/index.ts
 * 
 * All application types are centralized in a single index file that exports:
 * - Interface definitions
 * - Type aliases
 * - Configuration constants
 * 
 * This approach provides:
 * ✓ Single source of truth for types
 * ✓ Easy to find and update types
 * ✓ Clean imports across the application
 * ✓ Type safety for configuration values
 */

// ============================================================================
// TYPE USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Component Props
 * 
 * import { OverlayProps, ThreeCanvasProps } from '@/app/types';
 * 
 * export default function Overlay(props: OverlayProps) { ... }
 */

/**
 * Example 2: Context Types
 * 
 * import { DialogueContextType } from '@/app/types';
 * 
 * const context = useContext(DialogueContext) as DialogueContextType;
 */

/**
 * Example 3: Configuration Constants
 * 
 * import { CLICKS_REQUIRED_FOR_INPUT, DISCORD_INVITE_URL } from '@/app/types';
 * 
 * if (currentClickCount === CLICKS_REQUIRED_FOR_INPUT) { ... }
 */

// ============================================================================
// ADDING NEW TYPES
// ============================================================================

/**
 * Step 1: Open app/types/index.ts
 * Step 2: Add your new type/interface above the export line
 * Step 3: Import and use in your component:
 * 
 *   import { YourNewType } from '@/app/types';
 *   
 *   function MyComponent(props: YourNewType) { ... }
 */

// ============================================================================
// FILE STRUCTURE
// ============================================================================

/**
 * app/
 * ├── types/
 * │   └── index.ts          ← All types centralized here
 * ├── components/
 * │   ├── ui/
 * │   │   └── Overlay.tsx   ← Uses OverlayProps
 * │   ├── overlays/
 * │   │   ├── InputPromptOverlay.tsx
 * │   │   ├── WelcomeOverlay.tsx
 * │   │   └── DiscordOverlay.tsx
 * │   ├── three/
 * │   │   └── ThreeCanvas.tsx  ← Uses ThreeCanvasProps
 * │   └── HamburgerMenu.tsx    ← Uses MenuItem
 * ├── context/
 * │   └── DialogueContext.tsx  ← Uses DialogueContextType
 * ├── constants/
 * │   └── animations.ts
 * └── page.tsx
 */

export {};
