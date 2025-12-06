'use client';

import { useKeystrokeListener } from '@/app/context/DialogueContext';

export default function KeystrokeListenerComponent() {
  useKeystrokeListener();
  return null;
}
