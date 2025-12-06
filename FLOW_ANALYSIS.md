# Enigma77 - Complete Flow & Sequence Analysis

## Overview
This is a **sequential riddle experience** where actions happen in a specific order. The user must complete each step before moving to the next. Timing and synchronization are critical.

---

## Phase 1: Page Load & Initialization (0ms - User Interaction)

**What happens:**
- Canvas renders with camera at position `[0, 0, 30]` (far from the shape)
- DenseSphere initializes:
  - Creates 343 particles in a dense sphere formation
  - Applies "breathing" animation (oscillating expansion)
  - Renders the Angel model at center `[0, -1.8, 0]`
  - Creates lights: ambient, directional, and two point lights
  - Creates invisible hitbox around angel
  - Creates EdgesSphere (glowing border outline)
- AudioPlayer component waits for first user interaction (click/tap/key)
- Background music is NOT playing yet

**Visual State:**
- Dark background (#141414)
- Sphere visible but far away
- Gentle breathing/pulsing animation
- Cyan glow on sphere edges
- Angel model at center (faintly visible)

**Interaction Required:**
- First user interaction (click, tap, or keypress) anywhere on page

---

## Phase 2: First Dialogue Trigger (User First Click)

**Trigger:** User clicks on the shape

**What happens:**
1. **Raycast Detection** (DenseSphere.tsx line 207):
   - Detects if click hit the invisible hitbox
   - 300ms debounce prevents rapid successive clicks

2. **Audio Plays (Simultaneous events):**
   - `dialogue.mp3` plays (dialogue_1)
   - `thunderstorm.mp3` plays (sound effect)
   - Background music `music.mp3` starts (triggered by first interaction)

3. **Visual Effects (Simultaneous):**
   - EdgesSphere triggers "shine" effect (lightning-like glow)
   - Glow pulses with flickering for 2 seconds
   - Color transitions from cyan → white → electric blue

4. **State Update:**
   - `currentDialogueIndex` → 1
   - `isDialoguePlaying` → true (prevents multiple clicks)

**Duration:** ~dialogue.mp3 length (~5-10 seconds assumed)

**Audio Timeline:**
- Dialogue_1: 0-[duration1] seconds
- Thunderstorm: 0-[duration1] seconds
- Music: Starts and loops

---

## Phase 3: Listening for Keystroke Input (After Dialogue 1)

**Trigger:** After dialogue_1 audio finishes

**What happens:**
1. `isDialoguePlaying` → false
2. `isListeningForKeystrokes` → true
3. System now captures keyboard input

**Input Handling (useKeystrokeListener):**
- User types characters → added to input buffer
- Backspace → removes last character
- Enter key → submits the name

**Visual Feedback:**
- Currently NO visual display of typed text (this is a gap!)
- Input buffer exists but not rendered on screen

**Duration:** Indefinite until user presses Enter

---

## Phase 4: Second Dialogue Trigger (User's Second Click)

**Trigger:** User clicks on the shape again (after Phase 2 completes)

**What happens:**
1. Raycast detects second click (now at `currentDialogueIndex === 1`)
2. Same simultaneous effects as Phase 2:
   - `dialogue_2.mp3` plays
   - `thunderstorm.mp3` plays again
   - EdgesSphere shine effect triggers

3. **Critical State Change:**
   - `currentDialogueIndex` → 2
   - `isListeningForKeystrokes` → true (NOW listening for name input!)
   - `isDialoguePlaying` → true

**Duration:** ~dialogue_2.mp3 length

---

## Phase 5: Name Input (Active Keystroke Listening)

**Trigger:** After dialogue_2 finishes AND isListeningForKeystrokes is true

**What happens:**
- User types their name character by character
- Each character added to `inputBuffer`
- Backspace removes characters
- **Enter key submits:**
  - `submitName(inputBuffer)` called
  - `hasSubmittedName` → true
  - `userName` → stored with entered name

**No Visual Feedback Currently!** (Gap in UX)

**State After Submit:**
- `hasSubmittedName` → true
- `userName` → user's entered name
- Keystroke listening can stop

---

## Phase 6: Scatter Animation (After Name Submission)

**Trigger:** `hasSubmittedName` becomes true

**Duration:** 25 seconds (25000ms)

**Visual Effects (Simultaneous Over 25 Seconds):**

1. **Particle Scatter:**
   - Particles fly outward from sphere center
   - Distance: up to 50 units away
   - Easing: cubic ease-out (smooth deceleration)
   - Opacity fades from 1 → 0 (opacity multiplier: 1 - progress * 1.5)

2. **Angel Model:**
   - Opacity fades to 0 during scatter
   - Remains at center position

3. **Lights Fade:**
   - Ambient light: 0.2 → 0
   - Directional light: 1 → 0
   - Point lights: 50-90 → 0

4. **Group Rotation:**
   - Stops rotating when scatter begins
   - Final position holds

5. **EdgesSphere:**
   - Opacity fades during scatter

**Breathing Animation:**
- Only active when `scatterProgress < 1`
- When scatter active, breathing stops

---

## Phase 7: Welcome Overlay (During/After Scatter)

**Trigger:** `hasSubmittedName` is true

**What appears:**
- Full-screen semi-transparent overlay
- Fade-in animation: 5 seconds ease-out
- Background opacity: 0 → 0.95 (dark overlay)
- Text appears: **"{userName} welcome to enigma77"**
- Text animation: fade-in scale (0.8 → 1.0 scale)
- Font: 4xl to 6xl, bold, white, tracked

**Duration:** 5 seconds (transition time)

**Timing Overlap:**
- Scatter: 0-25s
- Welcome overlay animation: 0-5s (starts at scatter start)
- So overlay text is visible before full scatter completes

---

## Current Issues & Timing Concerns

### 🔴 Missing Visual Feedback
1. **Name input is invisible!**
   - User types but sees nothing
   - No visual confirmation of input
   - Could cause confusion

2. **No state indicators:**
   - Which phase are we in?
   - Is keystroke listening active?

### 🟡 Timing Assumptions (Not Verified)
1. Dialogue audio duration unknown
   - Can't verify Phase 3 → Phase 4 transition timing
   
2. Music loop timing
   - Unknown if music duration matches experience rhythm

3. Scatter duration (25s) might feel too long or short

### 🟡 State Progression Issues
1. **After Phase 4:** If user doesn't click 2nd time, nothing happens
   - System gets stuck waiting for second click

2. **After name submitted:** Experience ends
   - No subsequent interactions possible
   - No progression beyond scatter

---

## Complete Timing Sequence (Assumed)

```
0ms           - Page loads, breathing animation starts
[User Click]  - Click anywhere on shape to proceed
↓
0ms           - Dialogue 1 + Thunderstorm + Music starts
              - Shine effect on edges
2s            - Shine effect fades out
[Dialogue1]   - Dialogue plays (duration unknown, assume 5-10s)
↓
0ms           - Keystroke listening ACTIVE
              - User can type name
[User Click]  - Click again to proceed
↓
0ms           - Dialogue 2 + Thunderstorm plays
              - Shine effect triggers again
[Dialogue2]   - Plays (duration unknown)
↓
0ms           - KeystrokeListener ACTIVE
              - User types name
[User Press Enter] - Submits name
↓
0ms           - Scatter animation begins (25s)
              - Welcome overlay starts fade-in (5s)
0-5s          - Overlay text visible and expanding
5-25s         - Overlay stays visible while particles scatter
25s           - All particles gone, lights off, scene dark
[End]         - Experience complete
```

---

## Key Files & Their Responsibilities

| File | Responsibility | Key State |
|------|---|---|
| `DialogueContext.tsx` | Master state manager | `currentDialogueIndex`, `hasSubmittedName`, `isListeningForKeystrokes`, `userName` |
| `DenseSphere.tsx` | 3D scene, animations, clicks | Particle breathing/scatter, angel model |
| `AudioPlayer.tsx` | Background music | Waits for first interaction |
| `page.tsx` | Layout & welcome overlay | Shows overlay when `hasSubmittedName` |
| `EdgesSphere.tsx` | Glowing border effect | Shine animation on clicks |

---

## What Needs Fixing for a Complete Riddle

1. ✅ Phase 1 initialization - working
2. ✅ Phase 2 first dialogue - working  
3. ✅ Phase 3 keystroke listening - working (but invisible input!)
4. ✅ Phase 4 second dialogue - working
5. ✅ Phase 5 name submission - working
6. ✅ Phase 6 scatter animation - working
7. ✅ Phase 7 welcome overlay - working

**GAPS TO FILL:**
- Visual feedback for name input (show typed text)
- State indicators (which phase are we in?)
- What happens after scatter completes? (currently nothing)
- Angel animation needs to sync with narrative/dialogue
- Potential: Add more dialogue phases or branching logic
