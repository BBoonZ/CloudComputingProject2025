import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const cachedData = localStorage.getItem('userData');
    return cachedData ? JSON.parse(cachedData) : {
      user_id: '',
      email: '',
      username: '',
      name: '',
      surname: '',
      phone_number: '',
      profile_uri: ''
    };
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          setLoading(false);
          return;
        }

        const response = await userService.getUserByEmail(email);
        if (response.status === 'success') {
          const newUserData = response.data;
          setUserData(newUserData);
          localStorage.setItem('userData', JSON.stringify(newUserData));
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('User data initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, []);

  const updateUserData = async (newData) => {
    try {
      const response = await userService.updateUser(newData);
      if (response.status === 'success') {
        setUserData(newData);
        localStorage.setItem('userData', JSON.stringify(newData));
      }
      return response;
    } catch (err) {
      setError('Failed to update user data');
      throw err;
    }
  };

  const clearUserData = () => {
    setUserData({
      user_id: '',
      email: '',
      username: '',
      name: '',
      surname: '',
      phone_number: '',
      profile_uri: ''
    });
    localStorage.removeItem('userData');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      clearUserData,
      loading,
      error 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};