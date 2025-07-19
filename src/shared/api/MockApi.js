
    export const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    export const generateMockReports = (count) => {
            const reports = [];
            const riggingTypes = ['low', 'medium', 'high'];
            for (let i = 0; i < count; i++) {
                const riggingType = riggingTypes[Math.floor(Math.random() * 3)];
                
                // Generate network data based on rigging level
                const generateNetworkByRigging = (level) => {
                    let nodeCount, linkDensity;
                    
                    switch(level) {
                        case 'high':
                            nodeCount = 8 + Math.floor(Math.random() * 5); // 8-12 nodes
                            linkDensity = 0.7; // 70% connection probability
                            break;
                        case 'medium':
                            nodeCount = 4 + Math.floor(Math.random() * 3); // 4-6 nodes
                            linkDensity = 0.5; // 50% connection probability
                            break;
                        case 'low':
                        default:
                            nodeCount = 2 + Math.floor(Math.random() * 2); // 2-3 nodes
                            linkDensity = 0.3; // 30% connection probability
                            break;
                    }
                    
                    const companyNames = ['Alpha Corp', 'Beta Ltd', 'Gamma Inc', 'Delta Co', 'Epsilon LLC', 
                                        'Zeta Group', 'Eta Systems', 'Theta Solutions', 'Iota Enterprises', 
                                        'Kappa Industries', 'Lambda Holdings', 'Mu Corporation'];
                    
                    const nodes = [];
                    for (let j = 0; j < nodeCount; j++) {
                        nodes.push({
                            id: companyNames[j] || `Company ${j + 1}`,
                            name: companyNames[j] || `Company ${j + 1}`,
                            year: 2020 + Math.floor(Math.random() * 5)
                        });
                    }
                    
                    const links = [];
                    for (let j = 0; j < nodes.length; j++) {
                        for (let k = j + 1; k < nodes.length; k++) {
                            if (Math.random() < linkDensity) {
                                links.push({
                                    source: nodes[j].id,
                                    target: nodes[k].id
                                });
                            }
                        }
                    }
                    
                    return { nodes, links };
                };
                
                reports.push({
                    id: i,
                    lotId: `LOT-${generateRandomString(6)}`,
                    tnved: generateRandomString(10),
                    firmId: `FIRM-${generateRandomString(4)}`,
                    date: new Date(Date.now() - Math.floor(Math.random() * 1e10)).toISOString().split('T')[0],
                    isWinner: Math.random() > 0.5,
                    isReserveWinner: Math.random() > 0.3,
                    detectedRigging: riggingType,
                    details: {
                        firmName: `MegaCorp ${generateRandomString(3)}`,
                        contactPerson: `John Doe ${i}`,
                        analysisTimestamp: new Date().toISOString(),
                        relatedLots: Array.from({length: Math.ceil(Math.random()*5)}, () => `LOT-${generateRandomString(6)}`),
                        networkData: generateNetworkByRigging(riggingType),
                        riskFactors: [
                            ...(riggingType !== 'low' ? ['Price Anomaly Detected'] : []),
                            ...(riggingType === 'high' ? ['Known Cartel Association', 'Suspicious Bidding Pattern', 'Multiple Shell Companies', 'Coordinated Bidding Times'] : []),
                            ...(riggingType === 'medium' ? ['Unusual Bidding Pattern'] : []),
                            'Standard Background Check Passed'
                        ]
                    }
                });
            }
            return reports;
    };

    export const mockApi = {
    getStats: () => Promise.resolve({
        bidsAnalyzed: { year: 123000, month: 123, day: 123 },
        bidsAnalyzedToday: { year: 123000, month: 123, day: 123 },
        avgRiggingCases: { year: 123000, month: 123, day: 123 },
    }),
    getRiggingDetectionByType: () => Promise.resolve([
        { name: 'Элемент 1', 'Столбцы (1)': 20, 'Столбцы (2)': 10, 'Столбцы (3)': 5 },
        { name: 'Элемент 2', 'Столбцы (1)': 45, 'Столбцы (2)': 25, 'Столбцы (3)': 15 },
        { name: 'Элемент 3', 'Столбцы (1)': 60, 'Столбцы (2)': 40, 'Столбцы (3)': 20 },
        { name: 'Элемент 4', 'Столбцы (1)': 80, 'Столбцы (2)': 55, 'Столбцы (3)': 30 },
        { name: 'Элемент 5', 'Столбцы (1)': 100, 'Столбцы (2)': 70, 'Столбцы (3)': 40 },
    ]),
    getRiggingCaseAreaData: () => Promise.resolve([
        { name: 'Элемент 1', "Столбцы (1)": 0 },
        { name: 'Элемент 2', "Столбцы (1)": 12 },
        { name: 'Элемент 4', "Столбцы (1)": 30 },
        { name: 'Элемент 5', "Столбцы (1)": 32 },
        { name: 'Элемент 3', "Столбцы (1)": 38 },
    ]),
    getConfidenceLevelData: () => Promise.resolve([
        { name: 'Элемент 1', value: 62.5, color: '#FFC857' },
        { name: 'Элемент 2', value: 25, color: '#F97316' },
        { name: 'Элемент 3', value: 12.5, color: '#EF4444' },
    ]),


    getAnalysisForLotId: (lotId) => new Promise((resolve) => {
            setTimeout(() => {
                if (lotId === '12345') {
                    resolve({ isAlreadyAnalyzed: true, lotId });
                    return;
                }
                if (!lotId) {
                    resolve({ error: 'Please enter a Lot ID.' });
                    return;
                }

                const createNode = (id, year) => ({ id, name: id, year });
                const baseNodes = [
                    createNode('Khaiavi', 2019), createNode('Ni', 2022), createNode('Tagliabue', 2021),
                    createNode('Zaballos', 2020), createNode('Agostinelli', 2021), createNode('Kaewunruen', 2018),
                    createNode('Li', 2022), createNode('Sacks', 2020), createNode('Tao', 2019),
                    createNode('Lu', 2020), createNode('Pan', 2021), createNode('Guerrero', 2020),
                    createNode('Perera', 2021), createNode('Antonino', 2019)
                ];
                
                const getLinksForNodes = (nodes) => {
                    const links = [];
                    for(let i = 0; i < nodes.length; i++) {
                        for(let j = i + 1; j < Math.min(i + 3, nodes.length); j++) {
                            if(Math.random() > 0.3) { // Increased probability for more connections
                                links.push({ source: nodes[i].id, target: nodes[j].id });
                            }
                        }
                    }
                    return links;
                }

                const step1Nodes = baseNodes.slice(0, 8);
                const step1Links = getLinksForNodes(step1Nodes);
                const step2Nodes = baseNodes.slice(0, 11);
                const step2Links = getLinksForNodes(step2Nodes);
                const step3Nodes = baseNodes;
                const step3Links = getLinksForNodes(step3Nodes);

                resolve({
                    lotId,
                    isAlreadyAnalyzed: false,
                    overallScore: 'high',
                    steps: [
                        { 
                            title: 'Analysis 1: Affiliation check', 
                            networkData: { nodes: step1Nodes, links: step1Links }, 
                            results: [ 
                                { title: 'Diyor Output', score: 'medium' }, 
                                { title: 'Classification', score: 'medium' } 
                            ] 
                        },
                        { 
                            title: 'Analysis 2: Cartel-network & Scoring rigging possibility', 
                            networkData: { nodes: step2Nodes, links: step2Links }, 
                            results: [ 
                                { title: 'Part A (Cartel-network)', score: 'high' }, 
                                { title: 'Part B (Scoring Manipulation)', score: 'low' } 
                            ] 
                        },
                        { 
                            title: 'Analysis 3: Advanced Vector Analysis', 
                            networkData: { nodes: step3Nodes, links: step3Links }, 
                            results: [ 
                                { title: 'Vector Similarity', score: 'high' }, 
                                { title: 'Geographic Proximity', score: 'low' }, 
                                { title: 'Temporal Correlation', score: 'medium' }, 
                                { title: 'Financial Overlap', score: 'high' } 
                            ] 
                        }
                    ]
                });
            }, 1500);
    }),

    getReports: () => Promise.resolve(generateMockReports(5000)),
    };  