import { useState } from 'react';

export interface StartAnimationProps {
  duration?: number; // Длительность анимации затемнения и затухания
  delay?: number; // Длительность задержки между анимациями
}

const useDarkAnimation = () => {
  const [isOverlay, setIsOverlay] = useState<boolean>(false);
  const [isDarkened, setIsDarkened] = useState<boolean>(false);

  const startDarkAnimation = (
    callback: () => void, {duration = 1500, delay = 1000}: StartAnimationProps = {}
  ) => {
    // Включаем оверлей
    setIsOverlay(true);

    // Начинаем затемнение через 10 мс
    setTimeout(() => {
      setIsDarkened(true);
    }, 10);

    // Ждём завершения затемнения (delay)
    setTimeout(() => {
      // Вызываем callback
      callback();

      // Начинаем затухание через duration
      setTimeout(() => {
        setIsDarkened(false);

        // Выключаем оверлей после завершения затухания
        setTimeout(() => {
          setIsOverlay(false);
        }, duration);
      }, delay);
    }, duration); 
  };

  return { isOverlay, isDarkened, startDarkAnimation };
};

export default useDarkAnimation;