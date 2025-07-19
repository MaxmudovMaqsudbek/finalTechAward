import { useState } from "react";
import { Sidebar } from "./widgets/Sidebar";
import { Header } from "./widgets/Header";
import { ThemeProvider } from "./shared/lib/contexts/ThemeContext";
import { MainPage } from "./pages/MainPage/MainPage";
import { AnalysisPage } from "./pages/AnalysisPage/AnalysisPage";
import { ReportsPage } from "./pages/Reports/ReportsPage";
import { ToDoPage } from "./pages/ToDo/ToDoPage";
import { AppStateProvider } from "./shared/lib/contexts/AppStateProvider";
import { SettingsPage } from "./pages/Settings/SettingsPage";

function App() {
  const [activePage, setActivePage] = useState('Analysis'); // Default to Analysis page to show changes

  const renderPage = () => {
    switch(activePage) {
        case 'Main':
            return <MainPage />;
        case 'Analysis':
            return <AnalysisPage/>;
        case 'Reports': 
            return <ReportsPage/>;
        case 'To Do': 
            return <ToDoPage/>;
        case 'Settings': 
            return <SettingsPage/>;
        default:
            return <MainPage />;
    }
  }

  return (
    <ThemeProvider>
      <AppStateProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <Header pageTitle={activePage} />
          {renderPage()}
        </div>
      </div>
      </AppStateProvider>
    </ThemeProvider>
  );
}

export default App;