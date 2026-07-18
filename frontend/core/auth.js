// core/auth.js
// Supabase ????

const SUPABASE_URL = 'https://sthrubrefavbomjlobew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHJ1YnJlZmF2Ym9tamxvYmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMzM4MzksImV4cCI6MjA5OTcwOTgzOX0.LtBBe_QWq_5WXwVw7ELIQJuy9M7fzHd-R6VTMVkXqyg';

// ??
export async function login(email, password) {
    const url = SUPABASE_URL + '/auth/v1/token?grant_type=password';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '????');
    }
    const data = await response.json();
    localStorage.setItem('sb-user', JSON.stringify(data));
    return data;
}

// ??????
export function getCurrentUser() {
    const user = localStorage.getItem('sb-user');
    if (user) {
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// ????
export function logout() {
    localStorage.removeItem('sb-user');
    window.location.href = '/login.html';
}

// ??????
export function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}
