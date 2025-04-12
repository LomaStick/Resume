import React from 'react';
import backgroundImage from '@assets/images/backgound/background.jpg';
import useImagePositioning from '@hooks/useImagePositioning';
import { elementPositions } from '@data/elementPositions';
import InteractiveItem from '@components/InteractiveItem/InteractiveItem';

interface InteractiveItemsProps {
  onItemClick: (item: string) => void;
}

const InteractiveItems: React.FC<InteractiveItemsProps> = ({ onItemClick }) => {

	const elementScreenData = useImagePositioning(backgroundImage, elementPositions);

  return (
    <>
      {elementScreenData.map((item) => (
        <InteractiveItem
          key={item.name}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          transform={item.transform}
          hoverImage={item.hoverImage}
          onClick={() => onItemClick(item.name)}
        />
      ))}
    </>
  );
};

export default InteractiveItems;