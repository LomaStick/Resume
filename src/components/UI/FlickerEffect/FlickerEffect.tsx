import { useEffect, useState } from 'react';
import './FlickerEffect.scss';

interface FlickerEffectProps {
  size?: number;
  color?: string;
  animationDuration?: number;
}

const FlickerEffect: React.FC<FlickerEffectProps> = ({
  size = 30,
  color = 'rgba(255, 255, 255, 0.8)',
  animationDuration = 5,
}) => {
  const [randomAngle, setRandomAngle] = useState<number>(0);
	// const [randomDuraion, setRandomDuration] = useState<number>(0);




  useEffect(() => {
    const generateRandomAngle = () => {
      const angle = Math.floor(Math.random() * 360);
      setRandomAngle(angle);
    };
		

    generateRandomAngle(); // Генерируем угол при первом рендере
    const intervalId = setInterval(generateRandomAngle,  animationDuration *1000 + Math.random());

    return () => clearInterval(intervalId); // Чистим интервал при размонтировании
  }, [animationDuration]);



  const style: React.CSSProperties & { [key: string]: string } = {
    '--flicker-size': `${size}px`,
    '--random-angle': `${randomAngle}deg`,
    '--animation-duration': `${animationDuration}s`,
    '--flicker-color': color,
  };

  const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  const getIrregularStarPoints = (points: number, outerRadius: number, innerRadius: number, irregularity: number = 0.3, sharpness: number = 1.0) => {
    const angleStep = Math.PI / points;
    let pointsString = '';

    for (let i = 0; i < 2 * points; i++) {
      const isOuterPoint = i % 2 === 0;
      const radius = isOuterPoint ? outerRadius : innerRadius;

      // Случайные отклонения
      const angleOffset = getRandomArbitrary(-irregularity * angleStep, irregularity * angleStep);
      const currentAngle = i * angleStep + angleOffset;
      const radiusVariation = getRandomArbitrary(1 - irregularity, 1 + irregularity);

      let currentRadius = radius * radiusVariation;

      // Корректировка радиуса для остроты
      currentRadius = radius + (currentRadius - radius) * sharpness;

      const x = currentRadius * Math.cos(currentAngle) + outerRadius;
      const y = currentRadius * Math.sin(currentAngle) + outerRadius;

      pointsString += `${x},${y} `;
    }

    return pointsString.trim();
  };

  const starPoints = getIrregularStarPoints(12, 5, 2, 0.1, 1.5);

  return (
    <div className="flicker" style={style}>
      <div className="flicker__container">
        <div className="flicker__spark-container">
          <span className="flicker__spark">
            <svg viewBox="0 0 10 10" width="100%" height="100%" style={{ filter: 'drop-shadow(0px 0px 100px white)' }}>
              <polygon points={starPoints} />
            </svg>
          </span>
        </div>
        <div className="flicker__beam-container">
          <div className="flicker__beam flicker__beam_forward" />
          <div className="flicker__beam flicker__beam_reverse" />
        </div>
      </div>
    </div>
  );
};

export default FlickerEffect;