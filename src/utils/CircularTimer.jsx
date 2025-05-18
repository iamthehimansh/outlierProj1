import React, { useState, useEffect } from 'react';


const CircularTimer = ({ duration, currentTime: initialTime, isActive: initialIsActive, onComplete }) => {
    const [currentTime, setCurrentTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(initialIsActive);
    const [intervalId, setIntervalId] = useState(null);
    
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - currentTime / duration);
  
    // Start or pause timer
    const toggleTimer = () => {
      if (isActive) {
        // Pause timer
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(null);
        }
      } else {
        // Start timer
        const id = setInterval(() => {
          setCurrentTime(prev => {
            if (prev <= 1) { // Changed to 1 to trigger completion before hitting 0
              clearInterval(id);
              setIntervalId(null);
              setIsActive(false);
              // Call onComplete callback when timer finishes
              if (onComplete) {
                setTimeout(() => onComplete(), 300); // Small delay for visual feedback
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setIntervalId(id);
      }
      setIsActive(!isActive);
    };
  
    // Reset timer
    const resetTimer = () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setCurrentTime(duration);
      setIsActive(false);
    };
  
    // Auto-start timer when component mounts if isActive is true
    useEffect(() => {
      if (initialIsActive && !intervalId) {
        toggleTimer();
      }
    }, []); // Empty dependency array ensures this only runs once on mount
  
    // Clean up interval on unmount
    useEffect(() => {
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [intervalId]);
  
    return (
      <div className="timer-container">
        <svg className="timer" viewBox="0 0 100 100">
          <circle
            className="timer-background"
            cx="50"
            cy="50"
            r={radius}
          />
          <circle
            className="timer-progress"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          <text x="50" y="55" className="timer-text">
            {Math.ceil(currentTime)}
          </text>
        </svg>
        <div className="timer-controls">
          <button 
            className={`timer-button ${isActive ? 'pause' : 'play'}`}
            onClick={toggleTimer}
          >
            {isActive ? '❚❚' : '▶'}
          </button>
          <button 
            className="timer-button reset"
            onClick={resetTimer}
          >
            ↺
          </button>
        </div>
      </div>
    );
  
  };

  export default CircularTimer;