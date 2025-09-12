import React from 'react';
import './BreathingOrb.css';

interface BreathingOrbProps {
  isPlaying: boolean;
}

const BreathingOrb: React.FC<BreathingOrbProps> = ({ isPlaying }) => {
  return (
    <div className="orb-container">
      <div className={`orb ${isPlaying ? 'breathing' : ''}`} />
      <div className="orb-text">{isPlaying ? 'Breathe...' : 'Paused'}</div>
    </div>
  );
};

export default BreathingOrb;
