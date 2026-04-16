/**
 * API Integration Service
 * Handles all communication with the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Make API request with error handling
 */
async function apiCall(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Prediction Service
 */
export const predictionAPI = {
  /**
   * Submit image for waste prediction
   * @param {File} image - Image file
   * @param {string} source - 'upload' or 'camera'
   * @returns {Promise} Prediction result
   */
  async predict(image, source = 'upload') {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('source', source);

    return apiCall('/predict', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type, let browser set it
    });
  },

  /**
   * Get prediction history
   * @param {number} limit - Number of records to fetch
   * @returns {Promise} Array of predictions
   */
  async getHistory(limit = 20) {
    return apiCall(`/history?limit=${limit}`, {
      method: 'GET',
    });
  },

  /**
   * Clear prediction history
   * @returns {Promise} Success message
   */
  async clearHistory() {
    return apiCall('/clear-history', {
      method: 'DELETE',
    });
  },
};

/**
 * Statistics Service
 */
export const statisticsAPI = {
  /**
   * Get statistics and analytics
   * @returns {Promise} Statistics data
   */
  async getStats() {
    return apiCall('/statistics', {
      method: 'GET',
    });
  },

  /**
   * Get waste categories
   * @returns {Promise} Array of categories
   */
  async getCategories() {
    return apiCall('/categories', {
      method: 'GET',
    });
  },
};

/**
 * Backup Service
 */
export const backupAPI = {
  /**
   * Get list of backed up images
   * @returns {Promise} Array of backup images
   */
  async getBackups() {
    return apiCall('/backups', {
      method: 'GET',
    });
  },

  /**
   * Download specific backup image
   * @param {number} imageId - Image ID
   * @returns {Promise} Image file info
   */
  async getBackupImage(imageId) {
    return apiCall(`/backup/${imageId}`, {
      method: 'GET',
    });
  },
};

/**
 * Health Check
 */
export const healthAPI = {
  /**
   * Check backend health status
   * @returns {Promise} Health status
   */
  async check() {
    return apiCall('/health', {
      method: 'GET',
    });
  },
};

/**
 * Combined API Object
 */
export const api = {
  prediction: predictionAPI,
  statistics: statisticsAPI,
  backup: backupAPI,
  health: healthAPI,
};

export default api;
