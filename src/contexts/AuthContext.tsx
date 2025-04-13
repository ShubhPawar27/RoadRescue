
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "user" | "provider" | "admin";
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, type: "user" | "provider") => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("roadrescue-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you would make an API call here
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock login logic
    if (email === "user@example.com" && password === "password") {
      const mockUser: User = {
        id: "user-123",
        name: "John User",
        email: "user@example.com",
        phone: "+1234567890",
        type: "user"
      };
      
      setUser(mockUser);
      localStorage.setItem("roadrescue-user", JSON.stringify(mockUser));
    } else if (email === "provider@example.com" && password === "password") {
      const mockProvider: User = {
        id: "provider-123",
        name: "Service Provider",
        email: "provider@example.com",
        phone: "+1987654321",
        type: "provider"
      };
      
      setUser(mockProvider);
      localStorage.setItem("roadrescue-user", JSON.stringify(mockProvider));
    } else if (email === "admin@example.com" && password === "password") {
      const mockAdmin: User = {
        id: "admin-123",
        name: "Admin User",
        email: "admin@example.com",
        phone: "+1555555555",
        type: "admin"
      };
      
      setUser(mockAdmin);
      localStorage.setItem("roadrescue-user", JSON.stringify(mockAdmin));
    } else {
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, phone: string, type: "user" | "provider") => {
    // In a real app, you would make an API call here
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `${type}-${Date.now()}`,
      name,
      email,
      phone,
      type
    };
    
    setUser(newUser);
    localStorage.setItem("roadrescue-user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("roadrescue-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.type === "admin",
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
