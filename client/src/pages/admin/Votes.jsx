import { useState, useEffect } from 'react';
import axios from 'axios';
import { XCircle, CheckCircle } from 'lucide-react';

const AdminVotes = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get('/api/admin/votes');
      setVotes(response.data);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
    }
  };

  const handleCancelVote = async (voteId) => {
    if (window.confirm('Are you sure you want to cancel this vote?')) {
      try {
        await axios.put(`/api/admin/votes/${voteId}/cancel`);
        fetchVotes();
      } catch (error) {
        alert('Failed to cancel vote');
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="heading-2">Vote Management</h1>
        <p className="mt-2 text-body">View and manage all submitted votes</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-classic">
          <thead>
            <tr>
              <th className="hidden sm:table-cell">S/N</th>
              <th>Voter</th>
              <th className="hidden md:table-cell">Position</th>
              <th className="hidden lg:table-cell">Candidate</th>
              <th className="hidden md:table-cell">Choice</th>
              <th>Photo</th>
              <th>Status</th>
              <th className="hidden lg:table-cell">Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, index) => (
              <tr key={vote.id} className="hover:bg-secondary/5 transition-colors">
                <td className="hidden sm:table-cell font-medium text-primary">
                  {index + 1}
                </td>
                <td>
                  <div>
                    <div className="text-sm font-semibold text-primary">{vote.voter_name}</div>
                    <div className="text-xs text-secondary">{vote.voter_reg}</div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  {vote.position_name}
                </td>
                <td className="hidden lg:table-cell">
                  {vote.contestant_name || '-'}
                </td>
                <td className="hidden md:table-cell">
                  {vote.choice.toUpperCase()}
                </td>
                <td>
                  {vote.photo && (
                    <a
                      href={`http://localhost:5000${vote.photo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      View Photo
                    </a>
                  )}
                </td>
                <td>
                  {vote.is_cancelled ? (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Valid
                    </span>
                  )}
                </td>
                <td className="hidden lg:table-cell text-xs">
                  {new Date(vote.created_at).toLocaleString()}
                </td>
                <td>
                  {!vote.is_cancelled && (
                    <button
                      onClick={() => handleCancelVote(vote.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Cancel Vote"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVotes;

