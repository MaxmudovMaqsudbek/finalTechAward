/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from "react";
import { mockApi } from "../../api/MockApi";

export const AppStateContext = createContext();



export const AppStateProvider = ({ children }) => {
  const [allReports, setAllReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockApi.getReports().then((data) => {
      setAllReports(data);
      setIsLoading(false);
    });
  }, []);

  const updateReportStatus = (reportId, newStatus) => {
    setAllReports((prevReports) =>
      prevReports.map((r) =>
        r.id === reportId ? { ...r, detectedRigging: newStatus } : r
      )
    );
  };

  const value = useMemo(
    () => ({
      allReports,
      isLoading,
      updateReportStatus,
    }),
    [allReports, isLoading]
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
