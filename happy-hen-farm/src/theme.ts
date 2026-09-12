import {spring as remotionSpring} from 'remotion';
import type {SpringConfig} from 'remotion';

// Central color palette & shared style constants
export const palette = {
  cream: '#FDF6E3',
  straw: '#F4D35E',
  leaf: '#7CB342',
  leafAlt: '#A8E6CF',
  sky: '#81D4FA',
  henRed: '#EF5350',
  henOrange: '#FF8A65',
  brown: '#8D6E63',
  white: '#FFFFFF',
} as const;

// Scene timings (seconds) -> frame conversions at 30fps
export const FPS = 30;

// Remotion's spring() requires fps in this version; wrap it so callers
// don't have to pass fps every time.
export function spring(args: {
  frame: number;
  from?: number;
  to?: number;
  config?: Partial<SpringConfig>;
  durationInFrames?: number;
  durationRestThreshold?: number;
  delay?: number;
  reverse?: boolean;
}): number {
  return remotionSpring({fps: FPS, ...args});
}

export const sceneTimingsSec = {
  title: {start: 0, end: 8},
  meet: {start: 8, end: 22},
  shelter: {start: 22, end: 42},
  food: {start: 42, end: 65},
  health: {start: 65, end: 88},
  play: {start: 88, end: 112},
  result: {start: 112, end: 135},
  outro: {start: 135, end: 150},
} as const;

export function secondsToFrames(seconds: number): number {
  return Math.round(seconds * FPS);
}

export const sceneFrames = Object.fromEntries(
  Object.entries(sceneTimingsSec).map(([name, {start, end}]) => [
    name,
    {start: secondsToFrames(start), duration: secondsToFrames(end - start)},
  ])
) as Record<
  keyof typeof sceneTimingsSec,
  {start: number; duration: number}
>;