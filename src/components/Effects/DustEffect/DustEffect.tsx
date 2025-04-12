import {FC, memo, useMemo } from "react";
import "./DustEffect.scss"; // Подключаем SCSS-стили

// Интерфейс для пропсов
interface DustEffectProps {
  count?: number; // Пропс count, необязательный, по умолчанию 30
}

const DustEffect: FC<DustEffectProps> = memo(({ count = 30 }) => {
  // Генерация частиц пыли
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const size = Math.random() * 2 + 1; // Размер частицы (от 1px до 3px)
      const duration = Math.random() * 4 + 4; // Длительность анимации (от 4s до 7s)
      const delay = Math.random() * 4 + 1; // Задержка анимации (от 1s до 5s)
      const positionX = Math.random() > 0.5 ? 5 + Math.random() * 25 : 75 + Math.random() * 20; // Позиция по X (5-30% или 70-95%)
      const positionY = Math.random() * 90; // Позиция по Y (от 0% до 90%)
      const angle = Math.random() * 360; // Угол движения (от 0° до 360°)
      const distance = Math.random() * 250 + 30; // Дистанция движения (от 30px до 80px)

      // Вычисляем конечные координаты на основе угла и дистанции
      const endX = Math.cos((angle * Math.PI) / 180) * distance;
      const endY = Math.sin((angle * Math.PI) / 180) * distance;

			// Рандомное размытие (от 1px до 3px)
			const blur = Math.random() * 2 + 1;

			// Рандомная тень (от 0px до 2px по X и Y, размытие от 2px до 6px)
			const shadowX = Math.random() * 1;
			const shadowY = Math.random() * 2;
			const shadowBlur = Math.random() * 4 + 2;

      return (
        <div
          key={index}
          className="dust-particle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${positionX}%`,
            top: `${positionY}%`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            pointerEvents: "none",
            filter: `blur(${blur}px)`,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(255, 255, 255, 0.8)`, // Рандомная тень
          }}
          // Устанавливаем пользовательские CSS-переменные через ref
          ref={(el) => {
            if (el) {
              el.style.setProperty("--endX", `${endX}px`);
              el.style.setProperty("--endY", `${endY}px`);
            }
          }}
        />
      );
    });
  }, [count]);

  return <div className="dust-container">{particles}</div>;
});

export default DustEffect;