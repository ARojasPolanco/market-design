import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function getInitialDark() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      className="relative text-gray-600 hover:text-gray-900"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
