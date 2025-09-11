import React from 'react';

export type AvatarState = 'idle' | 'speaking' | 'listening' | 'thinking';

interface AvatarProps {
  state: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ state, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20', 
    lg: 'w-32 h-32'
  };

  const getAvatarContent = () => {
    switch (state) {
      case 'speaking':
        return (
          <div className="relative">
            {/* Avatar face */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🧘‍♀️</div>
            </div>
            {/* Speaking animation - pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
          </div>
        );
      
      case 'listening':
        return (
          <div className="relative">
            {/* Avatar face */}
            <div className="w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">👂</div>
            </div>
            {/* Listening animation - gentle pulse */}
            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-pulse"></div>
            {/* Sound waves */}
            <div className="absolute -inset-2">
              <div className="w-full h-full rounded-full border border-green-200 animate-ping" style={{ animationDelay: '0s' }}></div>
            </div>
            <div className="absolute -inset-4">
              <div className="w-full h-full rounded-full border border-green-100 animate-ping" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        );
      
      case 'thinking':
        return (
          <div className="relative">
            {/* Avatar face */}
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🤔</div>
            </div>
            {/* Thinking animation - rotating dots */}
            <div className="absolute -top-2 -right-2">
              <div className="flex space-x-1 animate-bounce">
                <div className="w-1 h-1 bg-yellow-400 rounded-full" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-1 bg-yellow-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        );
      
      case 'idle':
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center transition-all duration-300 hover:from-blue-400 hover:to-purple-500">
            <div className="text-white text-2xl">🧘‍♀️</div>
          </div>
        );
    }
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      {getAvatarContent()}
    </div>
  );
}

export default Avatar;