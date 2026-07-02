import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    home: 'Home',
    marketplace: 'Marketplace',
    join: 'Join as Artisan',
    login: 'Artisan Login',
    dashboard: 'My Dashboard',
    signOut: 'Sign out',
    directFromMaker: 'Direct from maker',
    verified: 'Verified maker',
    madeToOrder: 'Made to order',
    inStock: 'In stock',
    exploreDistricts: 'Explore by district',
    craftTrails: 'Craft trails',
    ourImpact: 'Our impact',
    trackOrder: 'Track order',
    howToBuy: 'How to buy',
    share: 'Share',
  },
  fr: {
    home: 'Accueil',
    marketplace: 'Marché',
    join: 'Rejoindre',
    login: 'Connexion',
    dashboard: 'Mon tableau',
    signOut: 'Déconnexion',
    directFromMaker: 'Directement du fabricant',
    verified: 'Artisan vérifié',
    madeToOrder: 'Sur commande',
    inStock: 'En stock',
    exploreDistricts: 'Explorer par district',
    craftTrails: 'Circuits artisanaux',
    ourImpact: 'Notre impact',
    trackOrder: 'Suivre commande',
    howToBuy: 'Comment acheter',
    share: 'Partager',
  },
  sw: {
    home: 'Nyumbani',
    marketplace: 'Soko',
    join: 'Jiunge',
    login: 'Ingia',
    dashboard: 'Dashibodi yangu',
    signOut: 'Toka',
    directFromMaker: 'Moja kwa moja kutoka kwa mtengenezaji',
    verified: 'Mtengenezaji aliyethibitishwa',
    madeToOrder: 'Tengenezwa kwa oda',
    inStock: 'Ipo stoki',
    exploreDistricts: 'Chunguza wilaya',
    craftTrails: 'Njia za ufundi',
    ourImpact: 'Athari yetu',
    trackOrder: 'Fuatilia oda',
    howToBuy: 'Jinsi ya kununua',
    share: 'Shiriki',
  },
}

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('km_lang') || 'en')

  const setLanguage = (code) => {
    setLang(code)
    localStorage.setItem('km_lang', code)
  }

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key

  return (
    <I18nContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
