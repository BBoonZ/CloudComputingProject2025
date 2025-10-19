import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const userService = {
  async createUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/api/users/`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserByEmail(email) {
    // Check if we have cached data and it's not expired
    const cachedUser = localStorage.getItem('userData');
    const cacheTime = localStorage.getItem('userDataCacheTime');
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    if (cachedUser && cacheTime) {
      const now = new Date().getTime();
      if (now - parseInt(cacheTime) < CACHE_DURATION) {
        return {
          status: 'success',
          data: JSON.parse(cachedUser)
        };
      }
    }

    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`);
      if (response.data.status === 'success') {
        localStorage.setItem('userData', JSON.stringify(response.data.data));
        localStorage.setItem('userDataCacheTime', new Date().getTime().toString());
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(userData) {
    try {
      const response = await axios.put(`${API_URL}/api/users/${userData.email}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
