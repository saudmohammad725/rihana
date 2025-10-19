const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'حدث خطأ');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (userId) => {
    return apiCall(`/auth/profile/${userId}`);
  },

  updateProfile: async (userId, updates) => {
    return apiCall(`/auth/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData, token) => {
    return apiCall('/bookings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  },

  getUserBookings: async (userId, token) => {
    return apiCall(`/bookings/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Analytics API
export const analyticsAPI = {
  trackVisitor: async (visitData) => {
    return apiCall('/analytics/visitor', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },
};

export default {
  authAPI,
  bookingsAPI,
  analyticsAPI,
};

