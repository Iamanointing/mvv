import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext';
import { Users, Vote, TrendingUp, AlertCircle, Lock, Unlock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [settings, setSettings] = useState({});
  const socket = useSocket();

  useEffect(() => {
    fetchStats();
    fetchSettings();

    if (socket) {
      socket.on('vote-submitted', () => {
        fetchStats();
      });
      socket.on('settings-update', () => {
        fetchSettings();
      });
    }

    return () => {
      if (socket) {
        socket.off('vote-submitted');
        socket.off('settings-update');
      }
    };
  }, [socket]);

  const fetchStats = async () => {
    try {
      const [studentsRes, votesRes, usersRes] = await Promise.all([
        axios.get('/api/admin/students'),
        axios.get('/api/admin/votes'),
        axios.get('/api/admin/users')
      ]);

      const totalVotes = votesRes.data.length;
      const validVotes = votesRes.data.filter(v => !v.is_cancelled).length;
      const cancelledVotes = votesRes.data.filter(v => v.is_cancelled).length;

      setStats({
        totalStudents: studentsRes.data.length,
        totalUsers: usersRes.data.length,
        totalVotes,
        validVotes,
        cancelledVotes
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const toggleRegistration = async () => {
    try {
      await axios.post('/api/admin/settings/toggle-registration');
      fetchSettings();
    } catch (error) {
      alert('Failed to toggle registration');
    }
  };

  const toggleVoting = async () => {
    try {
      await axios.post('/api/admin/settings/toggle-voting');
      fetchSettings();
    } catch (error) {
      alert('Failed to toggle voting');
    }
  };

  const endVoting = async () => {
    if (window.confirm('Are you sure you want to end voting? This action cannot be undone.')) {
      try {
        await axios.post('/api/admin/settings/end-voting');
        fetchSettings();
      } catch (error) {
        alert('Failed to end voting');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-secondary text-sm sm:text-base">Manage the voting system</p>
      </div>

      {/* System Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-secondary">Registration</p>
              <p className={`text-xl sm:text-2xl font-bold mt-2 ${settings.registration_open === '1' ? 'text-green-600' : 'text-red-600'}`}>
                {settings.registration_open === '1' ? 'Open' : 'Closed'}
              </p>
            </div>
            <button
              onClick={toggleRegistration}
              className={`p-3 rounded-full transition-colors ${settings.registration_open === '1' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
            >
              {settings.registration_open === '1' ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> : <Unlock className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-secondary">Voting</p>
              <p className={`text-xl sm:text-2xl font-bold mt-2 ${settings.voting_open === '1' ? 'text-green-600' : 'text-red-600'}`}>
                {settings.voting_open === '1' ? 'Open' : 'Closed'}
              </p>
            </div>
            <button
              onClick={toggleVoting}
              className={`p-3 rounded-full transition-colors ${settings.voting_open === '1' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
            >
              {settings.voting_open === '1' ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> : <Unlock className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-secondary">Voting Status</p>
              <p className={`text-xl sm:text-2xl font-bold mt-2 ${settings.voting_ended === '1' ? 'text-blue-600' : 'text-secondary'}`}>
                {settings.voting_ended === '1' ? 'Ended' : 'Active'}
              </p>
            </div>
            {settings.voting_open === '1' && (
              <button
                onClick={endVoting}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                End Voting
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div className="ml-4">
              <p className="text-xs sm:text-sm font-medium text-secondary">Total Students</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-xs sm:text-sm font-medium text-secondary">Registered Users</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Vote className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div className="ml-4">
              <p className="text-xs sm:text-sm font-medium text-secondary">Total Votes</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalVotes || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div className="ml-4">
              <p className="text-xs sm:text-sm font-medium text-secondary">Valid Votes</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{stats.validVotes || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">System Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
            <p className="text-xs sm:text-sm text-secondary">Cancelled Votes</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelledVotes || 0}</p>
          </div>
          <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
            <p className="text-xs sm:text-sm text-secondary">Vote Turnout</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {stats.totalUsers > 0 
                ? ((stats.totalVotes / stats.totalUsers) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

