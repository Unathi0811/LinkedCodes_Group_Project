// services/auditService.js
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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
		return true; // Return success indicator
	} catch (error) {
		// console.error("Error writing audit log: ", error);
		return false; // Return failure indicator
	}
};

export default logAudit; // Export the function for use in other components
