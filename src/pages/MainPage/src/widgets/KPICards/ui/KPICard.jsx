// src/widgets/KPICards/KPICard.jsx
import React, { memo } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { cn } from '../../../shared/lib/utils';
import useStore from '../../../app/store';
import { useTranslation } from '../../../shared/lib/i18n/translations';


const KPICard = memo(({ id, title, value, unit, trend, isSelected, onClick }) => {
  const { language } = useStore();
  const t = useTranslation(language);
  
  // Translate the unit using the translations
  const translatedUnit = t.units && t.units[unit] !== undefined ? t.units[unit] : unit;
  return (
    <div 
      onClick={() => onClick(id)}
      className={cn(
  "relative overflow-hidden border-t-2 cursor-pointer transition-all duration-200 hover:border-t-[#4779AB] dark:border-t-gray-800 lg:w-44 xl:w-54 gap-4",
  isSelected && "border-t-[#4779AB] dark:bg-[#13304d]",
  !isSelected && "border-t-gray-100 "
)}


    >
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8EFF5] to-white opacity-95 " />
      )}
      
      <div className={cn("text-center pt-2 hover:bg-gradient-to-b  hover:from-[#E8EFF5] hover:to-white dark:hover:bg-gradient-to-b dark:hover:from-[#13304d] dark:hover:to-[#E8EFF5] dark:border-t-gray-700 dark:bg-gradient-to-b dark:from-[#4779AB] dark:to-[#E8EFF5]", isSelected ? "relative z-10 dark:bg-gradient-to-b dark:from-[#4779AB] dark:to-[#E8EFF5]" : "bg-white")}>
        <h3 className={cn(
          "text-xs font-medium mb-3 uppercase tracking-wide dark:text-gray-200",
          isSelected ? "text-gray-600 " : "text-gray-600"
        )}>
          {title}
        </h3>
        
        <div className={cn(
          "text-3xl font-bold mb-3 dark:text-gray-800 ",
          isSelected ? "text-[#2B5E88]" : "text-[#2B5E88]"
        )}>
          {value} <span className="text-2xl font-normal">{translatedUnit}</span>
        </div>
        
        <div className="h-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isSelected ? "#4779AB" : "#4779AB"} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isSelected ? "#4779AB" : "#4779AB"} 
                    stopOpacity={0.5}
                  />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isSelected ? "#4779AB" : "#4779AB"}
                strokeWidth={2}
                fill={`url(#gradient-${id})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

KPICard.displayName = 'KPICard';

export default KPICard;