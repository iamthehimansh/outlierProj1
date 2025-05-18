import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import './App.css'
import stretchAnimations from './utils/stretchAnimations.jsx';
import CircularTimer from './utils/CircularTimer.jsx';
import StretchItem from './utils/StretchItem.jsx';





// Mock data for stretch sequences
const initialStretchSequences = [
  { id: 1, name: 'Neck Stretch', duration: 30, description: 'Gently tilt your head to each side', completed: false },
  { id: 2, name: 'Shoulder Rolls', duration: 45, description: 'Roll shoulders backward and forward', completed: false },
  { id: 3, name: 'Hamstring Stretch', duration: 60, description: 'Bend forward and touch your toes', completed: false },
  { id: 4, name: 'Quad Stretch', duration: 45, description: 'Pull your foot toward your glutes', completed: false },
  { id: 5, name: 'Side Bends', duration: 30, description: 'Lean to each side with arm overhead', completed: false },
];





export default function App() {

  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Initial states with localStorage integration
  const [stretches, setStretches] = useState(loadFromStorage('stretches', initialStretchSequences));
  const [currentStretch, setCurrentStretch] = useState(null);
  const [streak, setStreak] = useState(loadFromStorage('streak', 0));
  const [lastCompleted, setLastCompleted] = useState(loadFromStorage('lastCompleted', null));
  const [completedToday, setCompletedToday] = useState(loadFromStorage('completedToday', 0));
  const [totalTime, setTotalTime] = useState(loadFromStorage('totalTime', 0));
  const [isDropDisabled, setIsDropDisabled] = useState(false);
  
  // Audio feedback
  const [completeSound] = useState(new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAzMzMzMzMzMw=='));
  const [timerSound] = useState(new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAzMzMzMzMzMw=='));
  
  // Save to localStorage whenever relevant state changes
  useEffect(() => {
    localStorage.setItem('stretches', JSON.stringify(stretches));
  }, [stretches]);

  useEffect(() => {
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('lastCompleted', JSON.stringify(lastCompleted));
  }, [lastCompleted]);

  useEffect(() => {
    localStorage.setItem('completedToday', JSON.stringify(completedToday));
  }, [completedToday]);

  useEffect(() => {
    localStorage.setItem('totalTime', JSON.stringify(totalTime));
  }, [totalTime]);

  // Check streak on component mount
  useEffect(() => {
    checkAndUpdateStreak();
  }, []);

  // Function to check and update streak based on last completed date
  const checkAndUpdateStreak = () => {
    const today = new Date().toDateString();
    
    if (!lastCompleted) {
      // First time user - no streak yet
      setLastCompleted(today);
      return;
    }

    const lastDate = new Date(lastCompleted);
    const currentDate = new Date(today);
    
    // Calculate the difference in days
    const timeDiff = currentDate.getTime() - lastDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 0) {
      // Same day, no streak change
      return;
    } else if (daysDiff === 1) {
      // Next consecutive day - increase streak
      setStreak(prev => prev + 1);
      // Reset completedToday since it's a new day
      setCompletedToday(0);
      setTotalTime(0);
      // Update stretches to mark all as not completed for the new day
      setStretches(stretches.map(stretch => ({ ...stretch, completed: false })));
    } else if (daysDiff > 1) {
      // Streak broken - reset
      setStreak(0);
      // Reset completedToday since it's a new day
      setCompletedToday(0);
      setTotalTime(0);
      // Update stretches to mark all as not completed for the new day
      setStretches(stretches.map(stretch => ({ ...stretch, completed: false })));
    }
    
    // Update last completed to today
    setLastCompleted(today);
  };
  
  // Play sound effects
  const playCompleteSound = () => {
    completeSound.currentTime = 0;
    completeSound.volume = 0.7;
    completeSound.play().catch(e => console.log('Audio play error:', e));
  };
  
  const playTimerSound = () => {
    timerSound.currentTime = 0;
    timerSound.volume = 0.5;
    timerSound.play().catch(e => console.log('Audio play error:', e));
  };

  // Start a stretch sequence
  const startStretch = (stretch) => {
    setCurrentStretch(stretch);
  };

  // Complete a stretch
  const completeStretch = (id) => {
    setStretches(stretches.map(stretch => 
      stretch.id === id ? { ...stretch, completed: true } : stretch
    ));
    setCurrentStretch(null);
    setCompletedToday(prev => prev + 1);
    setTotalTime(prev => prev + stretches.find(s => s.id === id).duration);
    playCompleteSound();
    
    // Update last completed date and check streak
    const today = new Date().toDateString();
    if (lastCompleted !== today) {
      setLastCompleted(today);
      checkAndUpdateStreak();
    }
    
    // Visual feedback with confetti effect
    const stretchElement = document.querySelector(`.stretch-item[data-id="${id}"]`);
    if (stretchElement) {
      stretchElement.classList.add('just-completed');
      setTimeout(() => {
        stretchElement.classList.remove('just-completed');
      }, 2000);
    }
  };

  // Reset all stretches
  const resetStretches = () => {
    if (window.confirm("Are you sure you want to reset your routine? This will clear your progress but maintain your streak.")) {
      setStretches(initialStretchSequences.map(stretch => ({ ...stretch, completed: false })));
      setCurrentStretch(null);
      setCompletedToday(0);
      setTotalTime(0);
    }
  };

  // Reset everything including streak (for testing)
  const resetEverything = () => {
    if (window.confirm("Are you sure you want to reset EVERYTHING including your streak?")) {
      localStorage.clear();
      setStretches(initialStretchSequences);
      setCurrentStretch(null);
      setStreak(0);
      setLastCompleted(null);
      setCompletedToday(0);
      setTotalTime(0);
    }
  };





  
  

  return (
    <div className="app">
      <header className="app-header">
        <h1>Stretch Sequence Coach</h1>
        <div className="streak-container">
          <span className="streak-flame">🔥</span>
          <span className="streak-count">{streak} day streak</span>
        </div>
      </header>

      <main className="app-main">
        {currentStretch ? (
          <div className="active-stretch">
            <div className="active-stretch-animation">
              {stretchAnimations[currentStretch.id]}
            </div>
            <h2>{currentStretch.name}</h2>
            <p>{currentStretch.description}</p>
            <CircularTimer
              duration={currentStretch.duration}
              currentTime={currentStretch.duration}
              isActive={true}
              onComplete={() => completeStretch(currentStretch.id)}
            />
            <div className="stretch-controls">
              <button onClick={() => setCurrentStretch(null)} className="btn secondary">
                Cancel
              </button>
              <button onClick={() => completeStretch(currentStretch.id)} className="btn primary">
                Complete
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="stretches-container">
              <h2>Your Stretch Routine</h2>
              <p className="drag-instruction">Drag to reorder your routine</p>
              <DragDropContext
                onDragStart={(start) => {
                  // Add a class to the body to indicate dragging is in progress
                  document.body.classList.add('dragging');

                  setIsDropDisabled(true); // Disable drop temporarily
                  // Close any active stretch when starting to drag
                  if (currentStretch) setCurrentStretch(null);
                }}
                onDragEnd={result => {
                  // Remove dragging class
                  document.body.classList.remove('dragging');
                  setIsDropDisabled(false); // Re-enable drop
                  // If dropped outside the list or no change in position
                  if (!result.destination || result.destination.index === result.source.index) return;
                  
                  // Create a new array from the current stretches
                  const items = Array.from(stretches);
                  // Remove the dragged item from its original position
                  const [reorderedItem] = items.splice(result.source.index, 1);
                  // Insert the dragged item at its new position
                  items.splice(result.destination.index, 0, reorderedItem);
                  // Update state with the new order
                  setStretches(items);
                }}
              >
                <Droppable droppableId="stretches" isDropDisabled={isDropDisabled}>
                  {(provided) => (
                    <div 
                      className="stretch-list" 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {stretches.map((stretch, index) => (
                        <StretchItem
                          key={stretch.id}
                          stretch={stretch}
                          index={index}
                          currentStretch={currentStretch}
                          onClick={startStretch}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="summary-container">
              <h2>Today's Progress</h2>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-value">{completedToday}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{totalTime}</span>
                  <span className="stat-label">Seconds</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{Math.round(completedToday / stretches.length * 100)}%</span>
                  <span className="stat-label">Progress</span>
                </div>
              </div>
              <button onClick={resetStretches} className="btn reset-btn">
                Reset Routine
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Interactive Stretch Sequence Coach - Your daily wellness companion</p>
      </footer>
    </div>
  );
}