import { createContext, useContext } from "react";
import { db } from "../../firebase"; 
import { collection, addDoc } from "firebase/firestore";

// Create the Audit Context
const AuditContext = createContext();

// Provide the Context
const AuditContextProvider = ({ children }) => {
    const logAudit = async (UserID, Action, TargetUserID, ActionDetails) => {
        const logEntry = {
            Timestamp: new Date().toISOString(), // Capture the current timestamp
            UserID,  // The user performing the action
            Action,  // The action being performed
            TargetUserID,  // The user being targeted by the action, if applicable
            ActionDetails,  // Details about the action
        };

        try {
            // Add the log entry to the 'audit_log' collection in Firestore
            await addDoc(collection(db, "audit_log"), logEntry);
            console.log("Audit log entry created:", logEntry); // Success message
        } catch (error) {
            console.error("Error writing audit log: ", error); // Error handling
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
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error("useAuditContext must be used within an AuditContextProvider");
    }
    return context;
};

// Export the provider and custom hook
export { AuditContextProvider, useAuditContext };
