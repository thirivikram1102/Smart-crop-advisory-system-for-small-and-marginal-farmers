import { en } from './en';
import { ta } from './ta';
import { Language } from '../types';

export const translations = {
  en,
  ta,
};

export const getTranslation = (lang: Language) => {
  return translations[lang] || translations.ta;
};

export { en, ta };
