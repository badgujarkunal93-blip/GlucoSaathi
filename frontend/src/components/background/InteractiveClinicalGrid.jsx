import React, { useEffect, useRef } from 'react';

/**
 * InteractiveClinicalGrid
 * A high-performance canvas-based Clinical Intelligence Cross-Grid (+) background.
 * Features:
 * - Crisp, distinct mathematical cross symbols (+)
 * - Clearly visible rest opacity (0.16 - 0.24) with subtle deterministic variation
 * - Fluid cursor proximity repulsion (8-12px) with elastic spring return
 * - Localized illumination & scale (up to 1.30x, opacity 0.45) near cursor
 * - Right-side AI intelligence core depth glow
 * - Subtle scroll parallax (10-15px)
 * - Full prefers-reduced-motion & mobile optimization
 * - 100% non-blocking (pointer-events: none)
 */
export default function InteractiveClinicalGrid({
  crossSize = 8.5,
  strokeWidth = 1.35,
  spacing = 68,
  interactionRadius = 140,
  maxDisplacement = 10,
  springStrength = 0.075,
  damping = 0.84,
  baseColor = 'rgba(18, 126, 111, 0.19)',      // Clinical teal tint
  accentColor = 'rgba(32, 169, 107, 0.45)',    // Active emerald glow
  highlightColor = 'rgba(7, 91, 87, 0.30)',    // Medium density cross
  enableParallax = true,
  enableConnections = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollY = window.scrollY || 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isActive: false,
      lastMoved: 0
    };

    // Crosses grid state
    let crosses = [];

    // Responsive grid spacing & cross size
    const getGridConfig = (w) => {
      if (w < 640) {
        return { gridSpacing: 44, size: 6.5, stroke: 1.2 };
      }
      if (w < 1024) {
        return { gridSpacing: 56, size: 7.5, stroke: 1.3 };
      }
      return { gridSpacing: spacing, size: crossSize, stroke: strokeWidth };
    };

    // Build/recalculate grid points
    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const config = getGridConfig(width);
      const cols = Math.ceil(width / config.gridSpacing) + 2;
      const rows = Math.ceil(height / config.gridSpacing) + 3;

      const offsetX = (width - (cols - 1) * config.gridSpacing) / 2;
      const offsetY = (height - (rows - 1) * config.gridSpacing) / 2;

      crosses = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * config.gridSpacing;
          const originY = offsetY + r * config.gridSpacing;

          // Deterministic organic variation across grid
          const randSeed = (c * 17 + r * 31) % 100;
          let baseAlpha = 0.17;
          if (randSeed > 82) baseAlpha = 0.28;       // Highlight cross
          else if (randSeed > 55) baseAlpha = 0.22;  // Medium cross

          // Zone weighting: slightly more pronounced around right-side AI card
          const isRightZone = originX > width * 0.48 && originY < height * 0.85;
          if (isRightZone) baseAlpha = Math.min(0.32, baseAlpha + 0.05);

          crosses.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            row: r,
            col: c,
            scale: 1,
            phase: (c * 0.4 + r * 0.5) % (Math.PI * 2),
            baseAlpha,
            currentAlpha: baseAlpha,
            activation: 0
          });
        }
      }
    };

    initGrid();

    // Event handlers
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initGrid, 120);
    };

    const handleScroll = () => {
      if (enableParallax) {
        scrollY = window.scrollY || 0;
      }
    };

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
      mouse.lastMoved = performance.now();
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isActive = false;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Draw single crisp cross (+)
    const drawCross = (x, y, size, stroke, alpha, scale = 1, isNearMouse = false) => {
      ctx.save();
      ctx.translate(x, y);
      if (scale !== 1) ctx.scale(scale, scale);

      ctx.beginPath();
      const half = size / 2;

      // Horizontal arm
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);

      // Vertical arm
      ctx.moveTo(0, -half);
      ctx.lineTo(0, half);

      ctx.strokeStyle = isNearMouse ? 'rgba(32, 169, 107, 0.90)' : 'rgba(18, 126, 111, 0.90)';
      ctx.globalAlpha = Math.max(0.08, Math.min(0.55, alpha));
      ctx.lineWidth = stroke;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Very subtle center core glow on strongly activated crosses
      if (isNearMouse && alpha > 0.35) {
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(32, 169, 107, 0.85)';
        ctx.fill();
      }

      ctx.restore();
    };

    // Static rendering fallback for reduced-motion
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      const config = getGridConfig(width);
      for (let i = 0; i < crosses.length; i++) {
        const c = crosses[i];
        drawCross(c.originX, c.originY, config.size, config.stroke, c.baseAlpha);
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
      };
    }

    // Animation Loop
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.24;
      mouse.y += (mouse.targetY - mouse.y) * 0.24;

      const config = getGridConfig(width);
      const parallaxOffset = enableParallax ? (scrollY * 0.04) % config.gridSpacing : 0;

      // 1. Right-Side Intelligence Panel Depth Glow
      const glowX = width * 0.68;
      const glowY = height * 0.38;
      const radGrad = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.min(width, height) * 0.42);
      radGrad.addColorStop(0, 'rgba(32, 169, 107, 0.075)');
      radGrad.addColorStop(0.5, 'rgba(18, 126, 111, 0.025)');
      radGrad.addColorStop(1, 'rgba(247, 248, 244, 0)');

      ctx.save();
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      const activeNearCursor = [];

      // 2. Physics & Cross Render Loop
      for (let i = 0; i < crosses.length; i++) {
        const c = crosses[i];
        const targetOriginY = c.originY - parallaxOffset;

        // Subtle autonomous breathing pulse
        const pulse = Math.sin(now * 0.0016 + c.phase) * 0.025;
        let targetAlpha = c.baseAlpha + pulse;
        let targetScale = 1;
        let isNearMouse = false;

        // Distance to cursor
        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion & Local Illumination
        if (dist < interactionRadius && mouse.isActive) {
          const normDist = dist / interactionRadius;
          const force = Math.pow(1 - normDist, 1.75);
          const push = force * maxDisplacement;

          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * push;
          const pushY = Math.sin(angle) * push;

          c.vx += pushX * 0.15;
          c.vy += pushY * 0.15;

          c.activation = 1 - normDist;
          targetAlpha = c.baseAlpha + c.activation * 0.26; // up to 0.45-0.50
          targetScale = 1 + c.activation * 0.28;           // up to 1.28x
          if (c.activation > 0.35) isNearMouse = true;

          activeNearCursor.push(c);
        } else {
          c.activation *= 0.88;
        }

        // Spring return to origin
        const springX = (c.originX - c.x) * springStrength;
        const springY = (targetOriginY - c.y) * springStrength;

        c.vx = (c.vx + springX) * damping;
        c.vy = (c.vy + springY) * damping;

        c.x += c.vx;
        c.y += c.vy;

        c.scale += (targetScale - c.scale) * 0.20;
        c.currentAlpha += (targetAlpha - c.currentAlpha) * 0.18;

        drawCross(c.x, c.y, config.size, config.stroke, c.currentAlpha, c.scale, isNearMouse);
      }

      // 3. Ultra-Faint Micro-Telemetry Links between Closest Stimulated Crosses
      if (enableConnections && activeNearCursor.length > 1) {
        ctx.save();
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 3]);

        for (let i = 0; i < activeNearCursor.length; i++) {
          const c1 = activeNearCursor[i];
          for (let j = i + 1; j < activeNearCursor.length; j++) {
            const c2 = activeNearCursor[j];
            const distBetween = Math.hypot(c1.x - c2.x, c1.y - c2.y);

            if (distBetween < config.gridSpacing * 1.45) {
              const linkAlpha = Math.min(c1.activation, c2.activation) * 0.07; // < 0.08 max
              if (linkAlpha > 0.015) {
                ctx.strokeStyle = 'rgba(32, 169, 107, 0.9)';
                ctx.globalAlpha = linkAlpha;
                ctx.beginPath();
                ctx.moveTo(c1.x, c1.y);
                ctx.lineTo(c2.x, c2.y);
                ctx.stroke();
              }
            }
          }
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [
    crossSize,
    strokeWidth,
    spacing,
    interactionRadius,
    maxDisplacement,
    springStrength,
    damping,
    baseColor,
    accentColor,
    highlightColor,
    enableParallax,
    enableConnections
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{
        opacity: 1,
        transition: 'opacity 0.4s ease-in-out'
      }}
      aria-hidden="true"
    />
  );
}
