import React, { useState, useEffect, useCallback } from 'react';
import './LoadingScreen.scss';

interface LoadingScreenProps {
  loadingDelay?: number;
  progressInterval?: number;
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  loadingDelay = 2000,
  progressInterval = 80,
  onLoadingComplete,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);

  const simulateLoading = useCallback(() => {
    let intervalId: NodeJS.Timeout;

    const startInterval = () => {
      intervalId = setInterval(() => {
        const increment = Math.random() * 5;
        setProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + increment, 100);
          return Math.round(newProgress);
        });
      }, progressInterval);
    };

    startInterval();

    return () => clearInterval(intervalId);
  }, [progressInterval]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      simulateLoading();
    }, loadingDelay);

    return () => clearTimeout(timeoutId);
  }, [simulateLoading, loadingDelay]);

  useEffect(() => {
    if (progress === 100) {
      const timeoutId = setTimeout(() => {
        setReady(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [progress]);

  const handleAnyInteraction = useCallback(() => {
    if (ready) {
      onLoadingComplete();
    }
  }, [ready, onLoadingComplete]);

  useEffect(() => {
    if (ready) window.addEventListener('mousedown', handleAnyInteraction);
    
    return () => {
      window.removeEventListener('mousedown', handleAnyInteraction);
    };
  }, [ready, handleAnyInteraction]);

  const progressRatio = progress / 100;
  const blurValue = Math.max(0, 10 - (10 * progressRatio));

  return (
    <div className="loading-screen" style={{ backdropFilter: `blur(${blurValue}px)` }}>
      <div className="loading-screen__content">
        {!ready && (
          <div className="progress-bar">
            <div
              className="progress-bar__container"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Загрузка"
              aria-live="polite"
            >
              <div
                className="progress-bar__bar"
                style={{ width: `${progress}%` }}
              />
              {!ready && <span className="progress-bar__text progress-bar__text_animated">Загрузка...</span>}
            </div>
            <span className="progress-bar__percentage">{progress}%</span>
          </div>
        )}
        {ready && (
          <p className="progress-bar__press-any-key progress-bar__press-any-key_animated">
            Для продолжения нажмите любую клавишу мыши...
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(LoadingScreen);