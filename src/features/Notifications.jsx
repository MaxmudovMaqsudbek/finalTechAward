import { Bell } from "lucide-react";

export const Notifications = () => (
  <button className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
    <Bell size={22} />
    <span className="absolute top-1 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-gray-800" />
  </button>
);