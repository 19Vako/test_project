
import React, { createContext, useState } from 'react';


const ValueContext = createContext();
const ValueProvider = ({ children }) => {

  const [items, setItems] = useState([
    { id: '1', width: 1, height: 2 },
    { id: '2', width: 2, height: 1 },
    { id: '3', width: 1, height: 1 },
    { id: '4', width: 1, height: 1 },
    ]);
  

  const contextValue = {items, setItems};
  return (
    <ValueContext.Provider value={contextValue}>
      {children}
    </ValueContext.Provider>
  );
};

export { ValueProvider, ValueContext };
