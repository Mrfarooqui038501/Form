const API_BASE_URL = 'https://formbuilder-v1.onrender.com';

export const formService = {
  async createForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            body: formData  // Directly pass FormData without setting headers
        });
        if (!response.ok) {
            const errorText = await response.text(); // Read the response text only if not ok
            throw new Error(errorText || 'Failed to create form');
        }
        return await response.json(); // Read the response JSON only if ok
    } catch (error) {
        console.error('Form creation error:', error);
        throw error;
    }
},
  async getForms() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }
      return await response.json();
    } catch (error) {
      console.error('Fetching forms error:', error);
      throw error;
    }
  },
  async getFormById(formId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${formId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch form');
      }
      return await response.json();
    } catch (error) {
      console.error('Fetching form error:', error);
      throw error;
    }
  },
  async submitFormResponse(formId, responses) {
    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formId, responses })
      });
      if (!response.ok) {
        throw new Error('Failed to submit form response');
      }
      return await response.json();
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    }
  }
};
