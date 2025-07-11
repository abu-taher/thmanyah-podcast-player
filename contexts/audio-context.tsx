'use client';

import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Episode, AudioContextType } from '../types';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Audio player state
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle episode click to play audio
  const handleEpisodeClick = (episode: Episode) => {
    if (!episode.previewUrl) {
      console.warn('No preview URL available for playback');
      return;
    }
    
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
    
    setCurrentEpisode(episode);
    console.log('Selected episode:', episode.trackName);
    
    // Automatically start playing the new episode
    // We need to wait a bit for the audio element to update with the new source
    setTimeout(() => {
      if (audioRef.current && episode.previewUrl) {
        // Load the new source
        audioRef.current.load();
        
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error auto-playing episode:', error);
            setIsPlaying(false);
            
            // Try to reload the audio if it failed
            if (audioRef.current) {
              audioRef.current.load();
            }
          });
      }
    }, 100); // Small delay to ensure audio source is updated
  };

  // Audio control functions
  const togglePlayPause = () => {
    if (audioRef.current && currentEpisode?.previewUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            
            // Try to reload the audio if it failed
            if (audioRef.current) {
              audioRef.current.load();
            }
          });
      }
    } else {
      console.warn('No audio source available or audio element not ready');
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
      console.log(newMutedState ? 'Audio muted' : 'Audio unmuted');
    }
  };

  // Handle audio play event
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Handle audio pause event
  const handlePause = () => {
    setIsPlaying(false);
  };

  const value: AudioContextType = {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    audioRef,
    setCurrentEpisode,
    setIsPlaying,
    togglePlayPause,
    skipBackward,
    skipForward,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgressClick,
    changePlaybackRate,
    toggleMute,
    handleEpisodeClick,
    handlePlay,
    handlePause,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 