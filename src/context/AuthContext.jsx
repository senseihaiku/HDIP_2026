import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialUsers from '../data/users.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('hdip_users');
    return stored ? JSON.parse(stored) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore logged-in user from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('hdip_currentUserId');
    if (storedUserId) {
      const found = users.find((u) => u.id === storedUserId);
      if (found) {
        setCurrentUser(found);
      } else {
        localStorage.removeItem('hdip_currentUserId');
      }
    }
    setLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist users list whenever it changes
  useEffect(() => {
    localStorage.setItem('hdip_users', JSON.stringify(users));
  }, [users]);

  const login = useCallback(
    (email, password) => {
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('hdip_currentUserId', user.id);
        return true;
      }
      return false;
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('hdip_currentUserId');
  }, []);

  const register = useCallback(
    (userData) => {
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => {
        const updated = [...prev, newUser];
        return updated;
      });
      // Automatically log the new user in
      setCurrentUser(newUser);
      localStorage.setItem('hdip_currentUserId', newUser.id);
      return newUser;
    },
    []
  );

  const isAuthenticated = currentUser !== null;

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    users,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
