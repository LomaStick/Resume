import React, { useState } from 'react';
import './InteractiveItem.scss'
import FlickerEffect from '@components/UI/FlickerEffect/FlickerEffect';

type InteractiveItemProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  transform: string;
  onClick: () => void;
  hoverImage?: string; // Изображение при наведении
};

const InteractiveItem: React.FC<InteractiveItemProps> = ({
  x,
  y,
  width,
  height,
  transform,
  onClick,
  hoverImage,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className="interactiveItem"
      style={{
				top: `${y}px`,
				left: `${x}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: transform,
        backgroundImage: isHovered && hoverImage ? `url(${hoverImage})` : 'none',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FlickerEffect />
    </button>
  );
};

export default InteractiveItem;