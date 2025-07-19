// src/shared/api/mockData.js
export const generateMockData = () => {
  const barDataByKPI = {
    numberOfLots: [
      { name: '14000000-0 Конструк...', value: 693374, percent: 12.49 },
      { name: '15000000-8 Продукти...', value: 537335, percent: 9.68 },
      { name: '50000000-5 Послуги з...', value: 376297, percent: 6.78 },
      { name: '39000000-2 Меблі (у т...', value: 298777, percent: 5.38 },
      { name: '09000000-3 Нафтопро...', value: 272161, percent: 4.90 },
      { name: '33000000-0 Медичне...', value: 266841, percent: 4.81 },
      { name: '39000000-2 Меблі (у т...', value: 298777, percent: 5.38 },
      { name: '09000000-3 Нафтопро...', value: 272161, percent: 4.90 },
      { name: '33000000-0 Медичне...', value: 266841, percent: 4.81 },
    ],
    procuringEntities: [
      { name: '30000000-9 Офісна та...', value: 23139, percent: 76.30 },
      { name: '09000000-3 Нафтопро...', value: 23108, percent: 76.20 },
      { name: '72000000-5 Послуги у...', value: 22894, percent: 75.49 },
      { name: '60000000-8 Послуги з...', value: 21504, percent: 74.40 },
      { name: '39000000-2 Меблі (у т...', value: 18498, percent: 60.97 },
      { name: '14000000-8 Конструк...', value: 17688, percent: 58.30 },
      { name: '09000000-3 Нафтопро...', value: 23108, percent: 76.20 },
      { name: '72000000-5 Послуги у...', value: 22894, percent: 75.49 },
      { name: '60000000-8 Послуги з...', value: 21504, percent: 74.40 },
    ]
  };

  const kpiData = {
    numberOfLots: {
      value: "5,55",
      unit: "млн",
      trend: generateTrendData(4.5, 8.5)
    },
    expectedValue: {
      value: "2,73",
      unit: "трлн",
      trend: generateTrendData(3.2, 6.0)
    },
    procuringEntities: {
      value: "30,33",
      unit: "тис",
      trend: generateTrendData(28, 33)
    },
    allTimePeriods: {
      value: "225,90",
      unit: "тис",
      trend: generateTrendData(220, 230)
    },
    avgBidders: {
      value: "1,92",
      unit: "",
      trend: generateTrendData(1.8, 2.1)
    }
  };

  return { barDataByKPI, kpiData };
};

function generateTrendData(min, max) {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: min + Math.random() * (max - min)
  }));
}

