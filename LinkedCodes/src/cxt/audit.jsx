import { createContext, useContext } from "react";
import { db } from "../../firebase"; 
import { collection, addDoc } from "firebase/firestore";

// Create the context
const AuditContext = createContext();

// Provide the Context
const AuditContextProvider = ({ children }) => {
    const logAudit = async (UserID, Action, TargetUserID, ActionDetails) => {
        const logEntry = {
        Timestamp: new Date().toISOString(),
        UserID,
        Action,
        TargetUserID,
        ActionDetails,
        };

        try {
        // Add the log entry to the 'audit_log' collection
        await addDoc(collection(db, "audit_log"), logEntry);
        console.log("Audit log entry created");
        } catch (error) {
        console.error("Error writing audit log: ", error);
        }
    };

    return (
        <AuditContext.Provider value={{ logAudit }}>
        {children}
        </AuditContext.Provider>
    );
};

// Custom hook to use the AuditContext
const useAuditContext = () => {
    return useContext(AuditContext);
};

// Export the provider and custom hook
export { AuditContextProvider, useAuditContext };
