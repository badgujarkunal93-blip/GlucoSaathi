import React, { useEffect, useRef } from 'react';

export default function InteractiveWaveBackground({ glucose = 118, riskLevel = 'MODERATE', mousePos = { x: 0, y: 0 } }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    let step = 0;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Base speed and amplitude modified by glucose and risk
      const speed = prefersReducedMotion ? 0 : 0.008 + (glucose > 140 ? 0.004 : 0);
      step += speed;

      // 4 Flowing thin data curves (Teal, Mint, Soft Green)
      const waves = [
        {
          color: 'rgba(7, 91, 87, 0.16)', // Deep Teal
          amplitude: 28 + (riskLevel === 'HIGH' ? 14 : 0),
          wavelength: 0.0028,
          phase: step * 1.2 + mousePos.x * 0.001,
          offsetY: height * 0.48 + mousePos.y * 0.25,
          lineWidth: 1.5
        },
        {
          color: 'rgba(36, 166, 106, 0.22)', // Accent Green
          amplitude: 38 + (riskLevel === 'HIGH' ? 18 : 0),
          wavelength: 0.0021,
          phase: step * 0.9 + mousePos.x * 0.0015,
          offsetY: height * 0.52 - mousePos.y * 0.2,
          lineWidth: 2
        },
        {
          color: 'rgba(223, 244, 232, 0.45)', // Soft Mint
          amplitude: 20,
          wavelength: 0.0035,
          phase: step * 1.5 + mousePos.x * 0.0008,
          offsetY: height * 0.56 + mousePos.y * 0.15,
          lineWidth: 1.2
        },
        {
          color: 'rgba(6, 63, 61, 0.10)', // Dark Teal
          amplitude: 45,
          wavelength: 0.0018,
          phase: step * 0.7 - mousePos.x * 0.0012,
          offsetY: height * 0.45 - mousePos.y * 0.3,
          lineWidth: 1
        }
      ];

      waves.forEach(w => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        for (let x = 0; x < width; x += 3) {
          const y =
            w.offsetY +
            Math.sin(x * w.wavelength + w.phase) * w.amplitude +
            Math.cos(x * w.wavelength * 0.5 + w.phase * 0.8) * (w.amplitude * 0.35);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Subtle Data Pulse Particles along the wave
      const numParticles = 4;
      for (let i = 0; i < numParticles; i++) {
        const px = ((step * 180 + i * (width / numParticles)) % width);
        const py =
          height * 0.52 +
          Math.sin(px * 0.0021 + step * 0.9) * 38;

        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? 'rgba(36, 166, 106, 0.65)' : 'rgba(7, 91, 87, 0.55)';
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Particle glow ring
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(223, 244, 232, 0.4)';
        ctx.lineWidth = 1;
        ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [glucose, riskLevel, mousePos]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
