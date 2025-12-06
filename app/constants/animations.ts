export const ANIMATIONS = {
  fadeInScale: `
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
};

export const ANIMATION_DURATIONS = {
  inputPrompt: '0.5s',
  welcome: '0.3s',
  discord: '0.4s',
} as const;
