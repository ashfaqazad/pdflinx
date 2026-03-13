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

  return { progress, isLoading, startProgress, completeProgress, cancelProgress };
}