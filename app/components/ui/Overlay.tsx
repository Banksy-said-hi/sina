'use client';

import { OverlayProps } from '@/app/types';

export default function Overlay({
  isVisible,
  zIndex = 20,
  backgroundColor = 'rgba(20, 20, 20, 0)',
  transitionDuration = '0.3s',
  children,
}: OverlayProps) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{
        zIndex,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isVisible ? backgroundColor : 'rgba(20, 20, 20, 0)',
        transition: `all ${transitionDuration} ease-out`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {isVisible && children}
    </div>
  );
}
