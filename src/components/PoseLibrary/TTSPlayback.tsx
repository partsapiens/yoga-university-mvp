import { useState } from 'react';

interface TTSPlaybackProps {
  text: string;
  className?: string;
}

export default function TTSPlayback({ text, className = "" }: TTSPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={handlePlay}
      className={`flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors ${className}`}
      aria-label={isPlaying ? "Stop reading" : "Play teaching cue"}
      disabled={!text}
    >
      <span className="text-lg">{isPlaying ? '⏹️' : '🔊'}</span>
      <span>{isPlaying ? 'Stop' : 'Play Cue'}</span>
    </button>
  );
}