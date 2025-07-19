import { Moon, Sun } from "lucide-react";
import { useTheme } from "../shared/lib/contexts/ThemeContext";

export const ThemeToggler = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
      {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
    </button>
  );
};