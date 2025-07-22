import { Search } from "lucide-react";
import { UserProfile } from "../entities/user/Profile";
import { Notifications } from "../features/Notifications";
import { ThemeToggler } from "../features/ThemeToggler";

export const Header = ({ pageTitle }) => {
  return (
    <header className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-5000 border-b border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl  text-gray-800 dark:text-gray-100 max-[425px]:hidden max-sm:text-xl">{pageTitle}</h1>
      <div className="flex items-center space-x-4 max-sm:space-x-1">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..."
            className="pl-10 pr-4 py-2 max-sm:py-1 w-82 max-md:w-48 max-sm:w-32 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <ThemeToggler />
        <Notifications />
        <UserProfile/>
      </div>
    </header>
  );
};