import { FC, useState } from 'react';
import { bookContentData, IBookContentItem, IComponent, IFeature } from '@data/bookContent';
import modalBookImage from '@assets/images/bookContent/modalBook.png';
import modalBookMobileImage from '@assets/images/bookContent/modalBookMobile.png';
import btnCloseImage from '@assets/images/bookContent/btnClose1.png';
import btnLinkImage1 from '@assets/images/bookContent/button1.png';
import btnLinkImage2 from '@assets/images/bookContent/button2.png';
import { btnArrow } from '@assets/images/bookContent/Pagination';
import { useModalPagination } from '@hooks/useModalNavigation';
import useMediaQuery from '@hooks/useMediaQuery';
import './BookModal.scss';

interface IBookContent {
  header: { title: string; subtitle: string };
  left: React.ReactNode;
  right: React.ReactNode;
}

interface IBookModalProps {
  onClose: () => void;
  activeImageIndex: number;
  onNavigationClick: (index: number) => void;
}

const BookModal: FC<IBookModalProps> = ({ 
  onClose, 
  activeImageIndex, 
  onNavigationClick 
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const currentProject = bookContentData[activeImageIndex];
  const isMobile = useMediaQuery('(max-width: 1024px)');
	
  const renderNavigationButton = (
    content: IBookContentItem,
    index: number, 
    isActive: boolean, 
    isHidden: boolean
  ) => {
    const imageSrc = isActive 
      ? content.images.active 
      : index === hoveredIndex 
        ? content.images.hover 
        : content.images.inactive;

    return (
      <img
        key={index}
        className={`
          modal-book__nav-projects-button 
          ${isHidden ? 'modal-book__nav-projects-button_hidden' : ''} 
          ${isActive ? 'modal-book__nav-projects-button_active' : ''}
        `}
        src={imageSrc}
        alt={`Закладка проекта ${index + 1}`}
        onClick={() => !isActive && onNavigationClick(index)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        aria-current={isActive ? 'page' : undefined}
      />
    );
  };

  const renderFeatures = (features: IFeature[]) => (
    <ul className="modal-book__features-list">
      {features.map(({ label, description }, idx) => (
        <li key={idx} className="modal-book__features-item">
          <strong>{label}: </strong>{description}
        </li>
      ))}
    </ul>
  );

  const renderWorkDone = (workItems: string[]) => (
    <ul className="modal-book__work-list">
      {workItems.map((work, idx) => (
        <li key={idx} className="modal-book__work-item">{work}</li>
      ))}
    </ul>
  );

  const renderComponent = (component: IComponent) => (
    <div key={component.name} className="modal-book__component">
      <h4 className="modal-book__component-title">{component.name}</h4>
      <p className="modal-book__component-description">{component.description}</p>
      <div className="modal-book__component-section">
        <h5>Функции:</h5>
        {renderFeatures(component.features)}
      </div>
      <div className="modal-book__component-section">
        <h5>Проделанная работа:</h5>
        {renderWorkDone(component.workDone)}
      </div>
    </div>
  );

	const bookContent: IBookContent[] = 
	isMobile ? [
		// Первая страница (описание + функции)
		{
			header: { title: currentProject.content.title, subtitle: '' },
			left: null,
			right: (
				<>
					<section className="modal-book__description">
						<h3>Описание проекта</h3>
						<p>{currentProject.content.description}</p>
					</section>
					<section className="modal-book__work-done">
						<h3>Проделанная работа</h3>
						{renderWorkDone(currentProject.content.workDone)}
					</section>
				</>
			)
		},
		// Вторая страница (проделанная работа)
		{
			header: { title: currentProject.content.title, subtitle: '' },
			left: null,
			right: (
				<section className="modal-book__features">
					<h3>Основные функции</h3>
					{renderFeatures(currentProject.content.features)}
				</section>
			)
		},
		// Компоненты (каждый на отдельной странице)
		...currentProject.content.components.map(component => ({
			header: {
				title: currentProject.content.title,
				subtitle: 'Компоненты'
			},
			left: null,
			right: renderComponent(component)
		}))
	]
	: [
		// Десктоп версия (оригинальная структура)
		{
			header: { title: currentProject.content.title, subtitle: '' },
			left: (
				<>
					<section className="modal-book__description">
						<h3>Описание проекта</h3>
						<p>{currentProject.content.description}</p>
					</section>
					<section className="modal-book__work-done">
						<h3>Проделанная работа</h3>
						{renderWorkDone(currentProject.content.workDone)}
					</section>
				</>
			),
			right: (
				<section className="modal-book__features">
					<h3>Основные функции</h3>
					{renderFeatures(currentProject.content.features)}
				</section>
			)
		},
		...Array.from({ 
			length: Math.ceil(currentProject.content.components.length / 2) 
		}).map((_, i) => {
			const leftComponent = currentProject.content.components[i * 2];
			const rightComponent = currentProject.content.components[i * 2 + 1];
			
			return {
				header: {
					title: currentProject.content.title,
					subtitle: 'Компоненты'
				},
				left: leftComponent ? renderComponent(leftComponent) : null,
				right: rightComponent ? renderComponent(rightComponent) : null
			};
		})
	];

  const totalPages = bookContent.length;

  const {
    currentPage,
    handlePrev,
    handleNext,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canGoPrev,
    canGoNext,
  } = useModalPagination(totalPages);

  return (
    <div className="modal-book"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img 
        className="modal-book__image" 
        src={isMobile ? modalBookMobileImage : modalBookImage} 
        alt="book" 
        role="background" 
      />
      
      <button className="modal-book__close-button" 
        onClick={onClose}
        aria-label="Закрыть модальное окно"
      >
        <img src={btnCloseImage} alt="" />
      </button>

      {!isMobile ? (
        <nav className="modal-book__nav-projects" aria-label="Навигация по проектам">
          <div className="modal-book__nav-projects-left">
            {bookContentData.map((content, index) => 
              renderNavigationButton(
                content,
                index,
                index === activeImageIndex,
                index > activeImageIndex
              )
            )}
          </div>
          <div className="modal-book__nav-projects-right">
            {[...bookContentData].reverse().map((content, index) => {
              const originalIndex = bookContentData.length - 1 - index;
              return renderNavigationButton(
                content,
                originalIndex,
                originalIndex === activeImageIndex,
                originalIndex <= activeImageIndex
              );
            })}
          </div>
        </nav>
      )
			: (
        <nav className="modal-book__nav-projects" aria-label="Навигация по проектам">
					<div className="modal-book__nav-projects-right">
						{bookContentData.map((content, index) => 
							renderNavigationButton(
								content,
								index,
								index === activeImageIndex,
								false
							)
						)}
					</div>
        </nav>
      )}

      <div className="modal-book__content">
				<header className="modal-book__title">
          <h2 id="project-title">{bookContent[currentPage].header.title}</h2>
          <h3 className="modal-book__subtitle">{bookContent[currentPage].header.subtitle}</h3>
        </header>
        
        <div className="modal-book__content-part">
          {!isMobile && (
            <div className="modal-book__content-part_left">
              {bookContent[currentPage].left}
            </div>
          )}
          <div className="modal-book__content-part_right">
            {bookContent[currentPage].right}
          </div>
        </div>

        <div className="modal-book__link">
          <a className="modal-book__link_code" 
            href='#'
            aria-label="переход на страницу исходного кода"
          >
            <img src={btnLinkImage1} alt="" />
            <span>CODE</span>
          </a>
          <a className="modal-book__link_demo" 
            href='#'
            aria-label="переход на страницу демонстрации"
          >
            <img src={btnLinkImage2} alt="" />
            <span>DEMO</span>
          </a>
        </div>
      </div>

      <button 
        className={`modal-book__content-pagination-button ${isMobile ? 'modal-book__content-pagination-button--mobile' : ''} modal-book__content-pagination-button--left`}
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Предыдущая страница"
      >
        <img src={btnArrow} alt="Стрелка влево" draggable="false" />
      </button>

      <button 
        className={`modal-book__content-pagination-button ${isMobile ? 'modal-book__content-pagination-button--mobile' : ''} modal-book__content-pagination-button--right`}
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Следующая страница"
        style={{ transform: 'rotate(180deg)' }}
      >
        <img src={btnArrow} alt="Стрелка вправо" draggable="false" />
      </button>
    </div>
  );
};

export default BookModal;