import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Public routes
import Login from './pages/Login';
import Register from './pages/Register';

// User routes
import UserLayout from './layouts/UserLayout';
import UserHome from './pages/user/Home';
import UserDashboard from './pages/user/Dashboard';
import VotingArena from './pages/user/VotingArena';

// Admin routes
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminPositions from './pages/admin/Positions';
import AdminContestants from './pages/admin/Contestants';
import AdminVotes from './pages/admin/Votes';
import AdminResults from './pages/admin/Results';
import AdminAnnouncements from './pages/admin/Announcements';

// Protected route wrapper
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<Login admin />} />

            {/* User routes */}
            <Route path="/user" element={
              <ProtectedRoute role="user">
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<UserHome />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="voting-arena" element={<VotingArena />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="positions" element={<AdminPositions />} />
              <Route path="contestants" element={<AdminContestants />} />
              <Route path="votes" element={<AdminVotes />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

