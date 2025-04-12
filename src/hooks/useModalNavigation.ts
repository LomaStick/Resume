import { useState, useCallback, useEffect } from 'react';

interface UseModalNavigationOptions {
  totalPages: number;
  animationDuration?: number;
}

export const useModalNavigation = ({
  totalPages,
  animationDuration = 0,
}: UseModalNavigationOptions) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const changePage = useCallback((newPage: number) => {
    if (newPage < 0 || newPage >= totalPages || isAnimating) return;
    
    if (animationDuration > 0) {
      setIsAnimating(true);
      setCurrentPage(newPage);
      const timer = setTimeout(() => setIsAnimating(false), animationDuration);
      return () => clearTimeout(timer);
    } else {
      setCurrentPage(newPage);
    }
  }, [totalPages, isAnimating, animationDuration]);

  const handlePrev = useCallback(() => {
    changePage(currentPage - 1);
  }, [currentPage, changePage]);

  const handleNext = useCallback(() => {
    changePage(currentPage + 1);
  }, [currentPage, changePage]);

  const handleTouchStart = useCallback((e: React.TouchEvent | TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isAnimating) return;

    const threshold = 50;
    const difference = touchStart - touchEnd;

    if (difference > threshold) {
      handleNext();
    } else if (difference < -threshold) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, isAnimating, handleNext, handlePrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
					
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return {
    currentPage,
    isAnimating,
    handlePrev,
    handleNext,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canGoPrev: currentPage > 0,
    canGoNext: currentPage < totalPages - 1,
  };
};

export const useModalPagination = (totalPages: number, ) => {
  return useModalNavigation({ 
    totalPages, 
    animationDuration: 0, 
  });
};