// hooks/useProgressBar.js
import { useState, useRef } from "react";

export function useProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);

  const startProgress = () => {
    setIsLoading(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const increment = prev < 40 ? 8 : prev < 70 ? 5 : 2;
        return prev + increment;
      });
    }, 300);
  };

  // Switch from the simulated bar to real progress (0..1) reported by the tool.
  const reportProgress = (fraction) => {
    clearInterval(intervalRef.current);
    setProgress(Math.max(5, Math.min(99, Math.round(fraction * 100))));
  };

  const completeProgress = () => {
    clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 800);
  };

  const cancelProgress = () => {
    clearInterval(intervalRef.current);
    setIsLoading(false);
    setProgress(0);
  };

  return { progress, isLoading, startProgress, reportProgress, completeProgress, cancelProgress };
}