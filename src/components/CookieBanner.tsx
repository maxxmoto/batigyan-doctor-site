import React, { useEffect, useState } from 'react';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookie-consent')) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const openSettings = () => setVisible(true);
    window.addEventListener('open-cookie-settings', openSettings);
    return () => window.removeEventListener('open-cookie-settings', openSettings);
  }, []);

  const choose = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem('cookie-consent', value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Использование файлов cookie">
      <div className="cookie-banner-text">
        <p>
          Мы используем файлы cookie, чтобы сайт работал корректно и был удобнее. <strong>Необходимые</strong> cookie
          обеспечивают работу сайта, <strong>аналитические</strong> помогают улучшать сервис. Вы можете принять все
          cookie или отклонить необязательные. Подробнее — в{' '}
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">политике конфиденциальности</a>.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <button className="cookie-btn cookie-btn-ghost" onClick={() => choose('rejected')}>
          Отклонить
        </button>
        <button className="cookie-btn cookie-btn-primary" onClick={() => choose('accepted')}>
          Принять все
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;