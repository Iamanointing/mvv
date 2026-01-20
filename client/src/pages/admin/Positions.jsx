import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const AdminPositions = () => {
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/admin/positions');
      setPositions(response.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/positions', formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchPositions();
      alert('Position created successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to create position');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Positions</h1>
          <p className="mt-2 text-secondary text-sm sm:text-base">Manage election positions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {positions.map((position) => (
          <div key={position.id} className="card">
            <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">{position.name}</h3>
            {position.description && (
              <p className="text-secondary mb-4 text-sm sm:text-base">{position.description}</p>
            )}
            <p className="text-xs sm:text-sm text-secondary/70">
              Created: {new Date(position.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Add Position Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full border border-secondary/20 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Add Position</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Position Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-classic"
                  placeholder="e.g., President, Secretary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="input-classic"
                  placeholder="Position description..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Position
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPositions;

