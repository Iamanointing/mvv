import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

const AdminContestants = () => {
  const [contestants, setContestants] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    position_id: '',
    name: '',
    reg_number: '',
    level: '',
    department: '',
    bio: ''
  });
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    fetchContestants();
    fetchPositions();
  }, []);

  const fetchContestants = async () => {
    try {
      const response = await axios.get('/api/admin/contestants');
      setContestants(response.data);
    } catch (error) {
      console.error('Failed to fetch contestants:', error);
    }
  };

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
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      await axios.post('/api/admin/contestants', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowModal(false);
      setFormData({ position_id: '', name: '', reg_number: '', level: '', department: '', bio: '' });
      setPhotoFile(null);
      fetchContestants();
      alert('Contestant added successfully!');
    } catch (error) {
      alert('Failed to add contestant');
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(`/api/admin/contestants/${id}/verify`);
      fetchContestants();
    } catch (error) {
      alert('Failed to verify contestant');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-2">Contestants</h1>
          <p className="mt-2 text-body">Manage election contestants</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contestant
        </button>
      </div>

      <div className="bg-white border border-secondary/20 rounded-lg shadow-sm overflow-x-auto">
        <table className="table-classic">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th className="hidden sm:table-cell">Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary/20">
            {contestants.map((contestant) => (
              <tr key={contestant.id} className="hover:bg-secondary/5 transition-colors">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {contestant.photo ? (
                    <img
                      src={`http://localhost:5000${contestant.photo}`}
                      alt={contestant.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/20"></div>
                  )}
                </td>
                <td className="font-semibold text-primary">{contestant.name}</td>
                <td className="hidden sm:table-cell text-secondary">{contestant.position_name}</td>
                <td>
                  {contestant.verified ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>
                <td>
                  {!contestant.verified && (
                    <button
                      onClick={() => handleVerify(contestant.id)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Contestant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-secondary/20 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Add Contestant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Position *
                </label>
                <select
                  required
                  value={formData.position_id}
                  onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                  className="input-classic"
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-classic"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Reg Number
                  </label>
                  <input
                    type="text"
                    value={formData.reg_number}
                    onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
                    className="input-classic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Level
                  </label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="input-classic"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-classic"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="input-classic"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  className="input-classic file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Contestant
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

export default AdminContestants;

