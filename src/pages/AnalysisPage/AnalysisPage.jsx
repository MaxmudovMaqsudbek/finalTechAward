import { useEffect, useState } from "react";
import { useTheme } from "../../shared/lib/contexts/ThemeContext";
import { mockApi } from "../../shared/api/MockApi";
import { Card } from "../../shared/ui/Card";
import { AlertCircle, Info, Search } from "lucide-react";
import { ScoreIndicator } from "../../shared/ui/ScoreIndicator";
import { AnalysisStep } from "../../widgets/analysis/AnalysisStep";

export const AnalysisPage = () => {
  const [lotId, setLotId] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const handleCheckLotId = async () => {
    setIsLoading(true);
    setError("");
    setAnalysisResult(null);
    setCurrentStep(0);
    const result = await mockApi.getAnalysisForLotId(lotId);
    setIsLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setAnalysisResult(result);
      if (!result.isAlreadyAnalyzed) {
        setCurrentStep(1);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCheckLotId();
  };
  useEffect(() => {
    if (
      analysisResult &&
      !analysisResult.isAlreadyAnalyzed &&
      currentStep > 0 &&
      currentStep < analysisResult.steps.length
    ) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [analysisResult, currentStep]);
  return (
    <main className="p-6 space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="lotId"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Lot ID:
              </label>
              <div className="relative">
                <input
                  id="lotId"
                  type="text"
                  value={lotId}
                  onChange={(e) => setLotId(e.target.value)}
                  placeholder="Insert lot ID and check manually"
                  className="pl-4 pr-12 py-2 w-84 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {isLoading && (
              <div className="text-gray-500 dark:text-gray-400">
                Analyzing...
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle size={18} /> {error}
              </div>
            )}
          </div>
        </form>
      </Card>
      {analysisResult && (
        <Card>
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Overall Score:</h3>
            {analysisResult.isAlreadyAnalyzed ? (
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                <Info size={20} />
                <span>
                  Note: Given ID is already analyzed and found in database.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="capitalize font-bold text-xl">
                  {analysisResult.overallScore}
                </span>
                <ScoreIndicator score={analysisResult.overallScore} />
              </div>
            )}
          </div>
        </Card>
      )}
      {analysisResult && !analysisResult.isAlreadyAnalyzed && (
        <div>
          {analysisResult.steps.slice(0, currentStep).map((step, index) => (
            <AnalysisStep
              key={index}
              stepData={step}
              theme={theme}
              showGraph={index < 2}
            />
          ))}
        </div>
      )}
    </main>
  );
};
