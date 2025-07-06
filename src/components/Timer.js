import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Timer.css';

const Timer = ({ startTime, endTime, onTimeUp }) => {
  const { socket } = useSocket();
  const { roomCode } = useParams();
  const location = useLocation();
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const currentRoomCode = roomCode || location.state?.roomCode;

  useEffect(() => {
    if (!startTime || !endTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        onTimeUp && onTimeUp();
        // Emit round end event to server
        if (socket && currentRoomCode) {
          socket.emit('roundEnd', { roomCode: currentRoomCode }, (response) => {
            if (response.success) {
              console.log('Round ended successfully');
            } else {
              console.error('Failed to end round:', response.error);
            }
          });
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, onTimeUp, socket, currentRoomCode]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 30) return 'red';
    if (timeRemaining <= 60) return 'orange';
    return 'green';
  };

  return (
    <div className="timer-container">
      <div className="timer-label">Time Remaining</div>
      <div className={`timer-display ${getTimeColor()}`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default Timer; 