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
    try {
      const response = await axios.get(`${API_URL}/api/users/${email}`);
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