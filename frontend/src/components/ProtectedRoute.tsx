import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Loading } from "./Loading";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('accessToken'); 
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(response.data.result);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [loading]);

  if (loading) return <Loading />;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode, type: string }> = ({ children, type }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/protected-admin`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        setIsAdmin(response.data.isAdmin); 
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      checkAdminAccess();
    }
  }, [loading]);

  if (loading) return <div>Загрузка...</div>; 

  if (type === "element") {
    return isAdmin ? <>{children}</> : null
  } else {
    return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
  }
};

export { ProtectedRoute, AdminRoute };
