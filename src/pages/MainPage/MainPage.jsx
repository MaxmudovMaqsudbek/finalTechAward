import { ConfidenceLevelChart } from "../../widgets/main/ConfidenceLevelChart";
import { RiggingCaseAreaChart } from "../../widgets/main/RiggingCaseAreaChart";
import { RiggingDetectionChart } from "../../widgets/main/RiggingDetectionChart";
import { StatsCards } from "../../widgets/main/StatsCards";
import DashboardPage from "./src/pages/Dashboard/ui/DashboardPage";
// import {DashboardPage} from "./src/pages/Dashboard/ui/DashboardPage"
export const MainPage = () => {
  return (
    <main className="p-0">
      {/* <StatsCards/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="">
            <RiggingDetectionChart />
        </div>
        <div className="">
            <RiggingCaseAreaChart/>
        </div>

        <div className="">
             <ConfidenceLevelChart/>
        </div>
      </div> */}

      <DashboardPage/>

    </main>
  );
};