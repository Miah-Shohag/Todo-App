import React, { createContext, useEffect, useState, useCallback } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
      else setUser(null);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isOpenMenu,
        setIsOpenMenu,
        user,
        setUser,
        loading,
        logout,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
