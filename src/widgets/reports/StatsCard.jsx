import { Card } from "../../shared/ui/Card";

export const StatsCard = ({ title, data }) => (
  <Card className="flex-1">
    <h3 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-4">
      {title}
    </h3>
    <div className="space-y-2">
      {Object.entries(data).map(([period, value]) => (
        <div key={period} className="flex justify-between items-baseline">
          <span className="text-gray-400 dark:text-gray-500 capitalize text-sm">
            {period}
          </span>
          <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </Card>
);
