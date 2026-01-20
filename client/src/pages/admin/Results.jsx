import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, TrendingUp, XCircle } from 'lucide-react';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('/api/results/realtime');
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2">Election Results</h1>
        <p className="mt-2 text-body">Comprehensive voting results and statistics</p>
      </div>

      {results.map((positionResult) => (
        <div key={positionResult.position.id} className="card mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <h2 className="heading-3">{positionResult.position.name}</h2>
            {positionResult.position.description && (
              <p className="text-body">{positionResult.position.description}</p>
            )}
          </div>

          {/* Winner Card */}
          {positionResult.winner && (
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">Winner</h3>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{positionResult.winner.name}</p>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                    <div>
                      <span className="text-secondary">Votes:</span>{' '}
                      <span className="font-bold text-primary">{positionResult.winner.votes}</span>
                    </div>
                    <div>
                      <span className="text-secondary">Percentage:</span>{' '}
                      <span className="font-bold text-primary">{positionResult.winner.percentage}%</span>
                    </div>
                    <div>
                      <span className="text-secondary">Status:</span>{' '}
                      <span className="font-bold text-green-600">Elected</span>
                    </div>
                  </div>
                </div>
                {positionResult.winner.photo && (
                  <img
                    src={`http://localhost:5000${positionResult.winner.photo}`}
                    alt={positionResult.winner.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-yellow-400 flex-shrink-0"
                  />
                )}
              </div>
            </div>
          )}

          {/* All Contestants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {positionResult.contestants.map((contestant) => (
              <div
                key={contestant.id}
                className={`border-2 rounded-lg p-4 ${
                  positionResult.winner?.id === contestant.id
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-secondary/30 bg-secondary/5'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  {contestant.photo && (
                    <img
                      src={`http://localhost:5000${contestant.photo}`}
                      alt={contestant.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary truncate">{contestant.name}</h4>
                    {contestant.reg_number && (
                      <p className="text-xs text-secondary truncate">{contestant.reg_number}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-secondary">Votes:</span>
                    <span className="font-bold text-primary">{contestant.votes}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-secondary">Percentage:</span>
                    <span className="font-bold text-primary">{contestant.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${contestant.percentage}%` }}
                    ></div>
                  </div>
                  {contestant.cancelled_votes > 0 && (
                    <div className="flex items-center text-xs text-red-600 mt-1">
                      <XCircle className="w-3 h-3 mr-1" />
                      <span>{contestant.cancelled_votes} cancelled</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Position Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-secondary/30">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-secondary">Total Valid Votes</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{positionResult.total_valid_votes}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-secondary">Cancelled Votes</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{positionResult.total_cancelled_votes}</p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-secondary">Total Votes</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {positionResult.total_valid_votes + positionResult.total_cancelled_votes}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm text-secondary">Contestants</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{positionResult.contestants.length}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminResults;

