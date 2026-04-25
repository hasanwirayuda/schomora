import { useState, useEffect } from "react";

interface Props {
  initialSeconds: number;
  isActive: boolean;
  onExpire: () => void;
}

export function useQuizTimer({ initialSeconds, isActive, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (initialSeconds > 0) setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  const formatted = () => {
    const m = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return { timeLeft, formatted };
}
