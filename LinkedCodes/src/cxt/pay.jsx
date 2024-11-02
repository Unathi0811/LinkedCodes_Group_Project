// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { db } from '../../firebase'; // Ensure you have your Firestore instance
// import { doc } from 'firebase/firestore';

// const PaymentContext = createContext();

// export const PaymentProvider = ({ children }) => {
//   const [payments, setPayments] = useState([]);

//   // Function to fetch payments from Firestore
//   const fetchPayments = async () => {
//     try {
//       const snapshot = await db.collection('payments').get();
//       const paymentsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setPayments(paymentsData);
//     } catch (error) {
//       console.error("Error fetching payments: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchPayments(); // Fetch payments when the provider mounts
//   }, []);

//   return (
//     <PaymentContext.Provider value={{ payments, fetchPayments }}>
//       {children}
//     </PaymentContext.Provider>
//   );
// };

// // Custom hook to use the Payment Context
// export const usePayments = () => {
//   return useContext(PaymentContext);
// };