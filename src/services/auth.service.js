import { getDb, delay } from '../utils/mockDb';

export const authService = {
  login: async (email, password) => {
    await delay(800); // simulate network delay
    const db = getDb();
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Create a mock token
    const token = btoa(JSON.stringify({ id: user.id, role: user.role, name: user.name }));
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
  
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token));
    } catch (e) {
      return null;
    }
  },

  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }
};
