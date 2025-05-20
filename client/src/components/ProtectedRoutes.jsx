// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user'); // replace with context or real auth later
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
