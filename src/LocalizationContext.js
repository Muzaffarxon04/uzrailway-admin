import React, { createContext, useContext, useEffect, useState } from "react";

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("app-language") || "uz";
  });

  const [translations, setTranslations] = useState({});

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("app-theme") || "light";
  });

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}/translation.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };

    loadTranslations();
  }, [language]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setLanguage = (lang) => {
    localStorage.setItem("app-language", lang);
    setLanguageState(lang);
  };

  const setTheme = (newTheme) => {
    localStorage.setItem("app-theme", newTheme);
    setThemeState(newTheme);
  };

  const t = (key) => translations[key] || key;

  return (
    <LocalizationContext.Provider
      value={{ t, language, setLanguage, theme, setTheme }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
