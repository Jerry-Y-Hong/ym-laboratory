import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const LANGUAGES = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ko');
  const [cart, setCart] = useState([]);

  const addToCart = (kit) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === kit.id);
      if (ex) return prev.map(i => i.id === kit.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...kit, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{ lang, setLang, cart, addToCart, removeFromCart, cartTotal }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
