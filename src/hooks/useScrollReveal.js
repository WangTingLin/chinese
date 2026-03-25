import { useEffect, useRef } from 'react';

/**
 * 為目標元素加上 IntersectionObserver，
 * 進入視窗後加 is-visible class，配合 CSS .reveal-up 使用。
 * @param {number} threshold - 元素多少比例進入畫面時觸發（預設 0.12）
 * @param {string} delay - CSS animation-delay，如 '0.1s'
 */
export function useScrollReveal(threshold = 0.12, delay = '0s') {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.transitionDelay = delay;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, delay]);

  return ref;
}
