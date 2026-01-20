import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LayoutDashboard, Vote, LogOut, User, Menu, X } from 'lucide-react';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/user/home', icon: Home, label: 'Home' },
    { path: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/user/voting-arena', icon: Vote, label: 'Voting Arena' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#D3D9D4' }}>
      <nav className="shadow-md" style={{ backgroundColor: '#124E66' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/user/home" className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white">MyVesaVote</h1>
              </Link>
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                      style={isActive ? { backgroundColor: '#748D92' } : {}}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-white/90">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm font-medium truncate max-w-[120px]">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'text-white'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                    style={isActive ? { backgroundColor: '#748D92' } : {}}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex items-center px-3 py-2 text-white/90 border-t mt-2 pt-2" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                <User className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{user?.full_name}</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
