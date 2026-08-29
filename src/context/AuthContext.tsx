import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

interface AdminAccount extends User {
  passwordHash: string; // Storing plain passwords for simulation purposes
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_ADMINS_KEY = 'the_editorial_registered_admins';

const DEFAULT_ADMINS: AdminAccount[] = [
  {
    name: 'Elena Rostova',
    email: 'admin@theeditorial.com',
    passwordHash: 'admin123',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize registered admins in localStorage
  const getRegisteredAdmins = (): AdminAccount[] => {
    const data = localStorage.getItem(LOCAL_STORAGE_ADMINS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_ADMINS_KEY, JSON.stringify(DEFAULT_ADMINS));
      return DEFAULT_ADMINS;
    }
    return JSON.parse(data);
  };

  useEffect(() => {
    getRegisteredAdmins(); // run initializer
    const savedUser = localStorage.getItem('the_editorial_admin_user');
    const token = localStorage.getItem('the_editorial_admin_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const admins = getRegisteredAdmins();
    const matchedAdmin = admins.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.passwordHash === password
    );

    if (matchedAdmin) {
      const adminUser = { name: matchedAdmin.name, email: matchedAdmin.email };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('the_editorial_admin_user', JSON.stringify(adminUser));
      localStorage.setItem('the_editorial_admin_token', 'mock-session-token');
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const admins = getRegisteredAdmins();
    
    // Check if email already exists
    const emailExists = admins.some(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Register new admin account
    const newAdmin: AdminAccount = {
      name,
      email,
      passwordHash: password,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem(LOCAL_STORAGE_ADMINS_KEY, JSON.stringify(admins));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('the_editorial_admin_user');
    localStorage.removeItem('the_editorial_admin_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
