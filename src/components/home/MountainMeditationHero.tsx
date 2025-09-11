import React from 'react';

export const MountainMeditationHero: React.FC = () => {
  return (
    <div className="hero-container">
      {/* Light rays */}
      <div className="light-rays">
        <div className="ray ray1"></div>
        <div className="ray ray2"></div>
        <div className="ray ray3"></div>
      </div>

      {/* Mountain layers */}
      <div className="mountains">
        <div className="mountain-layer mountain-back"></div>
        <div className="mountain-layer mountain-mid"></div>
        <div className="mountain-layer mountain-front"></div>
      </div>
      
      {/* Floating clouds */}
      <div className="clouds-container">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
      </div>
      
      {/* Floating particles */}
      <div className="floating-particles">
        <div className="particle particle-small"></div>
        <div className="particle particle-medium"></div>
        <div className="particle particle-large"></div>
        <div className="particle particle-small"></div>
        <div className="particle particle-medium"></div>
        <div className="particle particle-small"></div>
      </div>
      
      {/* Detailed meditation figure */}
      <div className="person-container">
        <div className="person">
          <div className="person-head"></div>
          <div className="person-arms"></div>
          <div className="person-body"></div>
          <div className="person-legs"></div>
        </div>
      </div>
      
      {/* Enhanced breathing sphere with AI elements */}
      <div className="breathing-sphere">
        <div className="sphere-outer-glow"></div>
        <div className="sphere-core">
          <div className="neural-pattern">
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
          </div>
          <div className="sphere-ring ring-1"></div>
          <div className="sphere-ring ring-2"></div>
        </div>
      </div>
    </div>
  );
};