'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './logo';

// Simple SVG Icon Components
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const QueueListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const MicrophoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HamburgerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface HeaderConfig {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchKeyPress?: (e: React.KeyboardEvent) => void;
  episodeCount?: number;
  hideSearchBar?: boolean;
  onBackClick?: () => void; // Custom back handler
}

interface SidebarContextType {
  navigateToHome: () => void;
  navigateToDiscover: () => void;
  headerConfig: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

// Header Navigation Component
export function HeaderNavigation() {
  const { headerConfig, isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const {
    searchPlaceholder = "Search through over 70 million podcasts and episodes...",
    searchValue,
    onSearchChange,
    onSearchKeyPress,
    episodeCount,
    hideSearchBar = false,
    onBackClick
  } = headerConfig;

  const effectiveSearchValue = searchValue !== undefined ? searchValue : localSearchTerm;
  const effectiveOnChange = onSearchChange || setLocalSearchTerm;

  const effectivePlaceholder = episodeCount 
    ? `Search through ${episodeCount} episodes...`
    : searchPlaceholder;

  const handleBackClick = () => {
    if (onBackClick) {
      // Use custom back handler if provided
      onBackClick();
    } else if (pathname === '/' && (searchValue || localSearchTerm)) {
      // On home page with search active, clear search instead of going back
      if (onSearchChange) {
        onSearchChange('');
      } else {
        setLocalSearchTerm('');
      }
    } else {
      // Default browser back behavior
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      {/* Mobile hamburger menu and navigation */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <HamburgerIcon className="w-5 h-5" />
          )}
        </button>
        
        {/* Mobile navigation buttons */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.forward()}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Go forward"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* Desktop navigation buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.forward()}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search bar - hidden on mobile */}
      {!hideSearchBar && (
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
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

      {/* Desktop auth buttons */}
      <div className="hidden md:flex items-center space-x-3">
        <button className="px-4 py-2 bg-[#3ADEE6] hover:bg-[#2BC5CE] rounded-lg transition-colors text-sm text-slate-900">
          Log in
        </button>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
          Sign up
        </button>
      </div>

      {/* Mobile logo - shown when sidebar is closed */}
      <div className="md:hidden">
        <Logo />
      </div>
    </div>
  );
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const router = useRouter();
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateToHome = () => {
    router.push('/');
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const navigateToDiscover = () => {
    // Add discover route when implemented
    console.log('Navigate to discover');
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const value: SidebarContextType = {
    navigateToHome,
    navigateToDiscover,
    headerConfig,
    setHeaderConfig,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Shared Sidebar Component
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