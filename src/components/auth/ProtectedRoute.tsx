import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute: React.FC = () => {
  const {
    isAuthenticated
  } = useAuth();
  
  // Authentication check temporarily disabled
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <Outlet />;
};
export default ProtectedRoute;