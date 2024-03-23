'use client';
import React from 'react';
import { ThemeContext } from '../ThemeProvider/ThemeProvider';

function ThemeButtons({}) {
  const { theme, setThemeLight, setThemeDark, setThemeAuto } = React.useContext(ThemeContext);
  return (
    <div>
      <div suppressHydrationWarning>Current Theme {}</div>
      <div>
        <button onClick={setThemeLight}>light theme</button>
      </div>
      <div>
        <button onClick={setThemeDark}>dark theme</button>
      </div>
      <div>
        <button onClick={setThemeAuto}>auto theme</button>
      </div>
    </div>
  );
}

export default ThemeButtons;
