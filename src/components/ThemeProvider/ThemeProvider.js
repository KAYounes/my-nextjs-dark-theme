'use client';

import { createPortal } from 'react-dom';
import { isClient, isServer } from '@/utils/checks';
import { isNull } from '@/utils/validations';
import { execOnce } from 'next/dist/shared/lib/utils';
import React from 'react';
import { stringMapper } from '@/utils/string_manip';

export const ThemeContext = React.createContext();

const THEME_VALUE_DARK = 'dark';
const THEME_VALUE_LIGHT = 'light';
const themes = [THEME_VALUE_LIGHT, THEME_VALUE_DARK, 'system'];

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(function () {
    /*
      If client side, load theme from local storage if exists, else set theme to system.
    */
    console.log(' useState 1');
    if (isServer()) return undefined;

    let localTheme = localStorage.getItem('theme');
    if (localTheme) return localTheme;
    return 'system';
  });

  const systemTheme = React.useRef();

  React.useEffect(function () {
    console.log(' Listen to system preference changes ');
    // Listen to system preference changes
    if (isServer()) return;

    const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.current = prefersDarkQuery.matches ? THEME_VALUE_DARK : THEME_VALUE_LIGHT;

    function handleQueryChange(event) {
      console.log(' handleQueryChange ');
      // if (theme === 'system') {
      if (event.media === '(prefers-color-scheme: dark)')
        if (event.matches) systemTheme.current = THEME_VALUE_DARK;
        else systemTheme.current = THEME_VALUE_LIGHT;
      applyTheme();
      // }
    }

    prefersDarkQuery.addEventListener('change', handleQueryChange);

    // clean up
    return () => prefersDarkQuery.removeEventListener('change', handleQueryChange);
  }, []);

  React.useEffect(function () {
    console.log(' handle local storage changes ');
    // handle local storage changes

    if (isServer()) return;

    function handleLocalChange(event) {
      console.log(' handleLocalChange ');
      const { key, newValue } = event;

      if (event.key === 'theme')
        if ([THEME_VALUE_LIGHT, THEME_VALUE_DARK, 'system'].includes(event.newValue)) {
          console.log(`setTheme to ${event.newValue === 'system' ? systemTheme : event.newValue}`);
          setTheme(event.newValue === 'system' ? systemTheme : event.newValue);
        }
    }

    window.addEventListener('storage', handleLocalChange);
    return () => window.removeEventListener('storage', handleLocalChange);
  }, []);

  React.useEffect(
    function () {
      console.log(' listen to theme state ');
      // listen to theme state
      if (isServer()) return;
      applyTheme();
    },
    [theme],
  );

  function applyTheme(log) {
    console.trace();
    console.log(' applyTheme ');
    let actualTheme = theme;
    if (theme === 'system') actualTheme = systemTheme.current;
    document.documentElement.setAttribute('data-theme', actualTheme);
  }

  const themeScript = `
    let localTheme = localStorage.getItem('theme'),
 
    systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
   
    _theme = systemTheme;
   
    if(localTheme && [${themes.map((e) => `'${e}'`)}].includes(localTheme))
        _theme = localTheme !== "system" ? localTheme : systemTheme;
  
    document.documentElement.setAttribute("data-theme", _theme);
    `;

  // const themeScriptGolfed = themeScript
  //     .replaceAll(/\n/g, "")
  //     .replaceAll(/(?<!let)\s/g, "")
  //     .replaceAll(/localTheme/g, "l")
  //     .replaceAll(/systemTheme/g, "s")
  //     .replaceAll(/_theme/g, "t");

  new RegExp(/(?<!let)s/);
  const themeScriptGolfed = stringMapper(themeScript, {
    '\n': '',
    '(?<!let)\\s': '',
    'localTheme': 'l',
    'systemTheme': 's',
    '_theme': 't',
  });

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeLight,
        setThemeDark,
        setThemeAuto,
      }}>
      <script /* Script used to determine theme on first load */
        dangerouslySetInnerHTML={{
          __html: themeScriptGolfed,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );

  function setThemeLight() {
    console.log(' setThemeLight ');
    updateTheme(THEME_VALUE_LIGHT);
  }

  function setThemeDark() {
    console.log(' setThemeDark ');
    updateTheme(THEME_VALUE_DARK);
  }

  function setThemeAuto() {
    console.log(' setThemeAuto ');
    updateTheme('system');
  }

  function updateLocalStorage(theme) {
    console.log(' updateLocalStorage ');
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // not on client side
      console.log('updateLocalStorage error > ', e);
    }
  }

  function updateTheme(theme_value) {
    console.log(' updateTheme ');
    setTheme(theme_value);
    updateLocalStorage(theme_value);
  }
}
