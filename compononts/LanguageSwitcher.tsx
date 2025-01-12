'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    router.push(`/${lang}`); // Update the URL
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
    </div>
  );
}