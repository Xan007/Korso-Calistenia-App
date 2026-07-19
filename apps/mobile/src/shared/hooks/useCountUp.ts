import { useEffect, useState } from 'react';

export function useCountUp(target: number, active: boolean, delay: number): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const durationMs = 900;

    const tick = (t: number): void => {
      if (start === null) start = t + delay;
      const p = Math.min(1, Math.max(0, (t - start) / durationMs));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return (): void => cancelAnimationFrame(raf);
  }, [active, target, delay]);

  return value;
}
