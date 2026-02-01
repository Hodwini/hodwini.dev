export const ASCII_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';

export const CELL_WIDTH = 9;
export const CELL_HEIGHT = 15;

export const COLORS = {
  background: '#0d0d0d',
  logoText: 'rgba(255, 255, 255, 0.95)',
  glowCenter: 'rgba(255, 160, 60, 0.03)',
  glowEdge: 'rgba(255, 160, 60, 0)',
} as const;

export interface Cell {
  char: string;
  opacity: number;
  speed: number;
  phase: number;
  updateFreq: number;
}

