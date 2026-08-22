import React, { useEffect, useRef } from 'react';

/**
 * InteractiveCrossGrid
 * A high-performance canvas-based medical telemetry cross grid background.
 * Features:
 * - Evenly spaced mathematical cross grid (+)
 * - Fluid cursor proximity repulsion with elastic spring return
 * - Subtle individual phase-offset breathing pulse
 * - Ultra-faint transient telemetry connection lines near cursor
 * - Faint radial cursor ambient light field
 * - Click ripple propagation
 * - Full prefers-reduced-motion & mobile optimization
 * - 100% non-blocking (pointer-events: none, single RAF loop)
 */
export default function InteractiveCrossGrid({
  crossSize = 6,
  strokeWidth = 1.2,
  interactionRadius = 180,
  maxDisplacement = 20,
  springStrength = 0.055,
  damping = 0.87,
  baseOpacity = 0.12,
  activeColor = '#075B57', // Muted dark teal
  accentColor = '#1E9E67', // Clinical emerald
  enableRipple = true,
  enableConnections = true,
  enableCursorGlow = true
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

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isActive: false,
      lastMoved: 0
    };

    // Ripples state
    const ripples = [];

    // Crosses grid array
    let crosses = [];

    // Helper: calculate responsive spacing
    const getSpacing = (w) => {
      if (w < 640) return 44; // Mobile
      if (w < 1024) return 52; // Tablet
      return 62; // Desktop
    };

    // Initialize/rebuild grid
    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const spacing = getSpacing(width);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      crosses = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const originX = offsetX + c * spacing;
          const originY = offsetY + r * spacing;
          const index = r * cols + c;

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
            phase: (c * 0.35 + r * 0.45) % (Math.PI * 2), // Deterministic organic offset
            alpha: baseOpacity,
            activation: 0 // 0 to 1 based on cursor proximity
          });
        }
      }
    };

    initGrid();

    // Resize handler
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initGrid, 120);
    };

    // Mouse movement handler
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isActive = true;
      mouse.lastMoved = performance.now();
    };

    const handlePointerLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.isActive = false;
    };

    // Click Ripple Handler
    const handlePointerDown = (e) => {
      if (!enableRipple || prefersReducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.45,
        speed: 4.2,
        opacity: 0.28,
        createdAt: performance.now()
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Draw single cross (+)
    const drawCross = (x, y, size, stroke, alpha, scale = 1, isAccent = false) => {
      ctx.save();
      ctx.translate(x, y);
      if (scale !== 1) ctx.scale(scale, scale);

      ctx.beginPath();
      const half = size / 2;
      // Horizontal bar
      ctx.moveTo(-half, 0);
      ctx.lineTo(half, 0);
      // Vertical bar
      ctx.moveTo(0, -half);
      ctx.lineTo(0, half);

      ctx.strokeStyle = isAccent ? accentColor : activeColor;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.lineWidth = stroke;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.restore();
    };

    // Static render for reduced motion
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < crosses.length; i++) {
        const c = crosses[i];
        drawCross(c.originX, c.originY, crossSize, strokeWidth, baseOpacity * 0.9);
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('pointerdown', handlePointerDown);
      };
    }

    // Animation loop
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      mouse.x += (mouse.targetX - mouse.x) * 0.22;
      mouse.y += (mouse.targetY - mouse.y) * 0.22;

      // 1. Render Subtle Ambient Cursor Light Field
      if (enableCursorGlow && mouse.isActive && mouse.x > 0 && mouse.y > 0) {
        const glowRadius = interactionRadius * 1.15;
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowRadius);
        grad.addColorStop(0, 'rgba(30, 158, 103, 0.045)');
        grad.addColorStop(0.5, 'rgba(7, 91, 87, 0.015)');
        grad.addColorStop(1, 'rgba(247, 248, 245, 0)');

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Update Ripples
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.radius += rip.speed;
        rip.opacity *= 0.965;

        if (rip.opacity < 0.01 || rip.radius > rip.maxRadius) {
          ripples.splice(rIdx, 1);
        }
      }

      const activeCrossesNearMouse = [];

      // 3. Physics & Geometry Update for Crosses
      for (let i = 0; i < crosses.length; i++) {
        const c = crosses[i];

        // Idle organic breathing pulse
        const pulse = Math.sin(now * 0.0018 + c.phase) * 0.035;
        let targetAlpha = baseOpacity + pulse;
        let targetScale = 1;
        let isAccent = false;

        // Proximity calculation
        const dx = c.x - mouse.x;
        const dy = c.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion force
        if (dist < interactionRadius && mouse.isActive) {
          const normDist = dist / interactionRadius;
          const force = Math.pow(1 - normDist, 1.6);
          const push = force * maxDisplacement;

          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * push;
          const pushY = Math.sin(angle) * push;

          // Apply velocity nudge away from cursor
          c.vx += pushX * 0.25;
          c.vy += pushY * 0.25;

          // Interaction visuals
          c.activation = 1 - normDist;
          targetAlpha = baseOpacity + c.activation * 0.32;
          targetScale = 1 + c.activation * 0.38;
          if (c.activation > 0.45) isAccent = true;

          activeCrossesNearMouse.push(c);
        } else {
          c.activation *= 0.92;
        }

        // Ripple interaction
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rdx = c.originX - rip.x;
          const rdy = c.originY - rip.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const ringDist = Math.abs(rDist - rip.radius);

          if (ringDist < 45) {
            const ripForce = (1 - ringDist / 45) * rip.opacity;
            const ripAngle = Math.atan2(rdy, rdx);
            c.vx += Math.cos(ripAngle) * ripForce * 12;
            c.vy += Math.sin(ripAngle) * ripForce * 12;
            targetAlpha += ripForce * 0.25;
            targetScale += ripForce * 0.2;
          }
        }

        // Spring force towards origin
        const springX = (c.originX - c.x) * springStrength;
        const springY = (c.originY - c.y) * springStrength;

        c.vx = (c.vx + springX) * damping;
        c.vy = (c.vy + springY) * damping;

        c.x += c.vx;
        c.y += c.vy;

        c.scale += (targetScale - c.scale) * 0.18;
        c.alpha += (targetAlpha - c.alpha) * 0.15;

        // Draw cross
        drawCross(c.x, c.y, crossSize, strokeWidth, c.alpha, c.scale, isAccent);
      }

      // 4. Ultra-Faint Transient Telemetry Connections near Cursor
      if (enableConnections && activeCrossesNearMouse.length > 1) {
        ctx.save();
        ctx.lineWidth = 0.75;
        ctx.setLineDash([2, 3]);

        for (let i = 0; i < activeCrossesNearMouse.length; i++) {
          const c1 = activeCrossesNearMouse[i];
          for (let j = i + 1; j < activeCrossesNearMouse.length; j++) {
            const c2 = activeCrossesNearMouse[j];
            const distBetween = Math.hypot(c1.x - c2.x, c1.y - c2.y);

            // Connect only immediate grid neighbors
            if (distBetween < getSpacing(width) * 1.5) {
              const connectionAlpha = Math.min(c1.activation, c2.activation) * 0.12;
              if (connectionAlpha > 0.015) {
                ctx.strokeStyle = accentColor;
                ctx.globalAlpha = connectionAlpha;
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
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [
    crossSize,
    strokeWidth,
    interactionRadius,
    maxDisplacement,
    springStrength,
    damping,
    baseOpacity,
    activeColor,
    accentColor,
    enableRipple,
    enableConnections,
    enableCursorGlow
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{
        opacity: 1,
        transition: 'opacity 0.5s ease-in-out'
      }}
      aria-hidden="true"
    />
  );
}
