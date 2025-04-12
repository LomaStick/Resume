export interface IContactInfo {
  name: string;
  phone: string;
  email: string;
  github?: string;
  portfolio?: string;
}

export interface IWorkExperience {
  dataFrom: string;
  dataTo: string;
  company: {
    name: string;
    info: string | null;
  };
  position: {
    name: string;
    info: string;
  };
}

export interface IEducation {
  institution: string;
  degree?: string;
  period: string;
}

export interface IStack {
  progLangs: string[];
  frontend: string[];
  backend: string[];
  tools: string[];
}

export interface ITabletContentData {
  position: string;
  contacts: IContactInfo;
  employment: string;
  schedule: string;
  experience: IWorkExperience[];
  stack: IStack;
  aboutMe: string;
  education: IEducation[];
}


export const tabletContentData: ITabletContentData = {
	position: 'Front-end developer',
	contacts: {
		name: 'Евгений К',
		phone: '+7(967)-967-66-47',
		email: 'lomastick.prog@gmail.com',
		github: 'https://github.com/yourusername',
		portfolio: 'https://yourportfolio.com',
	},
	employment: 'полная, частичная, проектная работа',
	schedule: 'полный день, гибкий график, удаленная работа',
	experience: [
		{
			dataFrom: 'Апрель 2022',
			dataTo: 'по настоящее время',
			company: {
				name: 'Индивидуальное предпринимательство / частная практика / фриланс',
				info: null,
			},
			position: {
				name: 'Web-разработчик',
				info: 'Верстка, разработка новых продуктов на базе: Node.JS, Nest.JS, TypeOrm, React, HTML, CSS, SASS, JS, TS',
			},
		},
		{
			dataFrom: '',
			dataTo: '',
			company: {
				name: 'Спецремстрой-К',
				info: 'Стройматериалы, сборные конструкции для ремонта и строительства (продвижение, оптовая торговля, производство, монтаж, сервис, ремонт)',
			},
			position: {
				name: 'Web-разработчик, Системный администратор',
				info: 'Поддержка и разработка внутренних Web интерфейсов, администрирование Linux и Windows систем, поддержка сети. Google apps script, Bash scripts, JS scripts.',
			},
		},
	],
	stack: {
		progLangs: ['JavaScript', 'TypeScript'],
		frontend: ['React', 'Redux', 'HTML', 'CSS', 'SASS'],
		backend: ['NodeJS', 'NestJS', 'Express'],
		tools: ['Git', 'Webpack', 'Docker', 'Figma'],
	},
	aboutMe:
		'Я front-end разработчик с опытом работы более 3 лет. Специализируюсь на создании современных, отзывчивых и производительных веб-приложений. Постоянно совершенствую свои навыки и изучаю новые технологии. Ищу интересные проекты, где могу применить свои знания и опыт для создания качественных продуктов.',
	education: [
		{
			institution: 'Санкт-Петербургский государственный университет аэрокосмического приборостроения',
			degree: 'Факультет автоматики и вычислительной техники.',
			period: '2019 - 2022',
		},
		{
			institution: 'Самообразование (онлайн-курсы, документация, книги) Front-end разработка',
			period: '2020 - по настоящее время',
		},
	],
};