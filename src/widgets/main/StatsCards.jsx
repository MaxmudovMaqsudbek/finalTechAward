import React, { useState } from "react";
import { Card } from "../../shared/ui/Card";
import { mockApi } from "../../shared/api/MockApi";

const StatsCard = ({ title, data }) => (
    <Card className="flex-1">
      <h3 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-4">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([period, value]) => (
          <div key={period} className="flex justify-between items-baseline">
            <span className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{value.toLocaleString()}</span>
            <span className="text-gray-400 dark:text-gray-500 capitalize text-sm">{period}</span>
          </div>
        ))}
      </div>
    </Card>
);

export const StatsCards = () => {
    const [stats, setStats] = useState(null);

    React.useEffect(() => {
        mockApi.getStats().then(setStats);
    }, []);

    if (!stats) return <div>Loading Stats...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard title="Bids Analyzed" data={stats.bidsAnalyzed} />
            <StatsCard title="Bids analyzed today" data={stats.bidsAnalyzedToday} />
            <StatsCard title="Average red rigging cases in %" data={stats.avgRiggingCases} />
        </div>
    );
};