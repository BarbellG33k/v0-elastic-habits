'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import slogansData from '@/assets/slogans.json';
import { useSettings } from '@/contexts/settings-context';

export const SloganRotator = () => {
  const { settings } = useSettings();
  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSloganIndex((prevIndex) => 
          (prevIndex + 1) % slogansData.slogans.length
        );
        setIsVisible(true);
      }, 500); // Wait for fade out before changing slogan
    }, settings.sloganRotationInterval);

    return () => clearInterval(interval);
  }, [settings.sloganRotationInterval]);

  return (
    <div 
      className="w-full text-center py-6"
      role="region"
      aria-label="Rotating motivational slogans"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentSloganIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300"
        >
          {slogansData.slogans[currentSloganIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default SloganRotator; 