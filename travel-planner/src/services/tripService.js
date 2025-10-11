import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const tripService = {
  async createTrip(tripData) {
    try {
      const response = await axios.post(`${API_URL}/api/trips`, tripData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPublicTrips() {
    try {
      const response = await axios.get(`${API_URL}/api/trips/public`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getTripById(tripId) {
    try {
      const response = await axios.get(`${API_URL}/api/trips/${tripId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateTrip(tripId, tripData) {
    try {
      const response = await axios.put(`${API_URL}/api/trips/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteTrip(tripId) {
    try {
      const response = await axios.delete(`${API_URL}/api/trips/${tripId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserTrips(userId) {
    try {
      const response = await axios.get(`${API_URL}/api/trips/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addMember(tripId, memberData) {
    try {
      const response = await axios.post(`${API_URL}/api/trips/${tripId}/members`, memberData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateShare(tripId, shareData) {
    try {
      const response = await axios.put(`${API_URL}/api/trips/${tripId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async searchTrips(query) {
    try {
      if (!query || query.trim() === '') {
        return { status: 'success', data: [] };
      }
      
      const response = await axios.get(`${API_URL}/api/trips/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw {
        status: 'error',
        message: 'Failed to search trips',
        error: error.message
      };
    }
  }
};