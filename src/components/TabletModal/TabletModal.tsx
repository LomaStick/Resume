import { IContactInfo, IEducation, IWorkExperience, tabletContentData } from '@data/tabletContent';
import modalTabletImage1 from '@assets/images/tabaletContent/modalTablet1.png';
import modalTabletImage2 from '@assets/images/tabaletContent/modalTablet2.png';
import modalTabletImage3 from '@assets/images/tabaletContent/modalTablet3.png';
import btnArrow from '@assets/images/tabaletContent/buttonarrow2.png';
import { useModalNavigation } from '@hooks/useModalNavigation';
import './TabletModal.scss';
import { FC, useCallback, useEffect } from 'react';

interface ITabletContent {
  img: string;
  content: React.ReactNode;
}

interface ITabletModalProps {
  onClose?: () => void;
}


const TabletModal: FC<ITabletModalProps> = ({ onClose }) => {

	const renderContactItem = (contact: IContactInfo) => {
		const contactItems = [
			{
				label: 'Имя',
				value: contact.name,
				type: undefined
			},
			{
				label: 'Телефон',
				value: contact.phone,
				href: contact.phone,
				type: 'tel' as const
			},
			{
				label: 'Почта',
				value: contact.email,
				href: contact.email,
				type: 'email' as const
			},
			...(contact.github ? [{
				label: 'GitHub',
				value: contact.github,
				href: contact.github,
				type: 'link' as const
			}] : []),
			...(contact.portfolio ? [{
				label: 'Портфолио',
				value: contact.portfolio,
				href: contact.portfolio,
				type: 'link' as const
			}] : [])
		];
	
		return (
			<>
				{contactItems.map((item, idx) => {
					if (item.href && item.type) {
						let formattedHref = item.href;
						if (item.type === 'tel') {
							formattedHref = `tel:${item.href.replace(/\D/g, '')}`;
						} else if (item.type === 'email') {
							formattedHref = `mailto:${item.href}`;
						}
	
						return (
							<p key={idx} className="modal-tablet__text">
								<strong>{item.label}: </strong>
								<a 
									href={formattedHref} 
									className="modal-tablet__link"
									aria-label={`${item.label}: ${item.value}`}
									{...(item.type === 'link' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
								>
									{item.value}
								</a>
							</p>
						);
					}
	
					return (
						<p key={idx} className="modal-tablet__text">
							<strong>{item.label}: </strong> {item.value}
						</p>
					);
				})}
			</>
		);
	};
	
	const renderEducationItem = ({ institution, degree, period }: IEducation, idx?: number ) => (
		<div className="modal-tablet__education-item" key={idx}>
			<p className="modal-tablet__text">
				<strong>Учреждение: </strong> {institution}
			</p>
			{degree && (
				<p className="modal-tablet__text">
					<strong>Специальность: </strong> {degree}
				</p>
			)}
			<p className="modal-tablet__text">
				<strong>Период: </strong> <time dateTime={period}>{period}</time>
			</p>
		</div>
	);
	
	const renderExperienceItem = ({ dataFrom, dataTo, position, company }: IWorkExperience, idx? : number) => (
		<article className="modal-tablet__experience-item" key={idx}>
			<header className="modal-tablet__experience-header">
				<p className="modal-tablet__text">
					<strong>Период:</strong> <time dateTime={`${dataFrom}/${dataTo}`}>
						{dataFrom} - {dataTo}
					</time>
				</p>
				<h4 className="modal-tablet__text modal-tablet__experience-position">
					<strong>{position.name}</strong>
				</h4>
				<p className="modal-tablet__text">
					<strong>Компания:</strong> {company.name}
				</p>
			</header>
			<div className="modal-tablet__experience-details">
				<p className="modal-tablet__text">{position.info}</p>
				{company.info && (
					<p className="modal-tablet__text">
						<strong>О компании:</strong> {company.info}
					</p>
				)}
			</div>
		</article>
	);

  const tabletContent: ITabletContent[] = [
    {
      img: modalTabletImage1,
      content: (
        <>
          <h2 className="modal-tablet__title">{tabletContentData.position}</h2>
          
          <section className="modal-tablet__section" aria-labelledby="contacts-heading">
						<h3 id="contacts-heading" className="modal-tablet__subtitle">Контакты</h3>
						<div className="modal-tablet__contact-list">
							{renderContactItem(tabletContentData.contacts)}
						</div>
					</section>
  
          <section className="modal-tablet__section" aria-labelledby="about-heading">
            <h3 id="about-heading" className="modal-tablet__subtitle">О себе</h3>
            <p className="modal-tablet__text">{tabletContentData.aboutMe}</p>
          </section>
        </>
      ),
    },
    {
      img: modalTabletImage2,
      content: (
        <>
					 <section className="modal-tablet__section" aria-labelledby="education-heading">
            <h3 id="education-heading" className="modal-tablet__subtitle">Образование</h3>
            <div className="modal-tablet__education-list">
              {tabletContentData.education.map((edu, idx) => 
                renderEducationItem(edu, idx)
              )}
            </div>
          </section>

          <section className="modal-tablet__section" aria-labelledby="conditions-heading">
            <h3 id="conditions-heading" className="modal-tablet__subtitle">Условия работы</h3>
            <div className="modal-tablet__conditions">
              <p className="modal-tablet__text">
                <strong>Тип занятости: </strong> {tabletContentData.employment}
              </p>
              <p className="modal-tablet__text">
                <strong>График работы: </strong> {tabletContentData.schedule}
              </p>
            </div>
          </section>
  
          <section className="modal-tablet__section" aria-labelledby="stack-heading">
            <h3 id="stack-heading" className="modal-tablet__subtitle">Стек технологий</h3>
            <ul className="modal-tablet__stack-list">
              <li className="modal-tablet__text modal-tablet__stack-item">
                <strong>Языки программирования: </strong> {tabletContentData.stack.progLangs.join(', ')}
              </li>
              <li className="modal-tablet__text modal-tablet__stack-item">
                <strong>Frontend: </strong> {tabletContentData.stack.frontend.join(', ')}
              </li>
              <li className="modal-tablet__text modal-tablet__stack-item">
                <strong>Backend: </strong> {tabletContentData.stack.backend.join(', ')}
              </li>
              <li className="modal-tablet__text modal-tablet__stack-item">
                <strong>Инструменты: </strong> {tabletContentData.stack.tools.join(', ')}
              </li>
            </ul>
          </section>
        </>
      ),
    },
    {
      img: modalTabletImage3,
      content: (
        <section className="modal-tablet__section" aria-labelledby="experience-heading">
          <h3 id="experience-heading" className="modal-tablet__subtitle">Опыт работы</h3>
          <div className="modal-tablet__experience-list">
            {tabletContentData.experience.map((exp, idx) => 
              renderExperienceItem(exp, idx)
            )}
          </div>
        </section>
      ),
    },
  ];

  const {
    currentPage,
    isAnimating,
    handlePrev,
    handleNext,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    canGoPrev,
    canGoNext,
  } = useModalNavigation({
    totalPages: tabletContent.length,
    animationDuration: 2000,
  });

	// Обработчик клика для остановки всплытия ВО ВРЕМЯ АНИМАЦИИ
	const handleGlobalClick = useCallback((event: MouseEvent) => {
		if (isAnimating) {
			event.stopPropagation();
			event.preventDefault();
		}
	}, [isAnimating]);

	// Добавляем и удаляем глобальный обработчик клика
	useEffect(() => {
		if (isAnimating) {
			document.addEventListener('click', handleGlobalClick, { capture: true });
		} else {
			document.removeEventListener('click', handleGlobalClick, { capture: true });
		}

		return () => {
			document.removeEventListener('click', handleGlobalClick, { capture: true });
		};
	}, [isAnimating, handleGlobalClick]);


  const getPageClassName = useCallback((index: number): string => {
    const baseClass = 'modal-tablet';
    
    if (currentPage === index) return baseClass;
    if (currentPage > index && currentPage - index === 1) return `${baseClass} ${baseClass}_left`;
    if (currentPage < index && index - currentPage === 1) return `${baseClass} ${baseClass}_right`;
    return `${baseClass} ${baseClass}_inactive`;
  }, [currentPage]);

  return (
    <div 
      className="modal-tablet__container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
			{onClose && (
				<button 
					className="modal-tablet__close-button" 
					onClick={onClose}
					aria-label="Закрыть модальное окно"
				>
					×
				</button>
			)}

      {tabletContent.map((page, index) => (
        <div
          key={`tablet-page-${index}`}
          className={getPageClassName(index)}
          onClick={() => {
            if (currentPage > index && currentPage - index === 1) {
              handlePrev();
            } else if (currentPage < index && index - currentPage === 1) {
              handleNext();
            }
          }}
          aria-hidden={currentPage !== index}
        >
          <img 
            className="modal-tablet__image" 
            src={page.img} 
            alt={`Содержимое планшета - страница ${index + 1}`} 
            draggable="false"
          />
          <div className="modal-tablet__content">
            {page.content}
          </div>
        </div>
      ))}

      <button
        className={`modal-tablet__nav-button modal-tablet__nav-button--left`}
        onClick={handlePrev}
        disabled={!canGoPrev || isAnimating}
        aria-label="Предыдущая страница"
      >
        <img src={btnArrow} alt="Стрелка влево" draggable="false" />
      </button>

      <button
        className={`modal-tablet__nav-button modal-tablet__nav-button--right`}
        onClick={handleNext}
        disabled={!canGoNext || isAnimating}
        aria-label="Следующая страница"
        style={{ transform: 'rotate(180deg)' }}
      >
        <img src={btnArrow} alt="Стрелка вправо" draggable="false" />
      </button>
    </div>
  );
};

export default TabletModal;