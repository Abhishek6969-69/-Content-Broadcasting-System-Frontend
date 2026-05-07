"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    // Check protected routes
    const isPublicRoute = pathname.startsWith('/live') || pathname === '/login' || pathname === '/';
    
    if (!user && !isPublicRoute) {
      router.push('/login');
    } else if (user && (pathname === '/login' || pathname === '/')) {
      // Redirect logged in user away from login
      if (user.role === 'PRINCIPAL') {
        router.push('/principal/dashboard');
      } else if (user.role === 'TEACHER') {
        router.push('/teacher/dashboard');
      }
    } else if (user) {
       // Role-based protection
       if (pathname.startsWith('/principal') && user.role !== 'PRINCIPAL') {
         router.push('/teacher/dashboard');
       } else if (pathname.startsWith('/teacher') && user.role !== 'TEACHER') {
         router.push('/principal/dashboard');
       }
    }
  }, [user, loading, pathname, router]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    authService.setToken(data.token);
    setUser(data.user);
    if (data.user.role === 'PRINCIPAL') {
      router.push('/principal/dashboard');
    } else {
      router.push('/teacher/dashboard');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
