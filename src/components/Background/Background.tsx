import { FC, useState, useEffect } from "react";
import backgroundImage from '@assets/images/backgound/background.jpg';
import vignette from '@assets/images/backgound/vignette.png';
import scratches1 from '@assets/images/backgound/scratches1.png';
import scratches2 from '@assets/images/backgound/scratches2.png';
import scratches3 from '@assets/images/backgound/scratches3.png';
import shadow from '@assets/images/backgound/shadowsBackground.png';
import './Background.scss';

interface BackgroundProps {
  isLoading: boolean;
}

const Background: FC<BackgroundProps> = ({ isLoading }) => {
  // Состояния для shadow
  const defaultShadowDuration = '0.5s';
  const [shadowAnimation, setShadowAnimation] = useState<boolean>(false);
  const [shadowOpacity, setShadowOpacity] = useState<number>(1);
  const [shadowDuration, setShadowDuration] = useState<string>(defaultShadowDuration);

  // Состояния для scratches1
  const defaultScratches1Duration = '3s';
  const [scratches1Animation, setScratches1Animation] = useState<boolean>(false);
  const [scratches1Scale, setScratches1Scale] = useState<number>(1);
  const [scratches1Blur, setScratches1Blur] = useState<number>(0);
  const [scratches1Duration, setScratches1Duration] = useState<string>(defaultScratches1Duration);

  // Состояния для scratches2
  const defaultScratches2Duration = '1s';
  const [scratches2Animation, setScratches2Animation] = useState<boolean>(false);
  const [scratches2Scale, setScratches2Scale] = useState<number>(1);
  const [scratches2Offset, setScratches2Offset] = useState({ x: '0%', y: '0%' });
  const [scratches2Duration, setScratches2Duration] = useState<string>(defaultScratches2Duration);

  // Функция для анимации shadow
  const startShadowAnimation = () => {
    const randomDelay = Math.random() * 6.7 + 0.3; // Задержка от 0.3 до 7 секунд
    const newOpacity = Math.random() * 0.4 + 0.2; // Opacity от 0.2 до 0.6
    const newDuration = Math.random() * 0.5 + 0.5; // Длительность от 0.5 до 1 секунды

    setTimeout(() => {
      setShadowOpacity(newOpacity);
      setShadowDuration(`${newDuration}s`);
      setShadowAnimation(true);

      setTimeout(() => {
        setShadowAnimation(false);
        startShadowAnimation(); // Запуск следующего цикла
      }, newDuration * 1000);
    }, randomDelay * 1000);
  };

  // Функция для анимации scratches1
  const startScratches1Animation = () => {
    if (isLoading) return;

    const randomDelay = Math.random() * 6 + 4; // Задержка от 4 до 10 секунд
    const newScale = Math.random() * 0.05 + 1; // Scale от 1 до 1.05
    const newBlur = (newScale - 1) * 80; // Размытие от 0 до 4px, пропорционально изменению scale
    const newDuration = (newScale - 1) * 80; // Длительность от 0 до 2 секунд

    setTimeout(() => {
      setScratches1Scale(newScale);
      setScratches1Blur(newBlur); // Устанавливаем новое значение размытия
      setScratches1Duration(`${newDuration}s`);
      setScratches1Animation(true);

      setTimeout(() => {
        setScratches1Animation(false);
        startScratches1Animation(); // Запуск следующего цикла
      }, newDuration * 1000);
    }, randomDelay * 1000);
  };

  // Функция для анимации scratches2
  const startScratches2Animation = () => {
    if (isLoading) return;

    const randomDelay = Math.random() * 5 + 5; // Задержка от 5 до 10 секунд
    const offsetX = (Math.random() * 2 - 1).toFixed(2); // Смещение по X от -1% до 1%
    const offsetY = (Math.random() * 2 - 1).toFixed(2); // Смещение по Y от -1% до 1%
    const newScale = 1 + Math.abs(parseFloat(offsetX)) / 100 + Math.abs(parseFloat(offsetY)) / 100; // Scale
    const newDuration = Math.random() * 1 + 3; // Длительность от 3 до 4 секунд

    setTimeout(() => {
      setScratches2Scale(newScale);
      setScratches2Offset({ x: `${offsetX}%`, y: `${offsetY}%` });
      setScratches2Duration(`${newDuration}s`);
      setScratches2Animation(true);

      setTimeout(() => {
        setScratches2Animation(false);
        startScratches2Animation(); // Запуск следующего цикла
      }, newDuration * 1000);
    }, randomDelay * 1000);
  };

  // Запуск анимаций при монтировании компонента
  useEffect(() => {
    startShadowAnimation(); 
    if (!isLoading) {
      startScratches1Animation();
      startScratches2Animation();
    }
  }, [isLoading]);

  return (
    <div className="background">
      <img className="background_main" src={backgroundImage} alt="background" />
      <img className="background_vignette" src={vignette} alt="scratches" />
      <img className="background_shadow"
        style={{
          opacity: shadowAnimation ? shadowOpacity : 1,
          transition: `opacity ${shadowAnimation ? shadowDuration : defaultShadowDuration} ease-out`,
        }}
        src={shadow}
        alt="shadow"
      />
      <img className="background_scratches1"
        style={{
          scale: scratches1Animation ? scratches1Scale : 1,
          filter: `blur(${scratches1Animation ? scratches1Blur : 0}px)`,
          transition: `all ${scratches1Animation ? scratches1Duration : defaultScratches1Duration} ease-out`,
        }}
        src={scratches1}
        alt="scratches"
      />
      <img className="background_scratches2"
        style={{
          scale: scratches2Animation ? scratches2Scale : 1,
          left: scratches2Animation ? scratches2Offset.x : '0%',
          top: scratches2Animation ? scratches2Offset.y : '0%',
          transition: `all ${scratches2Animation ? scratches2Duration : defaultScratches2Duration} ease-out`,
        }}
        src={scratches2}
        alt="scratches"
      />
      <img className="background_scratches3" src={scratches3} alt="scratches" />
    </div>
  );
};

export default Background;