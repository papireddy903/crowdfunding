import React, { createContext, useContext, useState } from 'react';

const AmountContext = createContext();

export const useAmount = () => useContext(AmountContext);

export const AmountProvider = ({ children }) => {
  const [amount, setAmount] = useState("0");

  return (
    <AmountContext.Provider value={{ amount, setAmount }}>
      {children}
    </AmountContext.Provider>
  );
};
