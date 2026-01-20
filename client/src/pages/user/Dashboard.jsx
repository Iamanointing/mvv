import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, GraduationCap, Building, Camera, AlertTriangle } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reportForm, setReportForm] = useState({ subject: '', message: '' });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const response = await axios.post('/api/user/profile/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile({ ...profile, profile_picture: response.data.profile_picture });
      alert('Profile picture updated successfully!');
    } catch (error) {
      alert('Failed to update profile picture');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/report', reportForm);
      setReportSubmitted(true);
      setReportForm({ subject: '', message: '' });
      setTimeout(() => setReportSubmitted(false), 3000);
    } catch (error) {
      alert('Failed to submit report');
    }
  };

  if (!profile) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">My Dashboard</h1>
        <p className="mt-2 text-body">Manage your profile and report issues</p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <h2 className="heading-3 mb-6">Profile Information</h2>
        
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            {profile.profile_picture ? (
              <img
                src={`http://localhost:5000${profile.profile_picture}`}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-secondary/20"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-secondary/10 flex items-center justify-center border-4 border-secondary/20">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-secondary/40" />
              </div>
            )}
            <label className="mt-3 block">
              <span className="sr-only">Change profile picture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </label>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Full Name</p>
                <p className="text-base sm:text-lg font-semibold text-primary">{profile.full_name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Registration Number</p>
                <p className="text-base sm:text-lg font-semibold text-primary">{profile.reg_number}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Email</p>
                <p className="text-base sm:text-lg font-semibold text-primary break-all">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Level</p>
                <p className="text-base sm:text-lg font-semibold text-primary">{profile.level}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Department</p>
                <p className="text-base sm:text-lg font-semibold text-primary">{profile.department}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-secondary">Voting Status</p>
                <p className={`text-base sm:text-lg font-semibold ${profile.has_voted ? 'text-green-600' : 'text-primary'}`}>
                  {profile.has_voted ? 'Voted' : 'Not Voted'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report a Problem */}
      <div className="card">
        <h2 className="heading-3 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-secondary" />
          Report a Problem
        </h2>
        
        {reportSubmitted && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded text-sm">
            Problem reported successfully! We'll get back to you soon.
          </div>
        )}

        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              Subject
            </label>
            <input
              type="text"
              required
              value={reportForm.subject}
              onChange={(e) => setReportForm({ ...reportForm, subject: e.target.value })}
              className="input-classic"
              placeholder="Brief description of the issue"
            />
          </div>

          <div>
            <label className="form-label">
              Message
            </label>
            <textarea
              required
              value={reportForm.message}
              onChange={(e) => setReportForm({ ...reportForm, message: e.target.value })}
              rows={5}
              className="input-classic"
              placeholder="Describe the problem in detail..."
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDashboard;

