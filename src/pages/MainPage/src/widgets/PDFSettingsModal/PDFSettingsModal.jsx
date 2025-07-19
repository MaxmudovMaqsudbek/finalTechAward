// src/widgets/PDFSettingsModal/PDFSettingsModal.jsx
import React, { memo, useState } from 'react';
import { Plus, Minus, FileText, Download, Table } from 'lucide-react';
import { cn } from '../../shared/lib/utils';
import Modal from '../../shared/ui/Modal';
import { exportToPDFFromData, exportDashboardData, exportToCSV } from '../../shared/lib/pdfExport';
import { exportToWord } from '../../shared/lib/wordExport';
import useStore from '../../app/store';
import { fetchKPIData } from '../../shared/api/mockData';
import { useTranslation } from '../../shared/lib/i18n/translations';

const PDFSettingsModal = memo(({ isOpen, onClose }) => {
  const { selectedYear, selectedMonth, language } = useStore();
  const t = useTranslation(language);

  const paperSizes = [
    { value: 'a4', label: 'A4 (11.7" x 8.275")', dimensions: { width: 210, height: 297 } },
    { value: 'letter', label: 'Letter (11" x 8.5")', dimensions: { width: 216, height: 279 } },
    { value: 'legal', label: 'Legal (14" x 8.5")', dimensions: { width: 216, height: 356 } },
    { value: 'a3', label: 'A3 (16.5" x 11.7")', dimensions: { width: 297, height: 420 } },
    { value: 'tabloid', label: 'Tabloid (17" x 11")', dimensions: { width: 279, height: 432 } }
  ];

  // Create translatable export formats
  const exportFormats = [
    { value: 'pdf', label: t.pdfDocument, icon: FileText, description: t.pdfDescription },
    { value: 'docx', label: t.wordDocument, icon: FileText, description: t.wordDescription },
    { value: 'json', label: t.jsonData, icon: Download, description: t.jsonDescription },
    { value: 'csv', label: t.csvTable, icon: Table, description: t.csvDescription }
  ];

  const [settings, setSettings] = useState({
    exportFormat: 'pdf',
    paperSize: 'a4',
    resolution: 200,
    orientation: 'landscape',
    aspectRatio: 'current',
    includeData: true,
    includeCharts: true,
    includeFilters: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleResolutionChange = (delta) => {
    const newValue = settings.resolution + delta;
    if (newValue >= 72 && newValue <= 600) {
      handleSettingChange('resolution', newValue);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportFormat } = settings;
      
      if (exportFormat === 'pdf') {
        // Fetch current dashboard data for PDF export
        const dashboardData = await fetchKPIData({ 
          year: selectedYear, 
          month: selectedMonth 
        });
        
        // Export as structured PDF using data (not visual capture)
        await exportToPDFFromData(dashboardData, settings);
      } else if (exportFormat === 'docx') {
        // Fetch current dashboard data
        const dashboardData = await fetchKPIData({ 
          year: selectedYear, 
          month: selectedMonth 
        });
        
        // Export as Word document
        await exportToWord(dashboardData, settings);
      } else if (exportFormat === 'json' || exportFormat === 'csv') {
        // Fetch current dashboard data
        const dashboardData = await fetchKPIData({ 
          year: selectedYear, 
          month: selectedMonth 
        });
        
        if (exportFormat === 'json') {
          // Export structured data as JSON
          const exportData = {
            metadata: {
              exportDate: new Date().toISOString(),
              year: selectedYear,
              month: selectedMonth,
              format: 'json'
            },
            kpiData: dashboardData.kpiData,
            barDataByKPI: dashboardData.barDataByKPI,
            settings: {
              includeData: settings.includeData,
              includeCharts: settings.includeCharts,
              includeFilters: settings.includeFilters
            }
          };
          exportDashboardData(exportData);
        } else if (exportFormat === 'csv') {
          // Convert data to CSV format
          const csvData = [];
          
          // Add KPI data
          if (settings.includeData) {
            Object.entries(dashboardData.kpiData).forEach(([key, data]) => {
              csvData.push({
                Type: 'KPI',
                Metric: key,
                Value: data.value,
                Unit: data.unit,
                TrendData: JSON.stringify(data.trend)
              });
            });
          }
          
          // Add bar chart data
          if (settings.includeCharts) {
            Object.entries(dashboardData.barDataByKPI).forEach(([kpiName, items]) => {
              items.forEach(item => {
                csvData.push({
                  Type: 'BarChart',
                  Metric: kpiName,
                  Name: item.name,
                  Value: item.value,
                  Percent: item.percent
                });
              });
            });
          }
          
          const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
          exportToCSV(csvData, `dashboard-export-${timestamp}.csv`);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // You could show an error toast here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <div className="max-h-[85vh] overflow-y-auto dark:bg-slate-800 dark:text-white">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 dark:text-white">{t.exportSettings}</h2>
          
          {/* Export Format */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-white">
              {t.exportFormat}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map(format => {
                const IconComponent = format.icon;
                return (
                  <label key={format.value} className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.value}
                      checked={settings.exportFormat === format.value}
                      onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate dark:text-white">{format.label}</div>
                      <div className="text-xs text-gray-500 truncate dark:text-white">{format.description}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>          {/* Export Options */}
          {(settings.exportFormat === 'json' || settings.exportFormat === 'csv' || settings.exportFormat === 'docx' || settings.exportFormat === 'pdf') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">
                {t.includeInExport}
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeData}
                    onChange={(e) => handleSettingChange('includeData', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">{t.kpiData}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeCharts}
                    onChange={(e) => handleSettingChange('includeCharts', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">{t.chartData}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeFilters}
                    onChange={(e) => handleSettingChange('includeFilters', e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">{t.filterSettings}</span>
                </label>
              </div>
            </div>
          )}{/* PDF-specific settings */}
          {settings.exportFormat === 'pdf' && (
            <div className="space-y-4">
              {/* Paper Size & Orientation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    {t.paperSize}
                  </label>
                  <select
                    value={settings.paperSize}
                    onChange={(e) => handleSettingChange('paperSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {paperSizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                    {t.orientation}
                  </label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSettingChange('orientation', 'portrait')}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm rounded-lg border transition-colors",
                        settings.orientation === 'portrait'
                          ? "bg-gray-700 text-white border-gray-700 dark:text-white dark:bg-gray-700"
                          : "bg-white text-gray-700 dark:text-white dark:bg-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {t.portrait}
                    </button>
                    <button
                      onClick={() => handleSettingChange('orientation', 'landscape')}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm rounded-lg border transition-colors",
                        settings.orientation === 'landscape'
                          ? "bg-gray-700 text-white border-gray-700"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      {t.landscape}
                    </button>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  {t.resolution}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolutionChange(-10)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    disabled={settings.resolution <= 72}
                  >
                    <Minus className="w-4 h-4 text-gray-600 dark:text-white" />
                  </button>
                  <input
                    type="number"
                    value={settings.resolution}
                    onChange={(e) => handleSettingChange('resolution', parseInt(e.target.value) || 200)}
                    min="72"
                    max="600"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleResolutionChange(10)}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    disabled={settings.resolution >= 600}
                  >
                    <Plus className="w-4 h-4 text-gray-600 dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                  {t.aspectRatio}
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aspectRatio"
                      value="current"
                      checked={settings.aspectRatio === 'current'}
                      onChange={(e) => handleSettingChange('aspectRatio', e.target.value)}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-white">{t.keepCurrent}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aspectRatio"
                      value="fit"
                      checked={settings.aspectRatio === 'fit'}
                      onChange={(e) => handleSettingChange('aspectRatio', e.target.value)}
                      className="w-4 h-4 text-gray-600 dark:text-white focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-white">{t.fitToPage}</span>
                  </label>
                </div>
              </div>
            </div>
          )}          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-white hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isExporting}
            >
              {t.cancel}
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={cn(
                "px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors",
                isExporting 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-blue-700"
              )}
            >
              {isExporting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t.exporting}
                </span>
              ) : (
                settings.exportFormat === 'pdf' ? t.exportPdf : 
                settings.exportFormat === 'docx' ? t.exportDocx : 
                settings.exportFormat === 'json' ? t.exportJson : 
                t.exportCsv
              )}
            </button>
          </div>
      </div>
    </div>
    </Modal>
  );
});

PDFSettingsModal.displayName = 'PDFSettingsModal';

export default PDFSettingsModal;



































