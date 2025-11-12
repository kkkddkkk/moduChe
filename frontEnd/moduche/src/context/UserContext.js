import { createContext, useContext, useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

let _userContext = null;

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);

  _userContext = { loggedIn, setLoggedIn, name, setName };

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, name, setName }}>
      {children}
    </UserContext.Provider>
  );
};

export const getUserContext = () => _userContext;