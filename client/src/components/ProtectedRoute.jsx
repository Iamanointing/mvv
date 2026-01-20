import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  // Check role match
  const userRole = user.username ? 'admin' : 'user';
  if (userRole !== role) {
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/user/home'} replace />;
  }

  return children;
};

export default ProtectedRoute;

