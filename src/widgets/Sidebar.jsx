import { useTheme } from "../shared/lib/contexts/ThemeContext";
import { IoHomeOutline as Home} from "react-icons/io5";
import { MdOutlineContentPasteSearch as Analysis } from "react-icons/md";
import { HiMiniServerStack as Reports } from "react-icons/hi2";
import { GoChecklist  as ToDo} from "react-icons/go";
import {  Settings,  ChevronLeft, ChevronRight } from 'lucide-react';
// export const Sidebar = ({ activePage, setActivePage }) => {
//   const { isSidebarExpanded, toggleSidebar } = useTheme();
//   const navItems = [
//     { name: 'Main', icon: Home }, { name: 'Analysis', icon: BarChart2 },
//     { name: 'Reports', icon: TrendingUp }, { name: 'To Do', icon: CheckSquare },
//     { name: 'Settings', icon: Settings },
//   ];

//   return (
//     <aside className={`flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg z-30 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
//       <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-[85px]`}>
//         {isSidebarExpanded && <span className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</span>}
//       </div>
//       <nav className="flex-1 px-4 py-4 space-y-2">
//         {navItems.map((item) => (
//           <a key={item.name} href="#" onClick={() => setActivePage(item.name)}
//             className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activePage === item.name ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} ${!isSidebarExpanded && 'justify-center'}`}>
//             <item.icon size={22} />
//             {isSidebarExpanded && <span className="ml-4 font-medium">{item.name}</span>}
//           </a>
//         ))}
//       </nav>
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700">
//          <button onClick={toggleSidebar} className="p-3 w-full flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
//             {isSidebarExpanded ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
//         </button>
//       </div>
//     </aside>
//   );
// };










export const Sidebar = ({ activePage, setActivePage }) => {
  const { isSidebarExpanded, toggleSidebar } = useTheme();
  const navItems = [
    { name: 'Main', icon: Home }, { name: 'Analysis', icon: Analysis },
    { name: 'Reports', icon: Reports }, { name: 'To Do', icon: ToDo },
    { name: 'Settings', icon: Settings },
  ];

  const handleNavClick = (e, pageName) => {
    e.preventDefault();
    setActivePage(pageName);
  };

  return (
    <aside className={`flex flex-col bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg z-30 ${isSidebarExpanded ? 'w-44' : 'w-22'}`}>
      <div className={`flex  items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-[85px]`}>
        {isSidebarExpanded ? ( 
          <span className="pl-4 text-gray-800 dark:text-white flex flex-col items-center gap-1">
            <img className="w-12 h-12" src="/logoEq.png" alt="Equilibrium Logo" /> 
            <span className="text-lg font-medium">Equilibrium</span>
          </span>
        ) : (
          <img className="w-12 h-12" src="/logoEq.png" alt="Equilibrium Logo" />
        )}
      </div>
      <nav className="flex-1 px-4 py-4 space-y-4">
        {navItems.map((item) => (
          // bg-[linear-gradient(to right, #D9F1FF,#E0F4FF, #EAF8FF, #fff)]
          <a key={item.name} href="#" onClick={(e) => handleNavClick(e, item.name)}
            className={`flex items-center  p-3 rounded-lg transition-colors duration-200 ${activePage === item.name ? 'bg-gradient-to-r from-[#D9F1FF] to-white text-black shadow-lg dark:text-white dark:bg-gradient-to-r dark:from-[#0c3046] dark:to-[#96b7cc]' : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#D9F1FF] hover:to-white dark:hover:dark:text-white dark:hover:bg-gradient-to-r dark:hover:from-[#0c3046] dark:hover:to-[#96b7cc]'} ${!isSidebarExpanded && 'justify-center'}`}>
            <item.icon  size={30} />
            {isSidebarExpanded && <span className="ml-4 font-medium">{item.name}</span>}
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 cursor-pointer">
         <button onClick={toggleSidebar} className="p-3 w-full flex justify-center items-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            {isSidebarExpanded ? <ChevronLeft size={30} /> : <ChevronRight size={30} />}
        </button>
      </div>
    </aside>
  );
};