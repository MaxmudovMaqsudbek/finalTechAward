// src/widgets/DataVisualization/DataVisualization.jsx
import React from 'react';
import useStore from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';
import BarChartComponent from './BarChart';
import MapView from './MapView';


const DataVisualization = ({ barDataByKPI, kpiData }) => {
  const { selectedKPI, language } = useStore();
  const t = useTranslation(language);

  const getChartTitle = () => {
    switch (selectedKPI) {
      case 'numberOfLots':
        return t.numberOfLots;
      case 'procuringEntities':
        return t.procuringEntities;
      default:
        return t.ratings;
    }
  };

  const getChartData = () => {
    return barDataByKPI[selectedKPI] || barDataByKPI.numberOfLots;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <BarChartComponent 
        data={getChartData()} 
        title={getChartTitle()}
        kpiType={selectedKPI}
        kpiData={kpiData}
      />
      <MapView 
        title={t.geography} 
        kpiType={selectedKPI}
        kpiData={kpiData}
      />
    </div>
  );
};

export default DataVisualization;