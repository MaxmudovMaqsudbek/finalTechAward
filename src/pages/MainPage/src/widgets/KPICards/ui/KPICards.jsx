// src/widgets/KPICards/KPICards.jsx
import React, { useCallback } from 'react';
import useStore from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';
import KPICard from './KPICard';



const KPICards = ({ kpiData }) => {
  const { selectedKPI, setSelectedKPI, language } = useStore();
  const t = useTranslation(language);

  const kpiCards = [
    { id: 'numberOfLots', title: t.numberOfLots, ...kpiData.numberOfLots },
    { id: 'expectedValue', title: t.expectedValue, ...kpiData.expectedValue },
    { id: 'procuringEntities', title: t.procuringEntities, ...kpiData.procuringEntities },
    { id: 'allTimePeriods', title: t.allTimePeriods, ...kpiData.allTimePeriods },
    { id: 'avgBidders', title: t.avgBidders, ...kpiData.avgBidders }
  ];

  const handleKPIClick = useCallback((kpiId) => {
    setSelectedKPI(kpiId);
  }, [setSelectedKPI]);

  return (
    <div className="grid xl:grid-cols-5 gap-4 lg:grid-cols-5 md:grid-cols-3">
      {kpiCards.map((kpi) => (
        <KPICard
          key={kpi.id}
          id={kpi.id}
          title={kpi.title}
          value={kpi.value}
          unit={kpi.unit}
          trend={kpi.trend}
          isSelected={selectedKPI === kpi.id}
          onClick={handleKPIClick}
        />
      ))}
    </div>
  );
};

export default KPICards;