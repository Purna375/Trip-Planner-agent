/**
 * API Communication Module
 * Handles all HTTP requests to the backend
 */

const API_BASE_URL = 'http://localhost:8000';

class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, mergedOptions);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET',
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    /**
     * Health check
     */
    async checkHealth() {
        return this.get('/api/health');
    }

    /**
     * Plan a trip
     */
    async planTrip(tripData) {
        return this.post('/api/plan-trip', tripData);
    }

    /**
     * Get sample request
     */
    async getSampleRequest() {
        return this.get('/api/sample-request');
    }

    /**
     * Get sample response
     */
    async getSampleResponse() {
        return this.get('/api/sample-response');
    }
}

// Create global API client instance
const apiClient = new APIClient();
