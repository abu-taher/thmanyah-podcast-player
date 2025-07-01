'use client';

import Image from 'next/image';
import { useAudio } from '../../contexts/audio-context';
import {
  PlayIcon,
  PauseIcon,
  VolumeIcon,
  VolumeOffIcon,
  XMarkIcon,
} from '../ui/icons';
import { formatDuration } from '../../lib/utils/format';



export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    isMuted,
    audioRef,
    setCurrentEpisode,
    togglePlayPause,
    skipBackward,
    skipForward,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgressClick,
    changePlaybackRate,
    toggleMute,
    handlePlay,
    handlePause,
  } = useAudio();

  // Close player function - stops audio and clears current episode
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentEpisode(null);
  };

  // Don't render if no episode is selected
  if (!currentEpisode) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-slate-800 border-t border-slate-700 p-4 z-50">
      {/* Desktop Layout - Single Row (Large screens without close button, Medium screens with close button) */}
      <div className="hidden md:flex lg:hidden items-center space-x-4">
        {/* Episode Info */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Image
            src={currentEpisode.artworkUrl600 || currentEpisode.artworkUrl100 || currentEpisode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
            alt={currentEpisode.trackName}
            width={48}
            height={48}
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

        {/* Close Button */}
        <button 
          className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          onClick={closePlayer}
          aria-label="Close player"
        >
          <XMarkIcon className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Desktop Layout - Single Row (Large screens without close button) */}
      <div className="hidden lg:flex items-center space-x-4">
        {/* Episode Info */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <Image
            src={currentEpisode.artworkUrl600 || currentEpisode.artworkUrl100 || currentEpisode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
            alt={currentEpisode.trackName}
            width={48}
            height={48}
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
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="md:hidden">
        {/* Episode Info Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Image
              src={currentEpisode.artworkUrl600 || currentEpisode.artworkUrl100 || currentEpisode.artworkUrl60 || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&crop=center'}
              alt={currentEpisode.trackName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate text-sm">{currentEpisode.trackName}</h3>
              <p className="text-xs text-slate-400 truncate">{currentEpisode.collectionName}</p>
            </div>
          </div>
          <button 
            className="p-2 rounded-full hover:bg-slate-700 transition-colors flex-shrink-0 ml-2"
            onClick={closePlayer}
            aria-label="Close player"
          >
            <XMarkIcon className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Progress Bar Row */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs text-slate-400 w-10 text-right">
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
          <span className="text-xs text-slate-400 w-10">
            {formatDuration((currentEpisode.trackTimeMillis || duration * 1000))}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
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
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </button>
            <button 
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              onClick={skipForward}
            >
              <span className="text-xs text-slate-400 font-semibold">15</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-slate-700 transition-colors"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeOffIcon className="w-4 h-4 text-slate-400" />
              ) : (
                <VolumeIcon className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button 
              className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors text-xs"
              onClick={changePlaybackRate}
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        style={{ display: 'none' }}
      >
        {currentEpisode?.previewUrl && (
          <source src={currentEpisode.previewUrl} type="audio/mpeg" />
        )}
        Your browser does not support the audio element.
      </audio>
    </div>
  );
} 