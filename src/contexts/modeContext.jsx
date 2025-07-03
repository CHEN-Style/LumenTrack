import React, { createContext, useState, useContext } from 'react';

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [language, setLanguage] = useState('en-US');

  const toggleMode = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const toggleLanguage = () => setLanguage((prev) => (prev === 'zh-CN' ? 'en-US' : 'zh-CN'));

  return (
    <ModeContext.Provider value={{ mode, toggleMode, language, toggleLanguage }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