// Ukraine regions GeoJSON data
export const ukraineGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { 
        "name": "Київська область", 
        "density": 85,
        "procuringEntities": 4500,
        "lots": 125000,
        "value": "450 млн",
        "kpiIntensity": 0.9
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [29.9, 50.8], [30.3, 51.1], [30.8, 51.0], [31.3, 50.9], [31.7, 50.7], 
          [32.0, 50.5], [32.2, 50.2], [32.1, 49.9], [31.8, 49.6], [31.4, 49.3], 
          [30.9, 49.1], [30.4, 49.0], [29.9, 49.2], [29.5, 49.5], [29.3, 49.8], 
          [29.4, 50.1], [29.6, 50.4], [29.9, 50.8]
        ]]
      }
    },
    {
      "type": "Feature", 
      "properties": { 
        "name": "Харківська область", 
        "density": 65,
        "procuringEntities": 3200,
        "lots": 98000,
        "value": "320 млн",
        "kpiIntensity": 0.7
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [36.2, 50.3], [37.8, 50.2], [38.9, 49.8], [39.7, 49.2], [40.1, 48.5], 
          [39.9, 47.8], [39.4, 47.2], [38.7, 46.8], [37.8, 46.6], [36.8, 46.7], 
          [36.0, 47.0], [35.4, 47.5], [35.1, 48.2], [35.2, 48.9], [35.6, 49.6], 
          [36.2, 50.3]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Одеська область", 
        "density": 55,
        "procuringEntities": 2800,
        "lots": 85000,
        "value": "280 млн",
        "kpiIntensity": 0.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [28.1, 47.9], [29.4, 48.0], [30.5, 47.7], [31.2, 47.2], [31.5, 46.5], 
          [31.3, 45.8], [30.8, 45.4], [30.0, 45.3], [28.9, 45.4], [27.8, 45.7], 
          [27.0, 46.2], [26.6, 46.9], [26.8, 47.6], [27.4, 48.0], [28.1, 47.9]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Львівська область", 
        "density": 70,
        "procuringEntities": 3800,
        "lots": 110000,
        "value": "380 млн",
        "kpiIntensity": 0.8
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [22.1, 50.3], [24.0, 50.6], [25.2, 50.2], [25.8, 49.6], [25.7, 48.8], 
          [25.2, 48.1], [24.3, 47.7], [23.2, 47.8], [22.3, 48.2], [21.7, 48.8], 
          [21.6, 49.5], [22.1, 50.3]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Дніпропетровська область", 
        "density": 75,
        "procuringEntities": 4200,
        "lots": 120000,
        "value": "420 млн",
        "kpiIntensity": 1.0
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [33.0, 49.3], [35.1, 49.4], [36.4, 48.9], [37.0, 48.2], [36.9, 47.4], 
          [36.3, 46.8], [35.4, 46.5], [34.2, 46.7], [33.0, 47.2], [32.2, 47.9], 
          [32.1, 48.7], [32.5, 49.1], [33.0, 49.3]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Запорізька область", 
        "density": 60,
        "procuringEntities": 2900,
        "lots": 78000,
        "value": "250 млн",
        "kpiIntensity": 0.6
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [33.8, 47.9], [36.0, 47.8], [37.8, 47.2], [38.5, 46.4], [38.2, 45.8], 
          [37.2, 45.5], [35.8, 45.7], [34.5, 46.2], [33.5, 46.8], [33.2, 47.4], 
          [33.8, 47.9]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Полтавська область", 
        "density": 45,
        "procuringEntities": 2100,
        "lots": 65000,
        "value": "200 млн",
        "kpiIntensity": 0.4
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [31.8, 50.2], [34.2, 50.3], [35.5, 49.8], [35.7, 49.2], [35.2, 48.6], 
          [34.3, 48.2], [33.1, 48.1], [32.0, 48.4], [31.4, 49.0], [31.5, 49.6], 
          [31.8, 50.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Донецька область", 
        "density": 50,
        "procuringEntities": 2500,
        "lots": 72000,
        "value": "230 млн",
        "kpiIntensity": 0.3
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [36.3, 49.1], [38.9, 49.0], [40.2, 48.4], [40.6, 47.6], [40.2, 46.9], 
          [39.3, 46.5], [38.0, 46.6], [36.8, 47.0], [36.0, 47.6], [35.8, 48.3], 
          [36.3, 49.1]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Чернігівська область", 
        "density": 35,
        "procuringEntities": 1800,
        "lots": 55000,
        "value": "180 млн",
        "kpiIntensity": 0.3
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [30.5, 52.0], [33.2, 52.2], [34.8, 51.6], [35.0, 50.8], [34.2, 50.3], 
          [32.8, 50.2], [31.4, 50.4], [30.2, 50.8], [29.8, 51.4], [30.5, 52.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Сумська область", 
        "density": 40,
        "procuringEntities": 2000,
        "lots": 58000,
        "value": "190 млн",
        "kpiIntensity": 0.4
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [33.0, 51.5], [35.8, 51.8], [36.9, 51.2], [37.2, 50.4], [36.5, 49.8], 
          [35.2, 49.6], [33.8, 49.9], [32.8, 50.5], [32.9, 51.2], [33.0, 51.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Вінницька область", 
        "density": 50,
        "procuringEntities": 2300,
        "lots": 68000,
        "value": "210 млн",
        "kpiIntensity": 0.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [26.4, 49.8], [29.2, 50.0], [30.8, 49.4], [31.2, 48.6], [30.6, 47.8], 
          [29.4, 47.4], [28.0, 47.5], [26.8, 48.0], [26.2, 48.8], [26.4, 49.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Черкаська область", 
        "density": 55,
        "procuringEntities": 2400,
        "lots": 71000,
        "value": "220 млн",
        "kpiIntensity": 0.6
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [30.2, 49.8], [32.4, 49.9], [33.5, 49.4], [33.8, 48.6], [33.2, 47.9], 
          [32.2, 47.6], [30.8, 47.7], [29.8, 48.2], [29.6, 49.0], [30.2, 49.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Луганська область", 
        "density": 40,
        "procuringEntities": 1900,
        "lots": 52000,
        "value": "170 млн",
        "kpiIntensity": 0.3
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [37.5, 49.8], [40.2, 49.6], [41.0, 48.8], [40.8, 48.0], [40.0, 47.4], 
          [38.8, 47.2], [37.6, 47.5], [36.9, 48.2], [37.2, 49.0], [37.5, 49.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Житомирська область", 
        "density": 35,
        "procuringEntities": 1700,
        "lots": 48000,
        "value": "160 млн",
        "kpiIntensity": 0.3
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [26.2, 51.2], [29.4, 51.4], [30.8, 50.8], [31.0, 50.0], [30.2, 49.2], 
          [28.8, 48.8], [27.2, 49.0], [25.8, 49.6], [25.6, 50.4], [26.2, 51.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Рівненська область", 
        "density": 30,
        "procuringEntities": 1500,
        "lots": 42000,
        "value": "140 млн",
        "kpiIntensity": 0.25
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [24.8, 51.6], [27.2, 51.8], [28.4, 51.2], [28.6, 50.4], [27.8, 49.8], 
          [26.4, 49.6], [25.0, 50.0], [24.2, 50.8], [24.8, 51.6]
        ]]
      }
    }
  ]
};

// Uzbekistan regions GeoJSON data
export const uzbekistanGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { 
        "name": "Toshkent shahri", 
        "density": 95,
        "procuringEntities": 5200,
        "lots": 145000,
        "value": "580 млн",
        "kpiIntensity": 0.95
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [69.0, 41.1], [69.3, 41.4], [69.6, 41.3], [69.8, 41.1], [69.7, 40.9], 
          [69.4, 40.8], [69.1, 40.9], [69.0, 41.1]
        ]]
      }
    },
    {
      "type": "Feature", 
      "properties": { 
        "name": "Toshkent viloyati", 
        "density": 75,
        "procuringEntities": 3800,
        "lots": 112000,
        "value": "420 млн",
        "kpiIntensity": 0.8
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [68.5, 41.8], [70.0, 42.0], [70.5, 41.5], [70.2, 40.8], [69.5, 40.5], 
          [68.8, 40.7], [68.5, 41.2], [68.5, 41.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Samarqand viloyati", 
        "density": 85,
        "procuringEntities": 4100,
        "lots": 125000,
        "value": "480 млн",
        "kpiIntensity": 0.9
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [66.0, 40.2], [67.8, 40.5], [68.2, 39.8], [67.5, 39.2], [66.8, 39.0], 
          [66.0, 39.3], [65.8, 39.8], [66.0, 40.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Andijon viloyati", 
        "density": 70,
        "procuringEntities": 3200,
        "lots": 95000,
        "value": "350 млн",
        "kpiIntensity": 0.75
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [71.5, 41.0], [72.8, 41.2], [73.0, 40.6], [72.5, 40.2], [71.8, 40.1], 
          [71.2, 40.4], [71.5, 41.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Farg'ona viloyati", 
        "density": 80,
        "procuringEntities": 3600,
        "lots": 108000,
        "value": "400 млн",
        "kpiIntensity": 0.85
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [70.8, 40.8], [72.0, 41.0], [72.3, 40.4], [71.8, 40.0], [71.0, 39.9], 
          [70.5, 40.2], [70.8, 40.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Namangan viloyati", 
        "density": 65,
        "procuringEntities": 2900,
        "lots": 87000,
        "value": "320 млн",
        "kpiIntensity": 0.7
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [70.5, 41.8], [72.0, 42.0], [72.5, 41.5], [72.0, 41.0], [71.2, 40.8], 
          [70.5, 41.2], [70.5, 41.8]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Qashqadaryo viloyati", 
        "density": 60,
        "procuringEntities": 2700,
        "lots": 78000,
        "value": "290 млн",
        "kpiIntensity": 0.65
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [65.5, 39.5], [67.2, 39.8], [67.8, 39.0], [67.2, 38.5], [66.0, 38.2], 
          [65.0, 38.5], [65.5, 39.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Surxondaryo viloyati", 
        "density": 45,
        "procuringEntities": 2100,
        "lots": 62000,
        "value": "230 млн",
        "kpiIntensity": 0.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [67.0, 38.2], [68.5, 38.5], [69.0, 37.8], [68.2, 37.2], [67.0, 37.0], 
          [66.0, 37.5], [67.0, 38.2]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Buxoro viloyati", 
        "density": 55,
        "procuringEntities": 2400,
        "lots": 72000,
        "value": "270 млн",
        "kpiIntensity": 0.6
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [63.5, 40.5], [65.8, 41.0], [66.5, 40.2], [65.8, 39.5], [64.2, 39.0], 
          [63.0, 39.5], [63.5, 40.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Navoiy viloyati", 
        "density": 50,
        "procuringEntities": 2200,
        "lots": 68000,
        "value": "520 млн",
        "kpiIntensity": 0.55
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [64.0, 41.5], [66.8, 42.0], [67.5, 41.0], [66.5, 40.0], [64.8, 39.8], 
          [63.5, 40.5], [64.0, 41.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Jizzax viloyati", 
        "density": 52,
        "procuringEntities": 2300,
        "lots": 69000,
        "value": "250 млн",
        "kpiIntensity": 0.58
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [67.0, 41.0], [68.5, 41.2], [69.0, 40.5], [68.2, 39.8], [67.0, 39.5], 
          [66.5, 40.2], [67.0, 41.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Sirdaryo viloyati", 
        "density": 58,
        "procuringEntities": 2600,
        "lots": 75000,
        "value": "280 млн",
        "kpiIntensity": 0.62
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [68.5, 41.5], [69.8, 41.8], [70.2, 41.2], [69.5, 40.8], [68.8, 40.6], 
          [68.2, 41.0], [68.5, 41.5]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Xorazm viloyati", 
        "density": 40,
        "procuringEntities": 1800,
        "lots": 54000,
        "value": "200 млн",
        "kpiIntensity": 0.45
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [60.0, 42.0], [61.8, 42.5], [62.5, 41.8], [61.8, 41.2], [60.5, 41.0], 
          [59.8, 41.5], [60.0, 42.0]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { 
        "name": "Qoraqalpog'iston Respublikasi", 
        "density": 35,
        "procuringEntities": 1500,
        "lots": 45000,
        "value": "180 млн",
        "kpiIntensity": 0.4
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [58.0, 45.0], [61.5, 46.0], [62.8, 44.5], [61.5, 42.5], [59.0, 42.0], 
          [57.5, 43.0], [58.0, 45.0]
        ]]
      }
    }
  ]
};

// API simulation functions
export const fetchKPIData = async (filters) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = generateMockData();
  
  // Apply filters if needed
  if (filters.year === '2024') {
    // Modify data for 2024
    Object.keys(data.kpiData).forEach(key => {
      const value = parseFloat(data.kpiData[key].value.replace(',', '.'));
      data.kpiData[key].value = (value * 0.85).toFixed(2).replace('.', ',');
    });
  }
  
  return data;
};