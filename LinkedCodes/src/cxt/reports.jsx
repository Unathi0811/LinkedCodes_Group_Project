import React, { createContext, useContext, useState } from "react";

// Create a report context
const ReportContext = createContext(null);  // Initialize with null to check if context is provided

// Create a Report Provider component
export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  // Function to add a new report
  const addReport = (newReport) => {
    setReports((prevReports) => [...prevReports, newReport]);
  };

  return (
    <ReportContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportContext.Provider>
  );
};

// Create a report hook with error handling
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};
