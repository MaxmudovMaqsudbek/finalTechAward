import { Card } from "../../shared/ui/Card";
import { ScoreIndicator } from "../../shared/ui/ScoreIndicator";
import { NetworkGraph } from "./NetworkGraph";



export const AnalysisStep = ({ stepData, theme, showGraph = true }) => (
  <Card className="mt-6">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
      {stepData.title}
    </h3>
    <div className="flex flex-col md:flex-row gap-6">
      {showGraph && (
        <div className="w-full md:w-1/2 min-h-[450px] flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
          <NetworkGraph data={stepData.networkData} theme={theme} />
        </div>
      )}
      <div
        className={
          showGraph
            ? "w-full md:w-1/2 space-y-4"
            : "w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        }
      >
        {stepData.results.map((result, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {result.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="capitalize text-sm font-semibold text-gray-600 dark:text-gray-300">
                {result.score}
              </span>
              <ScoreIndicator score={result.score} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);
