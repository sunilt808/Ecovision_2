// API Service for Eco-Vision Backend Communication
const API_BASE_URL = "http://localhost:5000/api";

export const apiService = {
  /**
   * Predict waste category from an image
   * @param {File} imageFile - Image file to classify
   * @returns {Promise<Object>} Prediction result with category and confidence
   */
  async predictWaste(imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Prediction error:", error);
      throw error;
    }
  },

  /**
   * Get prediction history
   * @returns {Promise<Array>} List of previous predictions
   */
  async getHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return await response.json();
    } catch (error) {
      console.error("History error:", error);
      throw error;
    }
  },

  /**
   * Get statistics
   * @returns {Promise<Object>} Statistics data
   */
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      return await response.json();
    } catch (error) {
      console.error("Statistics error:", error);
      throw error;
    }
  },

  /**
   * Get waste categories
   * @returns {Promise<Object>} Available waste categories
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("Categories error:", error);
      throw error;
    }
  },

  /**
   * Health check
   * @returns {Promise<Object>} Server status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error("Server is down");
      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  },

  /**
   * Get storage information
   * @returns {Promise<Object>} Storage stats
   */
  async getStorageInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/storage-info`);
      if (!response.ok) throw new Error("Failed to fetch storage info");
      return await response.json();
    } catch (error) {
      console.error("Storage info error:", error);
      throw error;
    }
  },

  /**
   * Get model load status
   * @returns {Promise<Object>} Model info
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/model-info`);
      if (!response.ok) throw new Error("Failed to fetch model info");
      return await response.json();
    } catch (error) {
      console.error("Model info error:", error);
      throw error;
    }
  },
};
