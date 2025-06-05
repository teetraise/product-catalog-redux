import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleTheme, selectIsDarkMode } from '../../store/slices/themeSlice';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(selectIsDarkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={handleToggle}
      title={`Переключить на ${isDarkMode ? 'светлую' : 'темную'} тему`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-icon">
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </div>
      </div>
      <span className="toggle-label">
        {isDarkMode ? 'Темная' : 'Светлая'}
      </span>
    </button>
  );
};

export default ThemeToggle;