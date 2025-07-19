// src/shared/lib/wordExport.js
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export const exportToWord = async (data, settings) => {
  try {
    // Create document
    const doc = new Document({
      styles: {
        default: {
          heading1: {
            run: {
              size: 32,
              bold: true,
              color: "2B2B2B",
            },
            paragraph: {
              spacing: {
                after: 240,
              },
            },
          },
          heading2: {
            run: {
              size: 28,
              bold: true,
              color: "404040",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
        },
      },
      sections: [
        {
          children: await createDocumentContent(data, settings),
        },
      ],
    });

    // Generate the document
    const blob = await Packer.toBlob(doc);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `dashboard-export-${timestamp}.docx`;
    
    // Save the document
    saveAs(blob, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Word export failed:', error);
    throw error;
  }
};

async function createDocumentContent(data, settings) {
  const children = [];

  // Add title
  children.push(
    new Paragraph({
      text: "Dashboard Export Report",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          size: 20,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
    })
  );

  // Add KPI Data section
  if (settings.includeData && data.kpiData) {
    children.push(
      new Paragraph({
        text: "Key Performance Indicators",
        heading: HeadingLevel.HEADING_1,
      })
    );

    // Create KPI table
    const kpiRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Metric", alignment: AlignmentType.CENTER })],
            width: { size: 40, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: "Value", alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: "Unit", alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            children: [new Paragraph({ text: "Trend Summary", alignment: AlignmentType.CENTER })],
            width: { size: 20, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ];

    Object.entries(data.kpiData).forEach(([key, kpiItem]) => {
      const trendAvg = kpiItem.trend?.length > 0 
        ? (kpiItem.trend.reduce((sum, t) => sum + t.value, 0) / kpiItem.trend.length).toFixed(2)
        : 'N/A';

      kpiRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: formatKpiName(key) })],
            }),
            new TableCell({
              children: [new Paragraph({ text: kpiItem.value || 'N/A', alignment: AlignmentType.CENTER })],
            }),
            new TableCell({
              children: [new Paragraph({ text: kpiItem.unit || '', alignment: AlignmentType.CENTER })],
            }),
            new TableCell({
              children: [new Paragraph({ text: `Avg: ${trendAvg}`, alignment: AlignmentType.CENTER })],
            }),
          ],
        })
      );
    });

    children.push(
      new Table({
        rows: kpiRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      }),
      new Paragraph({ text: "" }) // Add spacing
    );
  }

  // Add Chart Data section
  if (settings.includeCharts && data.barDataByKPI) {
    children.push(
      new Paragraph({
        text: "Chart Data Breakdown",
        heading: HeadingLevel.HEADING_1,
      })
    );

    Object.entries(data.barDataByKPI).forEach(([kpiName, items]) => {
      children.push(
        new Paragraph({
          text: formatKpiName(kpiName),
          heading: HeadingLevel.HEADING_2,
        })
      );

      // Create table for this KPI's data
      const chartRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "Category", alignment: AlignmentType.CENTER })],
              width: { size: 60, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: "Value", alignment: AlignmentType.CENTER })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: "Percentage", alignment: AlignmentType.CENTER })],
              width: { size: 20, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ];

      items.forEach(item => {
        chartRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: item.name || 'N/A' })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.value?.toLocaleString() || 'N/A', alignment: AlignmentType.RIGHT })],
              }),
              new TableCell({
                children: [new Paragraph({ text: item.percent ? `${item.percent}%` : 'N/A', alignment: AlignmentType.RIGHT })],
              }),
            ],
          })
        );
      });

      children.push(
        new Table({
          rows: chartRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
        new Paragraph({ text: "" }) // Add spacing
      );
    });
  }

  // Add metadata section
  children.push(
    new Paragraph({
      text: "Export Information",
      heading: HeadingLevel.HEADING_1,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Export Format: ", bold: true }),
        new TextRun({ text: "Microsoft Word Document (.docx)" }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Export Date: ", bold: true }),
        new TextRun({ text: new Date().toLocaleString() }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Data Included: ", bold: true }),
        new TextRun({ 
          text: [
            settings.includeData ? "KPI Data" : null,
            settings.includeCharts ? "Chart Data" : null,
            settings.includeFilters ? "Filter Settings" : null,
          ].filter(Boolean).join(", ") || "None"
        }),
      ],
    })
  );

  return children;
}

function formatKpiName(key) {
  const formatted = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  // Handle special cases
  const replacements = {
    'Number Of Lots': 'Number of Lots',
    'Expected Value': 'Expected Value',
    'Procuring Entities': 'Number of Procuring Entities',
    'All Time Periods': 'All Time Periods',
    'Avg Bidders': 'Average Number of Bidders'
  };
  
  return replacements[formatted] || formatted;
}
