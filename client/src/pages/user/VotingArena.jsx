import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, CheckCircle, X } from 'lucide-react';

const VotingArena = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [votingStatus, setVotingStatus] = useState({ voting_open: false, voting_ended: false });
  const [selectedVotes, setSelectedVotes] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchPositions();
    checkVotingStatus();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('/api/voting/positions');
      setPositions(response.data.positions || []);
      setVotingStatus({
        voting_open: response.data.voting_open,
        voting_ended: response.data.voting_ended
      });
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const response = await axios.get('/api/voting/status');
      setHasVoted(response.data.has_voted);
    } catch (error) {
      console.error('Failed to check voting status:', error);
    }
  };

  const handleVoteSelect = (positionId, contestantId, choice) => {
    if (!votingStatus.voting_open || hasVoted) return;

    const position = positions.find(p => p.id === positionId);
    
    // For positions with multiple candidates, only one selection allowed
    if (position.contestant_count > 1) {
      setSelectedVotes({
        ...selectedVotes,
        [positionId]: { contestant_id: contestantId, choice: 'yes', position_id: positionId }
      });
    } else {
      // For single candidate positions, yes/no choice
      setSelectedVotes({
        ...selectedVotes,
        [positionId]: { contestant_id: contestantId, choice, position_id: positionId }
      });
    }
  };

  const handleShowSummary = () => {
    // Check if all positions have votes
    const allVoted = positions.every(pos => selectedVotes[pos.id]);
    if (!allVoted) {
      alert('Please vote for all positions before proceeding.');
      return;
    }
    setShowSummary(true);
  };

  const handleStartCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        alert('Failed to access camera: ' + err.message);
        setShowCamera(false);
      });
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedPhoto(photoDataUrl);
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!capturedPhoto) {
      alert('Please capture a photo to submit your vote');
      return;
    }

    setLoading(true);

    try {
      // Convert data URL to blob
      const blob = await (await fetch(capturedPhoto)).blob();
      const file = new File([blob], 'vote-photo.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('votes', JSON.stringify(Object.values(selectedVotes)));

      await axios.post('/api/voting/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Vote submitted successfully!');
      navigate('/user/home');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit vote');
      setLoading(false);
    }
  };

  if (hasVoted) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="heading-2 mb-2">You've Already Voted</h2>
        <p className="text-body">Thank you for participating in the election!</p>
      </div>
    );
  }

  if (!votingStatus.voting_open && !votingStatus.voting_ended) {
    return (
      <div className="card text-center py-8 sm:py-12">
        <X className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h2 className="heading-2 mb-2">Voting is Closed</h2>
        <p className="text-body">Voting is not currently open. Please check back later.</p>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="card">
          <h2 className="heading-2 mb-6">Review Your Votes</h2>
          
          {positions.map(position => {
            const vote = selectedVotes[position.id];
            const contestant = vote?.contestant_id 
              ? position.contestants?.find(c => c.id === vote.contestant_id)
              : null;

            return (
              <div key={position.id} className="border-b border-secondary/20 pb-4 mb-4">
                <h3 className="font-semibold text-primary text-base sm:text-lg">{position.name}</h3>
                {position.contestant_count > 1 ? (
                  <p className="text-body">Voted for: {contestant?.name || 'N/A'}</p>
                ) : (
                  <p className="text-body">Choice: {vote?.choice === 'yes' ? 'YES' : 'NO'}</p>
                )}
              </div>
            );
          })}

          {!capturedPhoto ? (
            <div className="mt-6 space-y-3">
              <button
                onClick={handleStartCamera}
                className="btn-primary w-full py-3 text-base sm:text-lg flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo to Confirm Vote
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="btn-outline w-full py-3"
              >
                Back to Voting
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <img src={capturedPhoto} alt="Captured" className="mx-auto max-w-full sm:max-w-md rounded-lg border-2 border-secondary/30" />
                <p className="text-sm text-secondary mt-2">Photo captured successfully</p>
              </div>
              <button
                onClick={handleStartCamera}
                className="btn-outline w-full py-3"
              >
                Retake Photo
              </button>
              <button
                onClick={handleSubmitVote}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-base sm:text-lg"
              >
                {loading ? 'Submitting...' : 'Confirm and Submit Vote'}
              </button>
            </div>
          )}

          {showCamera && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="card max-w-2xl w-full">
                <video ref={videoRef} autoPlay className="w-full rounded-lg mb-4" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={capturePhoto}
                    className="btn-primary flex-1 py-3"
                  >
                    Capture Photo
                  </button>
                  <button
                    onClick={() => {
                      if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => track.stop());
                      }
                      setShowCamera(false);
                    }}
                    className="btn-outline flex-1 py-3"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="heading-2">Voting Arena</h1>
        <p className="mt-2 text-body">Select your preferred candidates</p>
      </div>

      {positions.map(position => {
        const selectedVote = selectedVotes[position.id];
        const hasMultipleCandidates = position.contestant_count > 1;

        return (
          <div key={position.id} className="card">
            <h2 className="heading-3 mb-4">{position.name}</h2>
            {position.description && (
              <p className="text-body mb-4">{position.description}</p>
            )}

            <div className="space-y-3">
              {position.contestants?.map(contestant => {
                const isSelected = selectedVote?.contestant_id === contestant.id && 
                                  (hasMultipleCandidates || selectedVote?.choice === 'yes');

                return (
                  <div
                    key={contestant.id}
                    className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-secondary/30 hover:border-primary/50 bg-white'
                    }`}
                    onClick={() => handleVoteSelect(position.id, contestant.id, 'yes')}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      {hasMultipleCandidates ? (
                        <input
                          type="radio"
                          name={`position-${position.id}`}
                          checked={isSelected}
                          onChange={() => handleVoteSelect(position.id, contestant.id, 'yes')}
                          className="w-5 h-5 text-primary accent-primary"
                        />
                      ) : (
                        <div className="flex space-x-3 sm:space-x-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`position-${position.id}`}
                              checked={selectedVote?.choice === 'yes'}
                              onChange={() => handleVoteSelect(position.id, contestant.id, 'yes')}
                              className="w-5 h-5 text-primary accent-primary mr-2"
                            />
                            <span className="font-semibold text-primary">YES</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`position-${position.id}`}
                              checked={selectedVote?.choice === 'no'}
                              onChange={() => handleVoteSelect(position.id, contestant.id, 'no')}
                              className="w-5 h-5 text-primary accent-primary mr-2"
                            />
                            <span className="font-semibold text-primary">NO</span>
                          </label>
                        </div>
                      )}
                      {contestant.photo && (
                        <img
                          src={`http://localhost:5000${contestant.photo}`}
                          alt={contestant.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary text-base sm:text-lg">{contestant.name}</h3>
                        {contestant.bio && (
                          <p className="text-sm text-secondary mt-1">{contestant.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="card">
        <button
          onClick={handleShowSummary}
          className="btn-primary w-full py-3 text-base sm:text-lg"
        >
          Review and Confirm Votes
        </button>
      </div>
    </div>
  );
};

export default VotingArena;

