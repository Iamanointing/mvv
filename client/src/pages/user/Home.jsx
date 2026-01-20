import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../../contexts/SocketContext';
import { TrendingUp, Users, Vote, Clock, AlertCircle, Mail, Megaphone } from 'lucide-react';

const UserHome = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [votingStatus, setVotingStatus] = useState({ voting_open: false, voting_ended: false });
  const socket = useSocket();

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
    fetchVotingStatus();

    if (socket) {
      socket.on('new-announcement', (data) => {
        fetchAnnouncements();
      });
      socket.on('settings-update', (data) => {
        if (data.key === 'voting_open' || data.key === 'voting_ended') {
          fetchVotingStatus();
          fetchStats();
        }
      });
      socket.on('vote-submitted', () => {
        fetchStats();
      });
    }

    return () => {
      if (socket) {
        socket.off('new-announcement');
        socket.off('settings-update');
        socket.off('vote-submitted');
      }
    };
  }, [socket]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/results/realtime');
      if (response.data && response.data.length > 0) {
        const totalVotes = response.data.reduce((sum, pos) => sum + (pos.total_valid_votes || 0), 0);
        const totalPositions = response.data.length;
        setStats({ totalVotes, totalPositions });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      setVotingStatus({
        voting_open: response.data.voting_open === '1',
        voting_ended: response.data.voting_ended === '1'
      });
    } catch (error) {
      console.error('Failed to fetch voting status:', error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Welcome to MyVesaVote</h1>
        <p className="mt-2 text-secondary text-sm sm:text-base">Students Union Voting System</p>
      </div>

      {/* Voting Status Banner */}
      {votingStatus.voting_open && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start sm:items-center">
          <Vote className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="font-semibold text-green-900 text-sm sm:text-base">Voting is currently open!</p>
            <p className="text-sm text-green-700 mt-1">Head to the Voting Arena to cast your vote.</p>
          </div>
        </div>
      )}

      {votingStatus.voting_ended && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 flex items-start sm:items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="font-semibold text-blue-900 text-sm sm:text-base">Voting has ended</p>
            <p className="text-sm text-blue-700 mt-1">Check the results on your dashboard.</p>
          </div>
        </div>
      )}

      {/* Live Stats */}
      {stats && votingStatus.voting_ended && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-secondary">Total Votes Cast</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalVotes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-secondary">Positions</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{stats.totalPositions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <Vote className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-secondary">Live Feed</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Instructions */}
      <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4">How to Vote</h2>
        <ol className="list-decimal list-inside space-y-2 text-secondary text-sm sm:text-base">
          <li>Navigate to the <strong className="text-primary">Voting Arena</strong> from the menu above</li>
          <li>Review all positions and candidates</li>
          <li>For positions with multiple candidates, select ONE candidate per position</li>
          <li>For positions with a single candidate, select YES or NO</li>
          <li>Review your choices in the summary</li>
          <li>Take a live photo to confirm your vote</li>
          <li>Submit your vote</li>
        </ol>
      </div>

      {/* Announcements */}
      <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 flex items-center">
          <Megaphone className="w-5 h-5 mr-2 text-secondary" />
          Announcements
        </h2>
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-primary text-sm sm:text-base">{announcement.title}</h3>
                <p className="text-secondary text-sm mt-1">{announcement.content}</p>
                <p className="text-xs text-secondary/70 mt-2">
                  {new Date(announcement.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary text-sm">No announcements at the moment.</p>
        )}
      </div>

      {/* Contact Us */}
      <div className="bg-white border border-secondary/20 rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 flex items-center">
          <Mail className="w-5 h-5 mr-2 text-secondary" />
          Contact Us
        </h2>
        <p className="text-secondary text-sm sm:text-base">
          If you encounter any issues or have questions about the voting process, please contact us through your dashboard's "Report a Problem" section.
        </p>
      </div>
    </div>
  );
};

export default UserHome;

