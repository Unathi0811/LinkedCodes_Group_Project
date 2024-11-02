import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);


  const fetchPayments = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'payments')); 
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments: ", error);
    }
  };

  useEffect(() => {
    fetchPayments(); // Fetch payments when the provider mounts
  }, []);

  return (
    <PaymentContext.Provider value={{ payments, fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook to use the Payment Context
export const usePayments = () => {
  return useContext(PaymentContext);
};