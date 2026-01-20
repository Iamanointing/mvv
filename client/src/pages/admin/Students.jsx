import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Upload } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [formData, setFormData] = useState({
    reg_number: '',
    full_name: '',
    level: '',
    department: '',
    email: ''
  });
  const [bulkData, setBulkData] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/students', formData);
      setShowModal(false);
      setFormData({ reg_number: '', full_name: '', level: '', department: '', email: '' });
      fetchStudents();
      alert('Student added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add student');
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse CSV-like data
      const lines = bulkData.split('\n').filter(line => line.trim());
      const studentList = lines.map(line => {
        const [reg_number, full_name, level, department, email] = line.split(',').map(s => s.trim());
        return { reg_number, full_name, level, department, email: email || null };
      });

      await axios.post('/api/admin/students/bulk', { students: studentList });
      setShowBulkModal(false);
      setBulkData('');
      fetchStudents();
      alert('Students uploaded successfully!');
    } catch (error) {
      alert('Failed to upload students');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Students Database</h1>
          <p className="mt-2 text-secondary text-sm sm:text-base">Manage student records</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowBulkModal(true)}
            className="btn-primary flex items-center justify-center text-sm sm:text-base"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white border border-secondary/20 rounded-lg shadow-sm overflow-x-auto">
        <table className="table-classic">
          <thead>
            <tr>
              <th>Reg Number</th>
              <th>Full Name</th>
              <th className="hidden sm:table-cell">Level</th>
              <th className="hidden md:table-cell">Department</th>
              <th className="hidden lg:table-cell">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary/20">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-secondary/5 transition-colors">
                <td className="font-semibold text-primary">{student.reg_number}</td>
                <td className="text-secondary">{student.full_name}</td>
                <td className="hidden sm:table-cell text-secondary">{student.level}</td>
                <td className="hidden md:table-cell text-secondary">{student.department}</td>
                <td className="hidden lg:table-cell text-secondary">{student.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto border border-secondary/20 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Add Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reg_number}
                  onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
                  className="input-classic"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-classic"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Level *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="input-classic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-classic"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-classic"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Add Student
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

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-secondary/20 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">Bulk Upload Students</h2>
            <p className="text-sm text-secondary mb-4">
              Enter students data in CSV format: reg_number, full_name, level, department, email
            </p>
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows={10}
                className="input-classic font-mono"
                placeholder="REG001, John Doe, 100, Computer Science, john@example.com&#10;REG002, Jane Smith, 200, Mathematics, jane@example.com"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
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

export default AdminStudents;

