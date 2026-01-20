import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    reg_number: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    level: '',
    department: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    setLoading(false);

    if (result.success) {
      navigate('/login');
      alert('Registration successful! Please login.');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: '#D3D9D4' }}>
      <div className="bg-white rounded-lg shadow-lg border p-6 sm:p-8 w-full max-w-md" style={{ borderColor: 'rgba(116, 141, 146, 0.3)' }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#124E66' }}>
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#212A31' }}>Register</h1>
          <p className="mt-2 text-sm sm:text-base" style={{ color: '#2E3944' }}>Create your MyVesaVote account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              Registration Number *
            </label>
            <input
              type="text"
              required
              value={formData.reg_number}
              onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
              className="input-classic"
              placeholder="Enter your registration number"
            />
          </div>

          <div>
            <label className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="input-classic"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">
                Level *
              </label>
              <input
                type="text"
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="input-classic"
                placeholder="e.g., 100, 200"
              />
            </div>

            <div>
              <label className="form-label">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-classic"
                placeholder="Department"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-classic"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="form-label">
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-classic"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="input-classic"
              placeholder="Confirm your password"
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#2E3944' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#124E66' }}
            onMouseEnter={(e) => e.target.style.color = '#212A31'}
            onMouseLeave={(e) => e.target.style.color = '#124E66'}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

