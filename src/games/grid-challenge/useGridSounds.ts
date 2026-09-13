'use client';

import { useRef, useCallback } from 'react';

export type GridSound =
  | 'blink'
  | 'symmetryShow'
  | 'correct'
  | 'wrong'
  | 'click'
  | 'levelComplete'
  | 'wrongRecall'
  | 'gameOver'
  | 'recallStart';

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ref.current) {
      ref.current = new (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
    }
    if (ref.current.state === 'suspended') ref.current.resume();
    return ref.current;
  } catch {
    return null;
  }
}

function tone(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  at: number
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

function sweep(
  ctx: AudioContext,
  f0: number,
  f1: number,
  duration: number,
  type: OscillatorType,
  gain: number,
  at: number
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(f0, at);
  osc.frequency.linearRampToValueAtTime(f1, at + duration);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

function noiseBurst(ctx: AudioContext, duration: number, gain: number, at: number) {
  const size = Math.ceil(ctx.sampleRate * duration);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  src.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  src.start(at);
}

export function useGridSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((sound: GridSound) => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;

    switch (sound) {
      case 'blink':
        // Soft high double-ping — "watch this dot"
        tone(ctx, 900, 0.18, 'sine', 0.18, t);
        tone(ctx, 1120, 0.14, 'sine', 0.10, t + 0.10);
        break;

      case 'symmetryShow':
        // Airy rising sweep — "puzzle incoming"
        sweep(ctx, 280, 560, 0.28, 'sine', 0.10, t);
        break;

      case 'correct':
        // Bright two-note chime — C5 → E5
        tone(ctx, 523, 0.14, 'sine', 0.28, t);
        tone(ctx, 659, 0.18, 'sine', 0.28, t + 0.10);
        break;

      case 'wrong':
        // Short descending growl
        tone(ctx, 240, 0.22, 'sawtooth', 0.13, t);
        tone(ctx, 180, 0.18, 'sawtooth', 0.09, t + 0.16);
        break;

      case 'click':
        // Crisp pop + tick
        noiseBurst(ctx, 0.05, 0.15, t);
        tone(ctx, 480, 0.10, 'sine', 0.18, t);
        break;

      case 'levelComplete':
        // C major ascending arpeggio: C4 E4 G4 C5
        [261, 330, 392, 523].forEach((f, i) => {
          tone(ctx, f, 0.22, 'sine', 0.28, t + i * 0.13);
        });
        // add a soft chord swell at the end
        tone(ctx, 523, 0.5, 'sine', 0.12, t + 0.55);
        tone(ctx, 659, 0.5, 'sine', 0.08, t + 0.55);
        break;

      case 'wrongRecall':
        // Heavy error buzz
        tone(ctx, 160, 0.30, 'square', 0.18, t);
        tone(ctx, 120, 0.22, 'square', 0.12, t + 0.18);
        break;

      case 'recallStart':
        // Ascending two-note alert — E5 → G5
        tone(ctx, 659, 0.14, 'sine', 0.22, t);
        tone(ctx, 784, 0.20, 'sine', 0.26, t + 0.13);
        break;

      case 'gameOver':
        // Descending arpeggio: C5 → Ab4 → F4 → C4
        [523, 415, 349, 261].forEach((f, i) => {
          tone(ctx, f, 0.26, 'sine', 0.24, t + i * 0.20);
        });
        break;
    }
  }, []);

  return { play };
}
