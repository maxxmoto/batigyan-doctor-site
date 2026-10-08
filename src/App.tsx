import React, { useState, useEffect, useRef } from 'react';
import {
  StethoscopeIcon,
  EndoscopeIcon,
  MicroscopeIcon,
  ScissorsIcon,
  BalloonIcon,
  SurgeryIcon,
  PhoneIcon,
  CheckIcon,
  ArrowIcon,
  CloseIcon,
  TimelineArrowIcon,
  GraduationCapIcon,
  HospitalIcon,
} from './components/Icons';
import { LogoIcon } from './components/Logo';
import Counter from './components/Counter';
import CookieBanner from './components/CookieBanner';

const DOCTOR_PHOTO = pub('/главныйэкран-cut.webp');
const RGMU_PHOTO = pub('/rostgmu.webp');
const RESIDENCY_PHOTO = pub('/ординатура.webp');
const OKB_PHOTO = pub('/окб2фото.webp');
const SEMYA_PHOTO = pub('/мцсемьятаймлайн.webp');
const ENDOSCOPY_PHOTO = 'https://image.qwenlm.ai/generated-images/7633e1d9-acac-4157-9087-8faf8c8f470c/_result.png';

const SERVICE_IMAGES = {
  consultation: 'https://image.qwenlm.ai/generated-images/e4b3e5d9-d46c-40fb-a28d-d2cc49105fbd/_result.png',
  gastroscopy: 'https://image.qwenlm.ai/generated-images/2c098be7-19ee-4039-8e08-c962101c4541/_result.png',
  colonoscopy: 'https://image.qwenlm.ai/generated-images/bd09062b-952b-481c-ab7f-c8b13c17084c/_result.png',
  polyps: 'https://image.qwenlm.ai/generated-images/a17e9859-7616-45c0-a275-0750eeef4975/_result.png',
  balloon: 'https://image.qwenlm.ai/generated-images/79def8f9-d99d-402f-be49-e00318d20ad8/_result.png',
  gastroplasty: 'https://image.qwenlm.ai/generated-images/5617efb9-4f2c-4a71-a9f4-fa43d766a0ac/_result.png',
};

