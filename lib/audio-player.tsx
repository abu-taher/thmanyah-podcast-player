'use client';

import { useAudio } from './audio-context';

// Simple SVG Icon Components
const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

const VolumeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6a1 1 0 001.514.857L14 13.5V10.5l-3.486-2.357A1 1 0 009 9z" />
  </svg>
);

const VolumeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

// Helper function to format duration from milliseconds
const formatDuration = (milliseconds?: number): string => {
  if (!milliseconds) return '0:00';
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    audioRef,
    togglePlayPause,
    skipBackward,
    skipForward,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgressClick,
    changePlaybackRate,
    toggleMute,
  } = useAudio();

  // Don't render if no episode is selected
  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-48 right-0 bg-slate-800 border-t border-slate-700 p-4 flex items-center space-x-4 z-50">
      {/* Episode Info */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <img
          src={currentEpisode.artworkUrl600 || currentEpisode.artworkUrl100 || currentEpisode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
          alt={currentEpisode.trackName}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-white truncate text-sm max-w-[200px]">{currentEpisode.trackName}</h3>
          <p className="text-xs text-slate-400 truncate max-w-[200px]">{currentEpisode.collectionName}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        <button 
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          onClick={skipBackward}
        >
          <span className="text-xs text-slate-400 font-semibold">15</span>
        </button>
        <button 
          className="p-3 rounded-full bg-white text-slate-800 hover:bg-slate-200 transition-colors"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5" />
          ) : (
            <PlayIcon className="w-5 h-5" />
          )}
        </button>
        <button 
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          onClick={skipForward}
        >
          <span className="text-xs text-slate-400 font-semibold">15</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 flex items-center space-x-3">
        <span className="text-xs text-slate-400 w-12 text-right">
          {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
        </span>
        <div 
          className="flex-1 h-1 bg-slate-600 rounded-full cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 w-12">
          {formatDuration((currentEpisode.trackTimeMillis || duration * 1000))}
        </span>
      </div>

      {/* Volume and Speed */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        <button 
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-700 transition-colors"
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeOffIcon className="w-4 h-4 text-slate-400" />
          ) : (
            <VolumeIcon className="w-4 h-4 text-slate-400" />
          )}
          <span className="text-xs text-slate-400">
            {isMuted ? 'Muted' : '100%'}
          </span>
        </button>
        <button 
          className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors text-xs"
          onClick={changePlaybackRate}
        >
          {playbackRate}x
        </button>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentEpisode?.previewUrl}
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {}} // Handled by context
        onPause={() => {}} // Handled by context
        onError={(e) => {
          console.error('Audio error:', e);
        }}
        onLoadStart={() => {
          console.log('Audio loading started');
        }}
        onCanPlay={() => {
          console.log('Audio can start playing');
        }}
        preload="metadata"
      />
    </div>
  );
} 