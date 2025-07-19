// src/shared/lib/pdfExport.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const paperDimensions = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
  a3: { width: 297, height: 420 },
  tabloid: { width: 279, height: 432 }
};

export const exportToPDF = async (elementId, settings) => {
  const {
    paperSize = 'a4',
    resolution = 200,
    orientation = 'landscape',
    aspectRatio = 'current'
  } = settings;

  try {
    // Get the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    console.log('Starting PDF export...', {
      elementId,
      elementSize: {
        width: element.scrollWidth,
        height: element.scrollHeight,
        offsetWidth: element.offsetWidth,
        offsetHeight: element.offsetHeight
      },
      settings
    });

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingDiv.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span class="text-gray-700">Generating PDF...</span>
        </div>
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // Configure html2canvas options
    const scale = Math.max(1, resolution / 96); // Ensure minimum scale of 1
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      foreignObjectRendering: true,
      imageTimeout: 15000,
      removeContainer: true
    });

    console.log('Canvas generated successfully', {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to generate canvas or canvas is empty');
    }

    // Get paper dimensions
    const paper = paperDimensions[paperSize];
    let pdfWidth = paper.width;
    let pdfHeight = paper.height;

    // Swap dimensions for portrait orientation
    if (orientation === 'portrait') {
      [pdfWidth, pdfHeight] = [pdfHeight, pdfWidth];
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    // Calculate image dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgRatio = imgWidth / imgHeight;
    const pdfRatio = pdfWidth / pdfHeight;

    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    let x = 0;
    let y = 0;

    if (aspectRatio === 'current') {
      // Keep current aspect ratio
      if (imgRatio > pdfRatio) {
        finalHeight = pdfWidth / imgRatio;
        y = (pdfHeight - finalHeight) / 2;
      } else {
        finalWidth = pdfHeight * imgRatio;
        x = (pdfWidth - finalWidth) / 2;
      }
    }
    // If aspectRatio === 'fit', use full page dimensions

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to convert canvas to image data');
    }
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `dashboard-export-${timestamp}.pdf`;

    console.log('Saving PDF...', { filename, finalWidth, finalHeight });

    // Save PDF
    pdf.save(filename);

    // Remove loading indicator
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
    }

    console.log('PDF export completed successfully');
    return { success: true, filename };
  } catch (error) {
    console.error('PDF export failed:', {
      error: error.message,
      stack: error.stack,
      elementId,
      settings
    });
    
    // Remove loading indicator if it exists
    const loadingIndicator = document.querySelector('.fixed.inset-0');
    if (loadingIndicator && document.body.contains(loadingIndicator)) {
      document.body.removeChild(loadingIndicator);
    }

    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
      <div class="flex items-center gap-2">
        <span>❌</span>
        <span>PDF export failed: ${error.message}</span>
      </div>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto-remove error message after 5 seconds
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 5000);

    throw error;
  }
};

