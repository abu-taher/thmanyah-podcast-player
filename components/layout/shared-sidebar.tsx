'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../../contexts/sidebar-context';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  QueueListIcon,
  MicrophoneIcon,
  ClockIcon,
  XMarkIcon,
} from '../ui/icons';
import Logo from '../../lib/logo';

export function SharedSidebar() {
  const pathname = usePathname();
  const { 
    navigateToHome, 
    navigateToDiscover, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    headerConfig 
  } = useSidebar();

  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const {
    searchPlaceholder = "Search through over 70 million podcasts and episodes...",
    searchValue,
    onSearchChange,
    onSearchKeyPress,
    episodeCount,
    hideSearchBar = false
  } = headerConfig;

  const effectiveSearchValue = searchValue !== undefined ? searchValue : localSearchTerm;
  const effectiveOnChange = onSearchChange || setLocalSearchTerm;

  const effectivePlaceholder = episodeCount 
    ? `Search through ${episodeCount} episodes...`
    : searchPlaceholder;

  const sidebarItems = [
    { 
      icon: HomeIcon, 
      label: 'Home', 
      active: pathname === '/',
      onClick: navigateToHome
    },
    { 
      icon: MagnifyingGlassIcon, 
      label: 'Discover', 
      active: pathname === '/discover',
      onClick: navigateToDiscover
    },
  ];

  const bottomSidebarItems = [
    { icon: QueueListIcon, label: 'My Queue', active: false },
    { icon: MicrophoneIcon, label: 'My Podcasts', active: false },
    { icon: ClockIcon, label: 'Recents', active: false }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50
        w-64 bg-slate-900 flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 custom-scrollbar mobile-scroll
      `}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <Logo />
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden px-4 py-2 border-b border-slate-700">
          {/* Mobile Search */}
          {!hideSearchBar && (
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={effectivePlaceholder}
                  value={effectiveSearchValue}
                  onChange={(e) => effectiveOnChange(e.target.value)}
                  onKeyDown={onSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          )}

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full px-4 py-2 bg-[#3ADEE6] hover:bg-[#2BC5CE] rounded-lg transition-colors text-sm text-slate-900"
            >
              Log in
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                  item.active 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3 px-3">
              Your Stuff
            </div>
            <div className="space-y-1">
              {bottomSidebarItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 text-xs text-slate-500">
          <div>Podbay v2.9.6 by Fancy Soups.</div>
          <div className="mt-1">
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="mx-1">·</span>
            <span className="hover:text-white cursor-pointer">All Podcasts</span>
          </div>
        </div>
      </div>
    </>
  );
} 