'use client';

import { useRef, useCallback } from 'react';

export type GameSound =
  | 'correct'     // right answer / level solved
  | 'wrong'       // wrong answer
  | 'gameOver'    // session ends
  | 'tick'        // timer urgent beat (≤5 s)
  | 'keypress'    // digit / key input
  | 'submit'      // confirm / submit action
  | 'move'        // piece moved (Motion)
  | 'levelWin'    // Motion level solved
  | 'skip';       // skip level (Motion)

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
  dur: number,
  type: OscillatorType,
  gain: number,
  at: number,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function sweep(
  ctx: AudioContext,
  f0: number,
  f1: number,
  dur: number,
  gain: number,
  at: number,
) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.connect(g);
  g.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(f0, at);
  osc.frequency.linearRampToValueAtTime(f1, at + dur);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function noisePop(ctx: AudioContext, dur: number, gain: number, at: number) {
  const size = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const g = ctx.createGain();
  src.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.start(at);
}

export function useGameSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = useCallback((sound: GameSound) => {
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    const t = ctx.currentTime;

    switch (sound) {
      // ── Correct / level solved ──────────────────────────────────────────────
      case 'correct':
        tone(ctx, 523, 0.12, 'sine', 0.26, t);        // C5
        tone(ctx, 659, 0.18, 'sine', 0.26, t + 0.10); // E5
        break;

      // ── Wrong answer ────────────────────────────────────────────────────────
      case 'wrong':
        tone(ctx, 240, 0.20, 'sawtooth', 0.12, t);
        tone(ctx, 185, 0.16, 'sawtooth', 0.08, t + 0.14);
        break;

      // ── Game over / results ─────────────────────────────────────────────────
      case 'gameOver':
        [523, 415, 330, 261].forEach((f, i) => {
          tone(ctx, f, 0.24, 'sine', 0.22, t + i * 0.18);
        });
        break;

      // ── Urgent timer tick ───────────────────────────────────────────────────
      case 'tick':
        tone(ctx, 880, 0.06, 'square', 0.08, t);
        break;

      // ── Digit / key input ───────────────────────────────────────────────────
      case 'keypress':
        noisePop(ctx, 0.04, 0.12, t);
        tone(ctx, 460, 0.08, 'sine', 0.14, t);
        break;

      // ── Submit ──────────────────────────────────────────────────────────────
      case 'submit':
        sweep(ctx, 400, 600, 0.18, 0.18, t);
        break;

      // ── Motion: piece moved ─────────────────────────────────────────────────
      case 'move':
        noisePop(ctx, 0.05, 0.10, t);
        tone(ctx, 320, 0.10, 'sine', 0.12, t);
        break;

      // ── Motion: level solved ────────────────────────────────────────────────
      case 'levelWin':
        [330, 415, 523].forEach((f, i) => {
          tone(ctx, f, 0.20, 'sine', 0.28, t + i * 0.11);
        });
        tone(ctx, 659, 0.40, 'sine', 0.20, t + 0.35);
        break;

      // ── Skip level ──────────────────────────────────────────────────────────
      case 'skip':
        sweep(ctx, 500, 280, 0.15, 0.12, t);
        break;
    }
  }, []);

  return { play };
}