// Fallback PDF export using structured data instead of visual capture
export const exportToPDFFromData = async (data, settings) => {
  try {
    const {
      paperSize = 'a4',
      orientation = 'landscape',
      includeData = true,
      includeCharts = true,
      includeFilters = true
    } = settings;

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingDiv.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span class="text-gray-700">Generating PDF Report...</span>
        </div>
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // Get paper dimensions
    const paper = paperDimensions[paperSize];
    let pdfWidth = paper.width;
    let pdfHeight = paper.height;

    // Swap dimensions for portrait orientation
    if (orientation === 'portrait') {
      [pdfWidth, pdfHeight] = [pdfHeight, pdfWidth];
    }

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    // Add title
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Dashboard Export Report', pdfWidth / 2, 25, { align: 'center' });

    // Add subtitle
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'normal');
    pdf.text('Key Performance Indicators & Analytics', pdfWidth / 2, 35, { align: 'center' });

    // Add timestamp
    pdf.setFontSize(10);
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated on: ${timestamp}`, pdfWidth / 2, 45, { align: 'center' });

    let yPosition = 60;

    // Add KPI data if available and included
    if (includeData && data.kpiData) {
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Key Performance Indicators', 20, yPosition);
      yPosition += 15;

      // Add a line under the heading
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition - 2, pdfWidth - 20, yPosition - 2);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');

      Object.entries(data.kpiData).forEach(([key, kpi]) => {
        const displayName = formatKpiNameForPDF(key);
        const value = `${kpi.value || 'N/A'} ${kpi.unit || ''}`;
        
        // Create a formatted line for each KPI
        pdf.setFont(undefined, 'bold');
        pdf.text(`${displayName}:`, 25, yPosition);
        pdf.setFont(undefined, 'normal');
        pdf.text(value, 120, yPosition);
        
        // Add trend information if available
        if (kpi.trend && kpi.trend.length > 0) {
          const trendAvg = (kpi.trend.reduce((sum, t) => sum + t.value, 0) / kpi.trend.length).toFixed(2);
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          pdf.text(`(Avg trend: ${trendAvg})`, 160, yPosition);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(12);
        }
        
        yPosition += 12;

        if (yPosition > pdfHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
      });

      yPosition += 15;
    }

    // Add chart data if available and included
    if (includeCharts && data.barDataByKPI && yPosition < pdfHeight - 60) {
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Detailed Analytics', 20, yPosition);
      yPosition += 15;

      // Add a line under the heading
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition - 2, pdfWidth - 20, yPosition - 2);
      yPosition += 10;

      Object.entries(data.barDataByKPI).forEach(([kpiName, items]) => {
        if (yPosition > pdfHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text(formatKpiNameForPDF(kpiName), 25, yPosition);
        yPosition += 12;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        // Table headers
        pdf.setFont(undefined, 'bold');
        pdf.text('Rank', 30, yPosition);
        pdf.text('Category', 50, yPosition);
        pdf.text('Value', pdfWidth - 80, yPosition);
        pdf.text('Percentage', pdfWidth - 40, yPosition);
        yPosition += 8;

        // Add line under headers
        pdf.setLineWidth(0.2);
        pdf.line(30, yPosition - 2, pdfWidth - 20, yPosition - 2);
        yPosition += 5;

        pdf.setFont(undefined, 'normal');
        items.slice(0, 8).forEach((item, index) => { // Show top 8 items
          // Truncate long names
          let displayName = item.name || 'N/A';
          if (displayName.length > 40) {
            displayName = displayName.substring(0, 37) + '...';
          }
          
          pdf.text(`${index + 1}`, 30, yPosition);
          pdf.text(displayName, 50, yPosition);
          pdf.text((item.value?.toLocaleString() || 'N/A'), pdfWidth - 80, yPosition, { align: 'right' });
          pdf.text(`${item.percent || 0}%`, pdfWidth - 40, yPosition, { align: 'right' });
          yPosition += 7;

          if (yPosition > pdfHeight - 25) {
            pdf.addPage();
            yPosition = 20;
          }
        });

        yPosition += 10;
      });
    }

    // Add metadata footer if includeFilters is true
    if (includeFilters) {
      // Go to last page and add footer
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setPage(pageCount);
      
      const footerY = pdfHeight - 20;
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Export Settings:', 20, footerY);
      pdf.text(`Format: PDF, Paper: ${paperSize.toUpperCase()}, Orientation: ${orientation}`, 20, footerY + 5);
      pdf.text(`Data Included: ${[includeData ? 'KPIs' : null, includeCharts ? 'Charts' : null].filter(Boolean).join(', ') || 'None'}`, 20, footerY + 10);
    }

    // Generate filename with timestamp
    const fileTimestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `dashboard-report-${fileTimestamp}.pdf`;

    // Save PDF
    pdf.save(filename);

    // Remove loading indicator
    if (document.body.contains(loadingDiv)) {
      document.body.removeChild(loadingDiv);
    }

    console.log('Structured PDF export completed successfully');
    return { success: true, filename };
  } catch (error) {
    console.error('Structured PDF export failed:', error);
    
    // Remove loading indicator if it exists
    const loadingIndicator = document.querySelector('.fixed.inset-0');
    if (loadingIndicator && document.body.contains(loadingIndicator)) {
      document.body.removeChild(loadingIndicator);
    }
    
    throw error;
  }
};

function formatKpiNameForPDF(key) {
  const formatted = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  const replacements = {
    'Number Of Lots': 'Number of Lots',
    'Expected Value': 'Expected Value',
    'Procuring Entities': 'Number of Procuring Entities',
    'All Time Periods': 'All Time Periods',
    'Avg Bidders': 'Average Number of Bidders'
  };
  
  return replacements[formatted] || formatted;
}

// Export dashboard data as JSON (additional export option)
export const exportDashboardData = (data) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `dashboard-data-${timestamp}.json`;
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

// Export as CSV
export const exportToCSV = (data, filename = 'dashboard-export.csv') => {
  // Convert data to CSV format
  const csvContent = convertToCSV(data);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  
  URL.revokeObjectURL(link.href);
};

function convertToCSV(data) {
  if (!data || !data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      return typeof value === 'string' && value.includes(',') 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}