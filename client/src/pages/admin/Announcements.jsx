import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/announcements', formData);
      setShowModal(false);
      setFormData({ title: '', content: '' });
      fetchAnnouncements();
      alert('Announcement created successfully!');
    } catch (error) {
      alert('Failed to create announcement');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-2">Announcements</h1>
          <p className="mt-2 text-body">Post announcements for students</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="heading-3 mb-2">{announcement.title}</h3>
                <p className="text-body mb-3">{announcement.content}</p>
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-secondary/70 gap-2">
                  <span>Posted by {announcement.admin_username}</span>
                  <span>•</span>
                  <span>{new Date(announcement.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="heading-3 mb-4">Create Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-classic"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="form-label">
                  Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="input-classic"
                  placeholder="Announcement content..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Post Announcement
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline flex-1"
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

export default AdminAnnouncements;

