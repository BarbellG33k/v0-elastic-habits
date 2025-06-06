'use client';

import { useState, useEffect } from 'react';
import slogansData from '@/assets/slogans.json';

interface SloganRotatorProps {
  intervalMs?: number;
  className?: string;
}

export function SloganRotator({ intervalMs = 4000, className = "" }: SloganRotatorProps) {
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const slogans = slogansData.slogans;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
        setIsVisible(true);
      }, 300); // 300ms fade out duration
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, slogans.length]);

  return (
    <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}>
      <p className="text-muted-foreground">
        {slogans[currentSloganIndex]}
      </p>
    </div>
  );
} 