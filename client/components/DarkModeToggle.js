import { useState } from 'react';

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <button
    className="bg-gray-800 text-white px-4 py-2 rounded-md flex items-center justify-center"
    onClick={toggleDarkMode}
  >
    {isDarkMode ? (
      <img src="/images/sun-regular.svg" alt="Activer le Mode Clair" className="w-8 h-8"/>
    ) : (
      <img src="/images/moon-regular.svg" alt="Activer le Mode Sombre"className="w-8 h-8"/>
    )}
  </button>
  
  );
}