import { Episode } from './podcast';

export interface AudioContextType {
  // Audio state
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  isMuted: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  
  // Audio controls
  setCurrentEpisode: (episode: Episode | null) => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  skipBackward: () => void;
  skipForward: () => void;
  handleTimeUpdate: () => void;
  handleLoadedMetadata: () => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  changePlaybackRate: () => void;
  toggleMute: () => void;
  handleEpisodeClick: (episode: Episode) => void;
  handlePlay: () => void;
  handlePause: () => void;
} 