const pub = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth > 768);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [success, setSuccess] = useState<{ name: string; phone: string } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const totalSlides = 5;
  const visibleServicesCount = 6;

  const symptoms = [
    'Боль и тяжесть в животе',
    'Частая изжога',
    'Вздутие живота',
    'Нарушения стула',
    'Тошнота',
    'Проблемы с пищеварением',
    'Необъяснимое снижение или набор веса',
    'Заболевания ЖКТ у близких родственников',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const section = document.getElementById('when-visit');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          symptoms.forEach((_, index) => {
            setTimeout(() => {
              const el = document.querySelector(`.symptom-check-${index}`);
              if (el) {
                el.classList.add('animate-check');
                setTimeout(() => el.classList.remove('animate-check'), 800);
              }
            }, index * 150);
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const openModal = () => {
    setIsModalOpen(true);
    setSuccess(null);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSuccess(null);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  };

  const handleSubmit = () => {
    const name = (document.getElementById('modalName') as HTMLInputElement)?.value || '';
    const phone = (document.getElementById('modalPhone') as HTMLInputElement)?.value || '';
    const consent = (document.getElementById('modalConsent') as HTMLInputElement)?.checked;
    if (!name || !phone) {
      showToast('error', 'Пожалуйста, заполните имя и телефон.');
      return;
    }
    if (!consent) {
      showToast('error', 'Необходимо согласие с политикой конфиденциальности.');
      return;
    }
    setSuccess({ name, phone });
    if (document.getElementById('modalName')) (document.getElementById('modalName') as HTMLInputElement).value = '';
    if (document.getElementById('modalPhone')) (document.getElementById('modalPhone') as HTMLInputElement).value = '';
    if (document.getElementById('modalConsent')) (document.getElementById('modalConsent') as HTMLInputElement).checked = false;
  };
  const toggleSymptom = (index: number) => {
    setSelectedSymptoms((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      {/* Header */}
      <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="logo">
          <img src={pub('/newlogobat.webp')} alt="Dr.Batigyan" />
        </a>

        <nav className="nav">
          <a href="#about">Обо мне</a>
          <a href="#services">Услуги</a>
          <a href="#approach">Подход</a>
          <a href="#when-visit">Когда обратиться</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="header-contacts">
            <a href="tel:+7хххххххххх" className="header-phone">
              <PhoneIcon />
              +7 ххх хххх хх
            </a>
            <div className="header-socials">
              <a href="#" className="header-social" aria-label="MAX">
                <img src={pub('/макс.svg')} alt="MAX" />
              </a>
              <a href="#" className="header-social" aria-label="Telegram">
                <img src={pub('/telegram.webp')} alt="Telegram" />
              </a>
            </div>
          </div>
          <a href="#" className="header-max" aria-label="MAX">
            <img src={pub('/макс.svg')} alt="MAX" />
          </a>
          <a
            href="#"
            className="btn-appointment"
            onClick={(e) => { e.preventDefault(); openModal(); }}
          >
            <span className="btn-full">ЗАПИСАТЬСЯ</span>
            <span className="btn-short">Запись</span>
          </a>

          <button
            className={`burger-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={closeMobileMenu}>Обо мне</a>
          <a href="#services" onClick={closeMobileMenu}>Услуги</a>
          <a href="#approach" onClick={closeMobileMenu}>Подход</a>
          <a href="#when-visit" onClick={closeMobileMenu}>Когда обратиться</a>
          <a href="#contacts" onClick={closeMobileMenu}>Контакты</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero2">
        <div className="hero2-pattern" aria-hidden="true"></div>
        <div className="hero2-content">
          <span className="hero2-badge">Батигян Эдуард Арсенович</span>
          <h1 className="hero2-title">Врач-эндоскопист<br />в Ростове-на-Дону</h1>
          <div className="hero2-stats">
            <div className="hero2-stat">
              <span className="hero2-stat-num">5000+</span>
              <span className="hero2-stat-lbl">процедур</span>
            </div>
            <div className="hero2-stat">
              <span className="hero2-stat-num">NBI</span>
              <span className="hero2-stat-lbl">диагностика</span>
            </div>
            <div className="hero2-stat">
              <span className="hero2-stat-num">100%</span>
              <span className="hero2-stat-lbl">точность</span>
            </div>
          </div>
        </div>
        <div className="hero2-photo">
          <img
            src={DOCTOR_PHOTO}
            alt="Батигян Эдуард Арсенович — врач-эндоскопист"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      {/* Consultation Banner */}
      <div className="consultation-banner">
        <h2>КОНСУЛЬТАЦИЯ</h2>
        <button className="arrow-btn" onClick={openModal} aria-label="Записаться">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="7" x2="17" y2="17"></line>
            <polyline points="17 7 17 17 7 17"></polyline>
          </svg>
        </button>
      </div>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="section-title">Обо мне</h2>
          <p className="about-intro">Я — врач-эндоскопист. <span className="highlight">Стаж работы — 15 лет</span>. Врач первой категории.</p>
          <p className="about-intro"><span className="highlight">Мои основные направления работы:</span> заболевания желудка и кишечника, гастроскопия и колоноскопия, удаление полипов, ранняя диагностика опасных изменений, помощь при лишнем весе.</p>
          <p className="about-intro"><span className="highlight">Регулярно прохожу повышение квалификации и участвую в медицинских конференциях. Это позволяет использовать современные методы обследования, лечения и профилактики заболеваний желудочно-кишечного тракта.</span></p>

          {/* Timeline */}
          <div className="timeline">
            <div className="timeline-track" style={{ transform: `translateX(-${currentSlide * 100}vw)` }}>
              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={RGMU_PHOTO} alt="Ростовский государственный медицинский университет" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2011</span>
                  <h3>РостГМУ</h3>
                  <p>Ростовский государственный медицинский университет, базовое образование</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={RESIDENCY_PHOTO} alt="Ординатура" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2013</span>
                  <h3>Ординатура</h3>
                  <p>Ростовский государственный медицинский университет, ординатура по хирургии</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={ENDOSCOPY_PHOTO} alt="Переподготовка по эндоскопии" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2015</span>
                  <h3>Переподготовка</h3>
                  <p>Ростовский государственный медицинский университет, цикл переподготовки «Эндоскопия»</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><HospitalIcon /></div>
                <div className="timeline-card-image">
                  <img src={OKB_PHOTO} alt="ГБУ РО ОКБ 2" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2016</span>
                  <h3>ОКБ №2</h3>
                  <p>Врач-эндоскопист в ГБУ РО «Областная клиническая больница №2»</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><HospitalIcon /></div>
                <div className="timeline-card-image">
                  <img src={SEMYA_PHOTO} alt="МЦ Семья" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2023</span>
                  <h3>МЦ «Семья»</h3>
                  <p>Врач-эндоскопист в медицинском центре «Семья», ул. Дачная, 8</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              {/* Дубликат для бесконечной анимации */}
              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={RGMU_PHOTO} alt="Ростовский государственный медицинский университет" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2011</span>
                  <h3>РостГМУ</h3>
                  <p>Ростовский государственный медицинский университет, базовое образование</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={RESIDENCY_PHOTO} alt="Ординатура" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2013</span>
                  <h3>Ординатура</h3>
                  <p>Ростовский государственный медицинский университет, ординатура по хирургии</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><GraduationCapIcon /></div>
                <div className="timeline-card-image">
                  <img src={ENDOSCOPY_PHOTO} alt="Переподготовка по эндоскопии" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2015</span>
                  <h3>Переподготовка</h3>
                  <p>Ростовский государственный медицинский университет, цикл переподготовки «Эндоскопия»</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><HospitalIcon /></div>
                <div className="timeline-card-image">
                  <img src={OKB_PHOTO} alt="ГБУ РО ОКБ 2" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2016</span>
                  <h3>ОКБ №2</h3>
                  <p>Врач-эндоскопист в ГБУ РО «Областная клиническая больница №2»</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-icon"><HospitalIcon /></div>
                <div className="timeline-card-image">
                  <img src={SEMYA_PHOTO} alt="МЦ Семья" loading="lazy" decoding="async" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2023</span>
                  <h3>МЦ «Семья»</h3>
                  <p>Врач-эндоскопист в медицинском центре «Семья», ул. Дачная, 8</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>
            </div>
            <div className="timeline-dots">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className={`timeline-dot ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Слайд ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Description under timeline */}
          <div className="about-details">
            <div className="about-details-text">
              <div className="quote-frame">
                <p>«Эдуард Арсенович проводит все исследования деликатно, минимизируя неприятные ощущения у пациентов. Заключения доктора крайне подробны в описании, что очень важно при постановке диагноза и дальнейшей тактике ведения пациента.»</p>
              </div>
            </div>
            <div className="about-stats">
              <div className="stats-marquee">
                <div className="stats-marquee-track">
                  <div className="stat-card">
                    <div className="number"><Counter target={15} /></div>
                    <div className="label">лет стажа</div>
                  </div>
                  <div className="stat-card">
                    <div className="number"><Counter target={5} decimals={1} /></div>
                    <div className="label">рейтинг</div>
                  </div>
                  <div className="stat-card">
                    <div className="number"><Counter target={53} /></div>
                    <div className="label">отзыва</div>
                  </div>
                  <div className="stat-card">
                    <div className="number"><Counter target={15} /></div>
                    <div className="label">лет стажа</div>
                  </div>
                  <div className="stat-card">
                    <div className="number"><Counter target={5} decimals={1} /></div>
                    <div className="label">рейтинг</div>
                  </div>
                  <div className="stat-card">
                    <div className="number"><Counter target={53} /></div>
                    <div className="label">отзыва</div>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="number"><Counter target={15} /></div>
                <div className="label">лет стажа</div>
              </div>
              <div className="stat-card">
                <div className="number"><Counter target={5} decimals={1} /></div>
                <div className="label">рейтинг</div>
              </div>
              <div className="stat-card">
                <div className="number"><Counter target={53} /></div>
                <div className="label">отзыва</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
        <h2 className="section-title">Услуги</h2>
        <p className="section-subtitle">Эндоскопическая диагностика, эндоскопические операции при заболеваниях ЖКТ, лечение ожирения, удаление полипов, остановка кровотечений и другие современные методы.</p>
        <div className="services-grid">
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.balloon})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>Лечение ожирения</h3>
              <p>Внутрижелудочное баллонное лечение ожирения. Endoscopic Sleeve Gastroplasty (ESG) — эндоскопическая рукавная гастропластика. Обучение пройдено в ОАЭ.</p>
            </div>
          </div>
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.gastroscopy})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>Эндоскопическая диагностика</h3>
              <p>Гастроскопия, колоноскопия с применением NBI, хромоэндоскопия, увеличительная эндоскопия для ранней диагностики предопухолевых заболеваний и рака.</p>
            </div>
          </div>
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.polyps})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>Удаление полипов и аденом</h3>
              <p>Эндоскопическое удаление полипов и аденом: холодная полипэктомия, горячая полипэктомия, резекция слизистой (EMR), эндоскопическая диссекция в подслизистом слое (ESD).</p>
            </div>
          </div>
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.colonoscopy})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>ЭРХПГ и лечение холедохолитиаза</h3>
              <p>Эндоскопическая ретроградная панкреатохолангиография, извлечение и дробление камней в желчных протоках, методика Spyglass — холангиоскопия.</p>
            </div>
          </div>
          {(showAllServices || isDesktop) && (
            <>
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.consultation})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>Остановка кровотечений</h3>
              <p>Остановка кровотечений из верхних отделов ЖКТ и толстой кишки комбинированными методиками: инъекционные, электрохирургические, клиппирование, аргоноплазменная коагуляция.</p>
            </div>
          </div>
          <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.gastroplasty})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <h3>Стентирование и дилатация</h3>
              <p>Эндоскопическое стентирование нитиноловыми стентами при обструктивных опухолях. Бужирование и баллонная дилатация при рубцовых сужениях пищевода и кишечника.</p>
            </div>
          </div>
            </>
          )}
          {showAllServices && (
            <>
              <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.gastroscopy})` }}>
                <div className="service-card-overlay"></div>
                <div className="service-card-content">
                  <h3>Лечение ахалазии кардии</h3>
                  <p>Пероральная эзофагомиоэктомия (ПОЭМ, POEM). Эндоскопическая крикофарингомиотомия (Z-POEM) при дивертикуле Ценкера.</p>
                </div>
              </div>
              <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.colonoscopy})` }}>
                <div className="service-card-overlay"></div>
                <div className="service-card-content">
                  <h3>Ургентная эндоскопия</h3>
                  <p>Эндоскопическая интубация трахеи, санационная бронхоскопия. Извлечение инородных тел из верхних отделов пищеварительного тракта и трахео-бронхиального дерева.</p>
                </div>
              </div>
              <div className="service-card" style={{ backgroundImage: `url(${SERVICE_IMAGES.polyps})` }}>
                <div className="service-card-overlay"></div>
                <div className="service-card-content">
                  <h3>Лечение пищевода Барретта</h3>
                  <p>Аргоно-плазменная коагуляция (АПК) при пищеводе Барретта. Лигирование вен пищевода при варикозном расширении.</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            className="btn-pill btn-pill-secondary"
            onClick={() => setShowAllServices(!showAllServices)}
          >
            {showAllServices ? 'Скрыть' : 'Посмотреть все услуги'}
          </button>
        </div>
      </section>

      {/* Workplaces Marquee */}
      <div className="workplaces-marquee-section">
        <div className="workplaces-marquee">
          <div className="workplaces-marquee-track">
            <div className="workplace-item">
              <a href="https://rnd.docdoc.ru/doctor/Batigyan_Eduard?ysclid=mutszoegh9107796103" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/sber.svg')} alt="СберЗдоровье" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://prodoctorov.ru/rostov-na-donu/vrach/640407-batigyan/?ysclid=mutszaer1a692710647" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/prodoctorov.webp')} alt="ПроДокторов" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://napopravku.ru/rostov-na-donu/doctor-profile/batigjan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/napopravku.webp')} alt="НаПоправку" className="workplace-logo workplace-logo-lg" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://rostov-ob2.ru/otdelenie-endoskopii/?ysclid=mutuumdzoe91042215" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/обк-2.webp')} alt="ОКБ №2" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://mc-semya.ru/doktora/endoskopisty/batigyan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/мцсемья.webp')} alt="МЦ «Семья»" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://doctu.ru/rostov/doctor/batigjan-ehduard-arsenovich?ysclid=mututjkdkk609971304" target="_blank" rel="noopener noreferrer">
                <img src={pub('/doctu.svg')} alt="Doctu" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://rnd.krasotaimedicina.ru/doc/batigyan-eduard-arsenovich-222416756/" target="_blank" rel="noopener noreferrer">
                <span aria-label="Красота и медицина" className="workplace-logo workplace-logo-mask" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://rnd.docdoc.ru/doctor/Batigyan_Eduard?ysclid=mutszoegh9107796103" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/sber.svg')} alt="СберЗдоровье" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://prodoctorov.ru/rostov-na-donu/vrach/640407-batigyan/?ysclid=mutszaer1a692710647" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/prodoctorov.webp')} alt="ПроДокторов" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://napopravku.ru/rostov-na-donu/doctor-profile/batigjan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/napopravku.webp')} alt="НаПоправку" className="workplace-logo workplace-logo-lg" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://rostov-ob2.ru/otdelenie-endoskopii/?ysclid=mutuumdzoe91042215" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/обк-2.webp')} alt="ОКБ №2" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://mc-semya.ru/doktora/endoskopisty/batigyan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">
                <img src={pub('/logos/мцсемья.webp')} alt="МЦ «Семья»" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://doctu.ru/rostov/doctor/batigjan-ehduard-arsenovich?ysclid=mututjkdkk609971304" target="_blank" rel="noopener noreferrer">
                <img src={pub('/doctu.svg')} alt="Doctu" className="workplace-logo" loading="lazy" decoding="async" />
              </a>
            </div>
            <div className="workplace-item">
              <a href="https://rnd.krasotaimedicina.ru/doc/batigyan-eduard-arsenovich-222416756/" target="_blank" rel="noopener noreferrer">
                <span aria-label="Красота и медицина" className="workplace-logo workplace-logo-mask" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="approach-section" id="approach">
        <div className="approach-content">
          <h2 className="section-title">Моя философия</h2>
          <p>Каждое исследование проводится максимально деликатно, <span className="highlight">с минимизацией неприятных ощущений</span>. <span className="highlight">Подробные заключения с детальным описанием</span> — основа правильной постановки диагноза и выбора тактики лечения.</p>
          <p>Используются современные эндоскопические системы с технологией <span className="highlight">NBI (narrow band imaging)</span>, позволяющей выявлять изменения слизистой <span className="highlight">на самых ранних стадиях</span>. Это особенно важно для <span className="highlight">профилактики онкологических заболеваний</span>.</p>
          <p><span className="highlight">Чёткие письменные рекомендации</span> по подготовке к исследованию, <span className="highlight">оперативная выдача протокола</span>, <span className="highlight">внимательное отношение к каждому пациенту</span> — то, за что меня рекомендуют коллеги и благодарят пациенты.</p>
        </div>
        <img src={pub('/философия.webp')} alt="Батигян Эдуард Арсенович" className="approach-photo" />
      </div>

      {/* When to Visit Section */}
      <section className="when-visit" id="when-visit">
        <div className="when-visit-content">
          <h2 className="section-title">Когда стоит обратиться</h2>
          <p className="section-subtitle">Выбери свою проблему:</p>
          <div className="symptoms-list">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className={`symptom-item ${selectedSymptoms.includes(index) ? 'selected' : ''}`}
                onClick={() => { toggleSymptom(index); openModal(); }}
              >
                <span className={`check symptom-check-${index} ${selectedSymptoms.includes(index) ? 'permanent' : ''}`}>
                  <CheckIcon />
                </span>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-container">
          <h2 className="section-title">Отзывы пациентов</h2>
          <p className="section-subtitle">Рейтинг 5.0 на основе 53 отзывов</p>
          <div className="reviews-marquee">
            <div className="reviews-marquee-track">
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Обратился для удаления полипов, которые были обнаружены при диагностике. Понравилось отношение врача, быстрота и безболезненность процедуры. Благодарю Эдуарда Арсеновича за проделанную работу!</p>
                <div className="review-author">Пациент, 18 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Я обратился к Эдуарду Арсеновичу по рекомендации сразу нескольких медиков. Его рекомендовали как одного из лучших эндоскопистов в Ростове. И это полностью соответствует! Эдуард Арсенович и его команда все делают быстро, чётко, профессионально!</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Обратилась к Эдуарду Арсеновичу по рекомендации знакомых. И не пожалела. Очень профессиональный, внимательный и деликатный доктор. Все прошло очень легко. По возрасту уже нужно было пройти ФГДС и колоноскопию.</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Отдельное спасибо за четкие письменные рекомендации по подготовке. Делайте, как сказано, и будет вам счастье! Ответственно заявляю: я все прошел без сложностей, и качество моей подготовки оценили на 9 из 10.</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Обратился для удаления полипов, которые были обнаружены при диагностике. Понравилось отношение врача, быстрота и безболезненность процедуры. Благодарю Эдуарда Арсеновича за проделанную работу!</p>
                <div className="review-author">Пациент, 18 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Я обратился к Эдуарду Арсеновичу по рекомендации сразу нескольких медиков. Его рекомендовали как одного из лучших эндоскопистов в Ростове. И это полностью соответствует! Эдуард Арсенович и его команда все делают быстро, чётко, профессионально!</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Обратилась к Эдуарду Арсеновичу по рекомендации знакомых. И не пожалела. Очень профессиональный, внимательный и деликатный доктор. Все прошло очень легко. По возрасту уже нужно было пройти ФГДС и колоноскопию.</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">Отдельное спасибо за четкие письменные рекомендации по подготовке. Делайте, как сказано, и будет вам счастье! Ответственно заявляю: я все прошел без сложностей, и качество моей подготовки оценили на 9 из 10.</p>
                <div className="review-author">Пациент, 4 сентября 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Content Section */}
      <div className="useful-appointment-wrapper">
        <div className="useful-appointment-left">
      <section className="useful-content-section">
        <div className="useful-content-container">
          <h2 className="section-title">Полезный контент</h2>
          <p className="section-subtitle">Подписывайтесь на мои социальные сети, где я делюсь полезной информацией о здоровье ЖКТ и профилактике заболеваний.</p>
          <div className="social-buttons">
            <a href="#" className="social-button social-button-telegram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Telegram</span>
            </a>
            <a href="#" className="social-button social-button-vk">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
              </svg>
              <span>ВКонтакте</span>
            </a>
            <a href="tel:+7хххххххххх" className="social-button social-button-phone">
              <PhoneIcon className="social-icon" />
              <span>Телефон</span>
            </a>
            {/* 
            <a href="#" className="social-button social-button-dzen">
              <img src="/dzen.svg" alt="Дзен" className="social-icon" />
              <span>Дзен</span>
            </a>
            <a href="#" className="social-button social-button-instagram">
              <img src="/instagram-1-svgrepo-com.svg" alt="Instagram" className="social-icon" />
              <span>Instagram</span>
            </a>
            */}
          </div>
        </div>
      </section>
        </div>
        <div className="useful-appointment-right">
          <img src={pub('/полезныйконтент.webp')} alt="Полезный контент и запись на приём" className="useful-appointment-photo" loading="lazy" decoding="async" />
        </div>
        <div className="useful-appointment-app">

      {/* Appointment Section */}
      <section className="appointment-section" id="contacts">
        <h2 className="section-title">Запись на приём</h2>
        <p>Записаться на консультацию, гастроскопию, колоноскопию с NBI или удаление полипов можно по телефону.</p>
        <div className="appointment-buttons">
          <a href="tel:+7хххххххххх" className="btn-pill btn-pill-primary">
            <PhoneIcon />
            Запись — +7 ххх хххх хх
          </a>
        </div>
      </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" itemScope itemType="https://schema.org/Physician">
        <div className="footer-content">
          <div>
            <h4>Батигян Эдуард Арсенович</h4>
            <p>Врач-эндоскопист. Стаж 15 лет. Рейтинг 5.0 по отзывам пациентов. МЦ «Семья», ГБУ РО ОКБ №2.</p>
          </div>
          <div>
            <h4>Навигация</h4>
            <p><a href="#about">Обо мне</a></p>
            <p><a href="#services">Услуги</a></p>
            <p><a href="#approach">Подход</a></p>
            <p><a href="#when-visit">Когда обратиться</a></p>
          </div>
          <div>
            <h4>Услуги</h4>
            <p><a href="#services">Лечение ожирения (ESG)</a></p>
            <p><a href="#services">Эндоскопическая диагностика</a></p>
            <p><a href="#services">Удаление полипов и аденом</a></p>
            <p><a href="#services">ЭРХПГ и холедохолитиаз</a></p>
            <p><a href="#services">Остановка кровотечений</a></p>
            <p><a href="#services">Стентирование и дилатация</a></p>
            <p><a href="#services">Лечение ахалазии кардии</a></p>
            <p><a href="#services">Ургентная эндоскопия</a></p>
            <p><a href="#services">Лечение пищевода Барретта</a></p>
          </div>
          <div>
            <h4>Контакты</h4>
            <address style={{ fontStyle: 'normal' }}>
              <p itemProp="addressLocality">Ростов-на-Дону</p>
              <p>МЦ «Семья», ул. Дачная, 8</p>
              <p>ОКБ №2, ул. 1-й Конной Армии, 33</p>
              <p><a href="tel:+7хххххххххх" itemProp="telephone">+7 ххх хххх хх</a></p>
              <p style={{ marginTop: '8px' }}>
                <a href="mailto:info@batigyan.ru" itemProp="email">info@batigyan.ru</a>
              </p>
            </address>
            <h4 style={{ marginTop: '16px' }}>Профили на сервисах</h4>
            <p><a href="https://rnd.docdoc.ru/doctor/Batigyan_Eduard?ysclid=mutszoegh9107796103" target="_blank" rel="noopener noreferrer">СберЗдоровье</a> — онлайн-запись</p>
            <p><a href="https://prodoctorov.ru/rostov-na-donu/vrach/640407-batigyan/?ysclid=mutszaer1a692710647" target="_blank" rel="noopener noreferrer">ПроДокторов</a> — отзывы и запись</p>
            <p><a href="https://napopravku.ru/rostov-na-donu/doctor-profile/batigjan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">НаПоправку</a> — запись онлайн</p>
            <p><a href="https://rostov-ob2.ru/otdelenie-endoskopii/?ysclid=mutuumdzoe91042215" target="_blank" rel="noopener noreferrer">ОКБ №2</a> — отделение эндоскопии</p>
            <p><a href="https://mc-semya.ru/doktora/endoskopisty/batigyan-eduard-arsenovich/" target="_blank" rel="noopener noreferrer">МЦ «Семья»</a> — страница врача</p>
            <p><a href="https://doctu.ru/rostov/doctor/batigjan-ehduard-arsenovich?ysclid=mututjkdkk609971304" target="_blank" rel="noopener noreferrer">Doctu</a> — запись онлайн</p>
            <p><a href="https://rnd.krasotaimedicina.ru/doc/batigyan-eduard-arsenovich-222416756/" target="_blank" rel="noopener noreferrer">Красота и медицина</a> — страница врача</p>
          </div>
        </div>
        
        <div className="footer-legal">
          <p style={{ marginBottom: '12px' }}>
            <strong>Имеются противопоказания. Необходима консультация специалиста.</strong>
          </p>
          <p style={{ marginBottom: '12px' }}>
            Информация, представленная на сайте, не является публичной офертой и не заменяет очную консультацию врача-эндоскописта. Постановка диагноза и назначение лечения возможны только после личного приёма и обследования.
          </p>
          <p style={{ fontSize: '11px', opacity: 0.7 }}>
            Батигян Эдуард Арсенович, врач-эндоскопист первой категории, стаж работы 15 лет.
          </p>
          <p style={{ marginTop: '8px', fontSize: '12px' }}>
            <a href="/consent.html">Согласие на обработку данных</a>
            {' · '}
            <a href="/privacy.html">Политика обработки персональных данных</a>
            {' · '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open-cookie-settings')); }}
            >
              Настройки cookie
            </a>
          </p>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Батигян Эдуард Арсенович. Все права защищены.</p>
          <p style={{ marginTop: '12px', fontSize: '11px', opacity: 0.6, lineHeight: 1.6 }}>
            Эндоскопист в Ростове-на-Дону — врач-эндоскопист Батигян Эдуард Арсенович. Все услуги: гастроскопия и колоноскопия с NBI, хромоэндоскопия, увеличительная эндоскопия, удаление полипов и аденом (холодная и горячая полипэктомия, EMR, ESD), лечение ожирения (внутрижелудочный баллон, ESG — эндоскопическая рукавная гастропластика), ЭРХПГ и лечение холедохолитиаза, остановка кровотечений ЖКТ, стентирование и дилатация пищевода, лечение ахалазии кардии (ПОЭМ), ургентная эндоскопия, лечение пищевода Барретта. Приём в МЦ «Семья» (ул. Дачная, 8) и ГБУ РО ОКБ №2 (ул. 1-й Конной Армии, 33). Запись на приём: СберЗдоровье, ПроДокторов, НаПоправку, Doctu, Красота и медицина.
          </p>
          <p style={{ marginTop: '8px', fontSize: '10px', opacity: 0.4 }}>
            Ключевые услуги: эндоскопическая диагностика, гастроскопия, колоноскопия, удаление полипов, лечение ожирения, ЭРХПГ, остановка кровотечений, стентирование, ахалазия кардии, ургентная эндоскопия, пищевод Барретта, ранняя диагностика рака желудка и кишечника, профилактика онкозаболеваний ЖКТ.
          </p>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal} aria-label="Закрыть">
              <CloseIcon />
            </button>
            {success ? (
              <div className="modal-success">
                <div className="modal-success-icon"><CheckIcon /></div>
                <h3>Заявка отправлена!</h3>
                <p className="modal-success-text">
                  Спасибо, {success.name}! Мы свяжемся с вами по номеру {success.phone} в ближайшее время.
                </p>
                <button className="modal-submit" onClick={closeModal}>Хорошо</button>
              </div>
            ) : (
              <>
                <h3>Запись на приём</h3>
                <input type="text" placeholder="Ваше имя" id="modalName" />
                <input type="tel" placeholder="Телефон" id="modalPhone" />
                <label className="modal-consent">
                  <input type="checkbox" id="modalConsent" />
                  <span>Я согласен(на) на <a href="/consent.html" target="_blank" rel="noopener noreferrer">обработку моих персональных данных</a> и с <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Политикой в отношении обработки и защиты персональных данных</a></span>
                </label>
                <button className="modal-submit" onClick={handleSubmit}>Отправить заявку</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="status">
          <span className="toast-icon">{toast.type === 'success' ? <CheckIcon /> : <CloseIcon />}</span>
          <span className="toast-text">{toast.text}</span>
        </div>
      )}

      <CookieBanner />
    </div>
  );
}

export default App;