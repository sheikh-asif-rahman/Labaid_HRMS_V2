import React, { createContext, useContext, useState, type ReactNode } from "react";
import { loginUser as loginApi } from "../services/authService";

interface User {
  EmployeeId: string;
  Permission: string;
  Status: string;
}

interface AuthContextType {
  user: User | null;
  loginUser: (employeeId: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = async (employeeId: string, password: string) => {
    try {
      const data = await loginApi(employeeId, password);

      if (data.Status === "active") {
        const newUser = {
          EmployeeId: data.EmployeeId,
          Permission: data.Permission,
          Status: data.Status,
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("isLoggedIn", "true");
      }

      return data.message; // API message
    } catch (error: any) {
      return error.response?.data?.message || "Login failed. Please check your credentials.";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
