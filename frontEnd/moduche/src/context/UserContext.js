import { createContext, useContext, useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [name, setName] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) setLoggedIn(true);
    else {
      setLoggedIn(false);
      setName(null);
    }
  }, []);

  return (
    <UserContext.Provider value={{ name, setName, loggedIn, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
