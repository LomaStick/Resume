import { useState, useEffect } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string; 
  transform: string; 
  hoverImage: string; 
}

const useImagePositioning = (imageSrc: string, elementPositions: Position[]) => {
  const [imageDimensions, setImageDimensions] = useState<Dimensions | null>(null);
  const [screenDimensions, setScreenDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Получаем размеры изображения
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      console.error('Не удалось загрузить изображение');
    };
  }, [imageSrc, screenDimensions]);

  // Отслеживаем изменение размеров экрана
  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция для расчета масштабирования и смещения
  const getScaleAndOffset = () => {
    if (!imageDimensions) return { scaleFactor: 1, offsetX: 0, offsetY: 0 };

    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    const screenAspectRatio = screenDimensions.width / screenDimensions.height;

    let scaleFactor, offsetX, offsetY;

    if (screenAspectRatio > imageAspectRatio) {
      // Экран шире, чем изображение (обрезаются края по вертикали)
      scaleFactor = screenDimensions.width / imageDimensions.width;
      offsetX = 0;
      offsetY = (screenDimensions.height - imageDimensions.height * scaleFactor) / 2;
    } else {
      // Экран уже, чем изображение (обрезаются края по горизонтали)
      scaleFactor = screenDimensions.height / imageDimensions.height;
      offsetX = (screenDimensions.width - imageDimensions.width * scaleFactor) / 2;
      offsetY = 0;
    }

    return { scaleFactor, offsetX, offsetY };
  };

  // Функция для расчета позиции и размеров элемента
  const calculatePositionAndSize = (element: Position) => {
    const { scaleFactor, offsetX, offsetY } = getScaleAndOffset();

    return {
      ...element,
      x: element.x * scaleFactor + offsetX,
      y: element.y * scaleFactor + offsetY,
      width: element.width * scaleFactor,
      height: element.height * scaleFactor,
    };
  };

  // Рассчитываем позиции и размеры для всех элементов
	const elementScreenData = elementPositions.map((element) =>
    calculatePositionAndSize(element)
  );

  return elementScreenData;
};

export default useImagePositioning;