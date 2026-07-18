// services/api-client.js
// API ???

const SUPABASE_URL = 'https://sthrubrefavbomjlobew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHJ1YnJlZmF2Ym9tamxvYmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMzM4MzksImV4cCI6MjA5OTcwOTgzOX0.LtBBe_QWq_5WXwVw7ELIQJuy9M7fzHd-R6VTMVkXqyg';

export class ApiClient {
    constructor() {
        this.baseURL = SUPABASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
        };
    }

    async request(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        const response = await fetch(url, {
            ...options,
            headers: { ...this.headers, ...options.headers }
        });
        if (!response.ok) {
            throw new Error('API Error: ' + response.status);
        }
        return response.json();
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();
