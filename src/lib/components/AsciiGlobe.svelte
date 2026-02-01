<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    ASCII_CHARS,
    CELL_WIDTH,
    CELL_HEIGHT,
    COLORS
  } from '../canvas/ascii-config';
  import type { Cell } from '../canvas/ascii-config';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationId: number;
  let cells: Cell[][] = [];
  
  let cols = 0;
  let rows = 0;
  let centerX = 0;
  let centerY = 0;
  let radiusX = 0;
  let radiusY = 0;

  function getRandomChar(): string {
    return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }

  function isInsideEllipse(x: number, y: number): boolean {
    const nx = (x - centerX) / radiusX;
    const ny = (y - centerY) / radiusY;
    return (nx * nx + ny * ny) <= 1;
  }

  function getDistanceFromCenter(x: number, y: number): number {
    const nx = (x - centerX) / radiusX;
    const ny = (y - centerY) / radiusY;
    return Math.sqrt(nx * nx + ny * ny);
  }

  function initCells() {
    cells = [];
    for (let row = 0; row < rows; row++) {
      cells[row] = [];
      for (let col = 0; col < cols; col++) {
        cells[row][col] = {
          char: getRandomChar(),
          opacity: 0.15 + Math.random() * 0.45,
          speed: 0.3 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          updateFreq: 0.005 + Math.random() * 0.025
        };
      }
    }
  }

  function resize() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    cols = Math.ceil(canvas.width / CELL_WIDTH) + 1;
    rows = Math.ceil(canvas.height / CELL_HEIGHT) + 1;
    
    centerX = cols / 2;
    centerY = rows / 2;
    radiusX = cols * 0.40;
    radiusY = rows * 0.44;
    
    initCells();
  }

  function drawLogo(time: number) {
    if (!ctx || !canvas) return;

    // Subtle pulsing effect
    const pulse = Math.sin(time * 0.001) * 0.15 + 0.85;
    const opacity = 0.5 + Math.sin(time * 0.0005) * 0.15;

    ctx.save();

    // Outer glow
    ctx.shadowColor = 'rgba(255, 160, 60, 0.6)';
    ctx.shadowBlur = 40 * pulse;

    // Semi-transparent text with orange tint
    ctx.fillStyle = `rgba(255, 220, 180, ${opacity})`;
    ctx.font = 'bold 48px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('hodwini/dev.', canvas.width / 2, canvas.height / 2);

    // Coming Soon text
    ctx.shadowBlur = 20 * pulse;
    ctx.fillStyle = `rgba(255, 220, 180, ${opacity * 0.7})`;
    ctx.font = '24px "JetBrains Mono", monospace';
    ctx.fillText('Coming Soon', canvas.width / 2, canvas.height / 2 + 60);

    ctx.restore();
  }

  function animate(time: number) {
    if (!ctx || !canvas) return;
    
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `${CELL_HEIGHT - 3}px "Courier New", monospace`;
    ctx.textBaseline = 'top';
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = cells[row]?.[col];
        if (!cell) continue;
        
        if (!isInsideEllipse(col, row)) continue;
        
        if (Math.random() < cell.updateFreq) {
          cell.char = getRandomChar();
          cell.opacity = 0.1 + Math.random() * 0.5;
        }
        
        const dist = getDistanceFromCenter(col, row);
        const pulse = Math.sin(time * 0.0008 * cell.speed + cell.phase + dist * 1.5) * 0.15;
        const finalOpacity = Math.max(0.05, Math.min(0.75, cell.opacity + pulse));
        const edgeFade = dist > 0.7 ? 1 - ((dist - 0.7) / 0.3) : 1;
        
        // Orange-white gradient
        const brightness = (1 - dist * 0.25) * edgeFade;
        const r = Math.floor(255 * brightness);
        const g = Math.floor((140 + 80 * brightness) * brightness);
        const b = Math.floor((60 + 40 * brightness) * brightness);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity * edgeFade})`;
        
        const x = col * CELL_WIDTH;
        const y = row * CELL_HEIGHT;
        ctx.fillText(cell.char, x, y);
      }
    }
    
    drawLogo(time);
    
    // Inner glow
    const glowGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.35
    );
    glowGradient.addColorStop(0, COLORS.glowCenter);
    glowGradient.addColorStop(1, COLORS.glowEdge);
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    animationId = requestAnimationFrame(animate);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(animate);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }
  });
</script>

<div class="ascii-container">
  <canvas bind:this={canvas}></canvas>
  <slot />
</div>

<style lang="scss">
  @use './styles/ascii-globe.scss';
</style>