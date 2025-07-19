import { useEffect, useMemo, useState } from "react";
import { mockApi } from "../../shared/api/MockApi";
import { scoreTextColorMap } from "../../shared/ui/ScoreTextColorMap";
import { ReportDetailPage } from "./ReportsDetailPage";
import { FilterInput } from "./FilterInput";
import { CheckCircle, CheckSquare, XCircle } from "lucide-react";
import { DateInput } from "./DateInput";
import { Pagination } from "../../widgets/reports/Pagination";
import { Card } from "../../shared/ui/Card";
import { ScoreIndicator } from "../../shared/ui/ScoreIndicator";

export const ReportsPage = () => {
  const [allReports, setAllReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50; // Increased for better performance view
  const [filters, setFilters] = useState({
    tnved: "",
    lotId: "",
    firmId: "",
    dateFrom: "",
    dateTo: "",
    riggingType: [],
  });

  useEffect(() => {
    setIsLoading(true);
    mockApi.getReports().then((data) => {
      setAllReports(data);
      setIsLoading(false);
    });
  }, []);

  const riggingCounts = useMemo(() => {
    return allReports.reduce(
      (acc, report) => {
        acc[report.detectedRigging] = (acc[report.detectedRigging] || 0) + 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
  }, [allReports]);

  const filteredReports = useMemo(() => {
    return allReports.filter(
      (report) =>
        (filters.tnved === "" ||
          report.tnved.toLowerCase().includes(filters.tnved.toLowerCase())) &&
        (filters.lotId === "" ||
          report.lotId.toLowerCase().includes(filters.lotId.toLowerCase())) &&
        (filters.firmId === "" ||
          report.firmId.toLowerCase().includes(filters.firmId.toLowerCase())) &&
        (filters.dateFrom === "" ||
          new Date(report.date) >= new Date(filters.dateFrom)) &&
        (filters.dateTo === "" ||
          new Date(report.date) <= new Date(filters.dateTo)) &&
        (filters.riggingType.length === 0 ||
          filters.riggingType.includes(report.detectedRigging))
    );
  }, [filters, allReports]);

  // ** BUG FIX: This effect correctly handles resetting the page when filters change **
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const handleRiggingTypeToggle = (type) =>
    setFilters((prev) => {
      const newRiggingType = prev.riggingType.includes(type)
        ? prev.riggingType.filter((t) => t !== type)
        : [...prev.riggingType, type];
      return { ...prev, riggingType: newRiggingType };
    });

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return filteredReports.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredReports]);

  if (selectedReport)
    return (
      <ReportDetailPage
        report={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );

  return (
    <main className="p-6 flex flex-col h-full overflow-hidden">
      <Card className="mb-6 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <FilterInput
            label="TNVED"
            value={filters.tnved}
            onChange={(v) => handleFilterChange("tnved", v)}
            placeholder="Filter by code TN VED"
          />
          <FilterInput
            label="Lot ID"
            value={filters.lotId}
            onChange={(v) => handleFilterChange("lotId", v)}
            placeholder="Insert lot ID"
          />
          <FilterInput
            label="Firm ID"
            value={filters.firmId}
            onChange={(v) => handleFilterChange("firmId", v)}
            placeholder="Insert firm ID"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rigging type:
            </label>
            <div className="flex items-center gap-2">
              {["low", "medium", "high"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleRiggingTypeToggle(type)}
                  className={`flex items-center justify-center gap-1 p-1.5 rounded-lg border-2 transition-all ${
                    filters.riggingType.includes(type)
                      ? "bg-opacity-100"
                      : "bg-opacity-20"
                  } ${
                    type === "low"
                      ? "border-green-500 bg-green-500/20"
                      : type === "medium"
                      ? "border-yellow-500 bg-yellow-500/20"
                      : "border-red-500 bg-red-500/20"
                  }`}
                >
                  <CheckSquare
                    size={20}
                    className={
                      filters.riggingType.includes(type)
                        ? "text-white"
                        : scoreTextColorMap[type]
                    }
                  />
                  <span
                    className={`font-bold ${
                      filters.riggingType.includes(type)
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {riggingCounts[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <DateInput
            label="From"
            value={filters.dateFrom}
            onChange={(v) => handleFilterChange("dateFrom", v)}
          />
          <DateInput
            label="To"
            value={filters.dateTo}
            onChange={(v) => handleFilterChange("dateTo", v)}
          />
        </div>
      </Card>

      <div 
      className="
      flex-grow bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-teal-100 dark:bg-gray-700/50 font-semibold text-sm text-gray-600 dark:text-gray-300 shrink-0">
          <div className="p-3 w-1/6">Lot ID</div>
          <div className="p-3 w-1/6">TN VED</div>
          <div className="p-3 w-1/6">Firm ID</div>
          <div className="p-3 w-1/6">Date</div>
          <div className="p-3 w-1/12 text-center">Winner</div>
          <div className="p-3 w-1/12 text-center">Reserve</div>
          <div className="p-3 w-1/6 text-center">Detected Rigging</div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">

              </div>
            </div>
          ) : currentTableData.length > 0 ? (
            currentTableData.map((report) => (
              <div
                key={report.id}
                className="flex items-center  border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 text-sm"
              >
                <div className="p-3 w-1/6 truncate">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedReport(report);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {report.lotId}
                  </a>
                </div>
                <div className="p-3 w-1/6 truncate">{report.tnved}</div>
                <div className="p-3 w-1/6 truncate">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedReport(report);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {report.firmId}
                  </a>
                </div>
                <div className="p-3 w-1/6 truncate">{report.date}</div>
                <div className="p-3 w-1/12 text-center">
                  {report.isWinner ? (
                    <CheckCircle size={18} className="text-green-500 mx-auto" />
                  ) : (
                    <XCircle size={18} className="text-gray-400 mx-auto" />
                  )}
                </div>
                <div className="p-3 w-1/12 text-center">
                  {report.isReserveWinner ? (
                    <CheckCircle
                      size={18}
                      className="text-yellow-500 mx-auto"
                    />
                  ) : (
                    <XCircle size={18} className="text-gray-400 mx-auto" />
                  )}
                </div>
                <div className="p-3 w-1/6 flex justify-center">
                  <ScoreIndicator score={report.detectedRigging} />
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No reports match the current filters.
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
};
