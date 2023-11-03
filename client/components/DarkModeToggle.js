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
      className="bg-gray-800 text-white px-4 py-2 rounded-md"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? 'Activer le Mode Clair' : 'Activer le Mode Sombre'}
    </button>
  );
}