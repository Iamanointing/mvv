import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login = ({ admin = false }) => {
  const [credentials, setCredentials] = useState({ 
    reg_number: '', 
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(
      admin 
        ? { username: credentials.username, password: credentials.password }
        : { reg_number: credentials.reg_number, password: credentials.password },
      admin
    );

    setLoading(false);

    if (result.success) {
      navigate(admin ? '/admin/dashboard' : '/user/home');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: '#D3D9D4' }}>
      <div className="bg-white rounded-lg shadow-lg border p-6 sm:p-8 w-full max-w-md" style={{ borderColor: 'rgba(116, 141, 146, 0.3)' }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#124E66' }}>
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#212A31' }}>MyVesaVote</h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: '#2E3944' }}>
            {admin ? 'Admin Login' : 'Student Login'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {admin ? (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#212A31' }}>
                Username
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="input-classic"
                placeholder="Enter username"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#212A31' }}>
                Registration Number
              </label>
              <input
                type="text"
                required
                value={credentials.reg_number}
                onChange={(e) => setCredentials({ ...credentials, reg_number: e.target.value })}
                className="input-classic"
                placeholder="Enter registration number"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#212A31' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="input-classic"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm sm:text-base"
            style={{ backgroundColor: '#124E66' }}
            onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#212A31')}
            onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = '#124E66')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {!admin && (
          <p className="mt-6 text-center text-sm" style={{ color: '#2E3944' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#124E66' }}
              onMouseEnter={(e) => e.target.style.color = '#212A31'}
              onMouseLeave={(e) => e.target.style.color = '#124E66'}>
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;

