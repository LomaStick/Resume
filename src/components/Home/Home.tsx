import React, { useState, useMemo, useEffect, useRef } from 'react';
// Компоненты
import LoadingScreen from '@components/UI/LoadingScreen/LoadingScreen';
import AudioPlayer from '@components/UI/AudioPlayer/AudioPlayer';
import InteractiveItems from '@components/InteractiveItem/InteractiveItems/InteractiveItems';
import Background from '@components/Background/Background';
import Modal from '@components/UI/Modal/Modal';
import BookModal from '@components/BookModal/BookModal';
import TabletModal from '@components/TabletModal/TabletModal';
import DustEffect from '@components/Effects/DustEffect/DustEffect';
// Хуки
import useDarkAnimation from '@hooks/useDarkAnimation';
// Ресурсы
import saveRoomTheme from '@assets/audio/Resident_Evil_HD_remaster-Save_Room_Theme.mp3';
import bookLight from '@assets/images/bookContent/bookLight.png';
import tabletLight from '@assets/images/tabaletContent/tabletLight.png';
// Стили
import './Home.scss';

// Конфигурация анимации света для разных элементов
const LIGHT_ANIMATION_CONFIG = {
  book: {
    minOpacity: 0.15,
    maxOpacity: 0.35,
    minDuration: 0.3,
    maxDuration: 0.6,
    minDelay: 1,
    maxDelay: 5
  },
  tablet: {
    minOpacity: 0.2,
    maxOpacity: 0.4,
    minDuration: 0.3,
    maxDuration: 0.5,
    minDelay: 0.5,
    maxDelay: 3
  },
  default: {
    minOpacity: 0.2,
    maxOpacity: 0.2,
    minDuration: 0.5,
    maxDuration: 0.5,
    minDelay: 1,
    maxDelay: 5
  }
};

/**
 * Главный компонент домашней страницы
 * Содержит интерактивные элементы, модальные окна и эффекты
 */
const Home: React.FC = () => {
  // Состояния загрузки и модальных окон
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<string>(''); // 'book' | 'tablet'

  // Состояния анимации света
  const defaultLightDuration = '0.5s';
  const [lightOpacity, setLightOpacity] = useState<number>(0.2);
  const [lightDuration, setLightDuration] = useState<string>(defaultLightDuration);
  
  // Анимация затемнения
  const [transitionDuration, setTransitionDuration] = useState<number>(1500);
  const { isOverlay, isDarkened, startDarkAnimation } = useDarkAnimation();

  // Реф для управления таймерами анимации
  const lightAnimationTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Обработчик завершения загрузки
   */
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  /**
   * Запуск анимации мерцания света
   * Использует рекурсивные таймеры с очисткой
   */
  const startLightAnimation = () => {
    // Очищаем предыдущий таймер
    if (lightAnimationTimer.current) {
      clearTimeout(lightAnimationTimer.current);
      lightAnimationTimer.current = null;
    }

    // Если модальное окно закрыто - прекращаем анимацию
    if (!isModalOpen) return;

    // Получаем конфигурацию для текущего элемента
    const config = currentItem in LIGHT_ANIMATION_CONFIG 
      ? LIGHT_ANIMATION_CONFIG[currentItem as keyof typeof LIGHT_ANIMATION_CONFIG]
      : LIGHT_ANIMATION_CONFIG.default;

    // Генерируем случайные параметры анимации
    const randomDelay = Math.random() * (config.maxDelay - config.minDelay) + config.minDelay;
    const newOpacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;
    const newDuration = Math.random() * (config.maxDuration - config.minDuration) + config.minDuration;

    // Устанавливаем таймер для изменения прозрачности
    lightAnimationTimer.current = setTimeout(() => {
      setLightOpacity(newOpacity);
      setLightDuration(`${newDuration}s`);

      // Таймер для следующего цикла анимации
      lightAnimationTimer.current = setTimeout(() => {
        if (isModalOpen) {
          startLightAnimation(); // Рекурсивный вызов
        }
      }, newDuration * 1000);
    }, randomDelay * 1000);
  };

  /**
   * Обработчик открытия/закрытия модального окна
   * @param item - тип открываемого элемента ('book' | 'tablet')
   */
  const handleModalAction = (item?: string) => {
    const duration = 1500;
    const delay = 700;

    setTransitionDuration(duration);

    if (item) {
      // Открытие модального окна с анимацией
      startDarkAnimation(() => {
        setIsModalOpen(true);
        setCurrentItem(item);
      }, { duration, delay });
    } else {
      // Закрытие модального окна с анимацией
      startDarkAnimation(() => {
        setIsModalOpen(false);
        setCurrentItem('');
      }, { duration, delay });
    }
  };

  /**
   * Обработчик переключения страниц в модальном окне
   * @param index - индекс новой страницы
   */
  const handlePaginationClick = (index: number) => {
    setTransitionDuration(700);
    startDarkAnimation(() => setActiveImageIndex(index), { duration: 800, delay: 0 });
  };

  // Мемоизированное содержимое модального окна
  const modalContent = useMemo(() => {
    switch (currentItem) {
      case 'book':
        return (
          <BookModal
            onClose={() => handleModalAction()}
            activeImageIndex={activeImageIndex}
            onNavigationClick={handlePaginationClick}
          />
        );
      case 'tablet':
        return <TabletModal onClose={() => handleModalAction()} />;
      default:
        return null;
    }
  }, [currentItem, activeImageIndex]);

  // Эффект для управления анимацией света
  useEffect(() => {
    if (isModalOpen) {
      startLightAnimation();
    }

    // Очистка при размонтировании
    return () => {
      if (lightAnimationTimer.current) {
        clearTimeout(lightAnimationTimer.current);
      }
    };
  }, [isModalOpen, currentItem]); // Зависимости: состояние модалки и текущий элемент

  return (
    <div className="home">
      {/* Фоновый компонент */}
      <Background isLoading={isLoading}/>
      
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          {/* Затемнение фона */}
          {isOverlay && (
            <div
              className={`home__overlay ${isDarkened ? 'home__overlay--darkened' : ''}`}
              style={{ transition: `background-color ${transitionDuration}ms ease-in-out` }}
            />
          )}
          
          <div className="home__content">
            {/* Аудиоплеер с фоновой музыкой */}
            <AudioPlayer audioSrc={saveRoomTheme} />

            {/* Интерактивные элементы (видны когда модалка закрыта) */}
            {!isModalOpen && <InteractiveItems onItemClick={handleModalAction} />}

            {/* Анимация света для модального окна */}
            {isModalOpen && (
              <img 
                className="modal_light" 
                style={{
                  opacity: lightOpacity,
                  transition: `opacity ${lightDuration} ease-out`,
                }}
                src={currentItem === 'book' ? bookLight : tabletLight} 
                alt="light effect" 
              />
            )}

            {/* Модальное окно */}
            <Modal isOpen={isModalOpen} onClose={() => handleModalAction()}>
              {modalContent}
            </Modal>
          </div>
          
          {/* Эффект пыли */}
          <DustEffect count={30} />
        </>
      )}
    </div>
  );
};

export default Home;