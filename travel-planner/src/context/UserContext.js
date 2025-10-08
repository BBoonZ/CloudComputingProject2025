import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    email: '',
    profile_uri: '',
    username: ''
  });

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);