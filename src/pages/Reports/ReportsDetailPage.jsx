// import { AlertCircle, ChevronLeft } from "lucide-react";
// import { scoreTextColorMap } from "../../shared/ui/ScoreTextColorMap";
// import { Card } from "../../shared/ui/Card";

// import { NetworkGraph } from "../../widgets/analysis/NetworkGraph";
// import { useTheme } from "../../shared/lib/contexts/ThemeContext";

// export const ReportDetailPage = ({ report, onBack }) => {
//     const { theme } = useTheme();

//     return (
//         <div className="p-6">
//             <button onClick={onBack} className="flex items-center gap-2 mb-6 text-blue-500 hover:underline">
//                 <ChevronLeft size={20} /> Back to Reports
//             </button>
//             <Card>
//                 <h2 className="text-2xl font-bold mb-4">Report Details for Lot: {report.lotId}</h2>
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
//                     <div className="space-y-6">
//                         <div>
//                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Firm Information</h3>
//                             <div className="space-y-2 text-sm">
//                                 <p><strong>Firm ID:</strong> {report.firmId}</p>
//                                 <p><strong>Firm Name:</strong> {report.details.firmName}</p>
//                                 <p><strong>Contact:</strong> {report.details.contactPerson}</p>
//                                 <p><strong>Winner:</strong> {report.isWinner ? <span className="text-green-600 font-semibold">Yes</span> : 'No'}</p>
//                                 <p><strong>Reserve Winner:</strong> {report.isReserveWinner ? <span className="text-yellow-600 font-semibold">Yes</span> : 'No'}</p>
//                             </div>
//                         </div>

//                         <div>
//                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Analysis Summary</h3>
//                             <div className="space-y-2 text-sm">
//                                 <p><strong>TNVED:</strong> {report.tnved}</p>
//                                 <p><strong>Date:</strong> {report.date}</p>
//                                 <p><strong>Detected Rigging Level:</strong> <span className={`font-bold ${scoreTextColorMap[report.detectedRigging]}`}>{report.detectedRigging.toUpperCase()}</span></p>
//                                 <p><strong>Analysis Timestamp:</strong> {new Date(report.details.analysisTimestamp).toLocaleString()}</p>
//                             </div>
//                         </div>
                        
//                          <div className="space-y-2">
//                              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Related Lots</h3>
//                              <div className="flex flex-wrap gap-2">
//                                 {report.details.relatedLots.map((lot, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-medium">{lot}</span>)}
//                              </div>
//                         </div>
//                     </div>

//                     <div className="space-y-6">
//                          <div>
//                              <h3 className="font-semibold text-lg border-b pb-2 mb-3">Corruption Network</h3>
//                              <div className="w-full h-[400px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
//                                 <NetworkGraph data={report.details.networkData} theme={theme} />
//                              </div>
//                          </div>
//                          <div>
//                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Risk Factors Identified</h3>
//                              <ul className="space-y-2">
//                                 {report.details.riskFactors.map((factor, i) => (
//                                     <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
//                                         <AlertCircle className={`w-5 h-5 mt-0.5 ${scoreTextColorMap[report.detectedRigging] || 'text-gray-500'}`} />
//                                         <span>{factor}</span>
//                                     </li>
//                                 ))}
//                              </ul>
//                         </div>
//                     </div>
//                 </div>
//             </Card>
//         </div>
//     );
// };




























import { AlertCircle, ChevronLeft } from "lucide-react";
import { scoreTextColorMap } from "../../shared/ui/ScoreTextColorMap";
import { Card } from "../../shared/ui/Card";
import { NetworkGraph } from "../../widgets/analysis/NetworkGraph";
import { useTheme } from "../../shared/lib/contexts/ThemeContext";

export const ReportDetailPage = ({ report, onBack }) => {
    const { theme } = useTheme();

    // Generate two different network configurations based on the report's rigging level
    const generateStepNetworks = () => {
        const { nodes, links } = report.details.networkData;
        
        // Step 1: Show partial network (first 60% of nodes)
        const step1NodeCount = Math.ceil(nodes.length * 0.6);
        const step1Nodes = nodes.slice(0, step1NodeCount);
        const step1NodeIds = new Set(step1Nodes.map(n => n.id));
        const step1Links = links.filter(l => 
            step1NodeIds.has(l.source) && step1NodeIds.has(l.target)
        );
        
        // Step 2: Show full network
        const step2Nodes = nodes;
        const step2Links = links;
        
        return {
            step1: { nodes: step1Nodes, links: step1Links },
            step2: { nodes: step2Nodes, links: step2Links }
        };
    };

    const { step1, step2 } = generateStepNetworks();

    return (
        <div className="p-6">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-blue-500 hover:underline">
                <ChevronLeft size={20} /> Back to Reports
            </button>
            <Card>
                <h2 className="text-2xl font-bold mb-4">Report Details for Lot: {report.lotId}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg border-b pb-2 mb-3">Firm Information</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>Firm ID:</strong> {report.firmId}</p>
                                <p><strong>Firm Name:</strong> {report.details.firmName}</p>
                                <p><strong>Contact:</strong> {report.details.contactPerson}</p>
                                <p><strong>Winner:</strong> {report.isWinner ? <span className="text-green-600 font-semibold">Yes</span> : 'No'}</p>
                                <p><strong>Reserve Winner:</strong> {report.isReserveWinner ? <span className="text-yellow-600 font-semibold">Yes</span> : 'No'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg border-b pb-2 mb-3">Analysis Summary</h3>
                            <div className="space-y-2 text-sm">
                                <p><strong>TNVED:</strong> {report.tnved}</p>
                                <p><strong>Date:</strong> {report.date}</p>
                                <p><strong>Detected Rigging Level:</strong> <span className={`font-bold ${scoreTextColorMap[report.detectedRigging]}`}>{report.detectedRigging.toUpperCase()}</span></p>
                                <p><strong>Analysis Timestamp:</strong> {new Date(report.details.analysisTimestamp).toLocaleString()}</p>
                            </div>
                        </div>
                        
                         <div className="space-y-2">
                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Related Lots</h3>
                             <div className="flex flex-wrap gap-2">
                                {report.details.relatedLots.map((lot, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-medium">{lot}</span>)}
                             </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                         <div>
                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Step 1: Affiliation Network</h3>
                             <div className="w-full h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                                <NetworkGraph data={step1} theme={theme} />
                             </div>
                         </div>
                         
                         <div>
                             <h3 className="font-semibold text-lg border-b pb-2 mb-3">Step 2: Cartel-network & Scoring rigging possibility</h3>
                             <div className="w-full h-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                                <NetworkGraph data={step2} theme={theme} />
                             </div>
                         </div>
                         
                         <div>
                            <h3 className="font-semibold text-lg border-b pb-2 mb-3">Risk Factors Identified</h3>
                             <ul className="space-y-2">
                                {report.details.riskFactors.map((factor, i) => (
                                    <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <AlertCircle className={`w-5 h-5 mt-0.5 ${scoreTextColorMap[report.detectedRigging] || 'text-gray-500'}`} />
                                        <span>{factor}</span>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};