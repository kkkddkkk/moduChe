import { createContext, useContext, useEffect, useState } from 'react';
import { isLoggedIn } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

let _userContext = null;

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState(null);

  const logout = (token) => {
    if(isLoggedIn(token)) return false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('name');
    setLoggedIn(false);
    setName(null);
    alert("로그아웃 되었습니다.");
    return true;
  };

  _userContext = { loggedIn, setLoggedIn, name, setName, logout };

  return (
    <UserContext.Provider value={{ loggedIn, setLoggedIn, name, setName, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const getUserContext = () => _userContext;
