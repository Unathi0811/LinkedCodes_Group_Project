import { createContext, useContext, useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

// Create the Audit Context
const AuditContext = createContext();

// Provide the Context
const AuditContextProvider = ({ children }) => {
	const [error, setError] = useState(null);

	const logAudit = async (
		userEmail,
		errorMessage,
		userID,
		actionType,
		targetId,
		ipAddress,
		changesMade,
		status
	) => {
		const logEntry = {
			timestamp: new Date().toISOString(),
			userID,
			actionType,
			changesMade,
			ipAddress,
			status,
			targetId,
			errorMessage,
			userEmail,
		};

		try {
			// Add the log entry to the 'audit_log' collection in Firestore
			await addDoc(collection(db, "audit_log"), logEntry);
			// console.log("Audit log entry created:", logEntry);
			setError(null); // Clear error if successful
			return true; // Return success indicator
		} catch (error) {
			// console.error("Error writing audit log: ", error);
			setError(error); // Capture error
			return false; // Return failure indicator
		}
	};

	return (
		<AuditContext.Provider value={{ logAudit, error }}>
			{children}
		</AuditContext.Provider>
	);
};

// Custom hook to use the AuditContext
const useAuditContext = () => {
	const context = useContext(AuditContext);
	if (!context) {
		throw new Error(
			"useAuditContext must be used within an AuditContextProvider"
		);
	}
	return context;
};

// Export the provider and custom hook
export { AuditContextProvider, useAuditContext };
