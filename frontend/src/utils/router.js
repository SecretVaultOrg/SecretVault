import { useState, useEffect, useCallback } from 'react';

// Custom event name for client-side navigation
const NAV_EVENT = 'secretvault-client-navigation';

export const getPath = () => {
  if (typeof window === 'undefined') return '/';
  const path = window.location.pathname || '/';
  return path.toLowerCase();
};

export const getQueryParam = (key) => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

export const navigate = (to, { replace = false, preserveScroll = false } = {}) => {
  if (typeof window === 'undefined') return;
  
  if (replace) {
    window.history.replaceState({}, '', to);
  } else {
    window.history.pushState({}, '', to);
  }

  if (!preserveScroll && !to.includes('#')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.dispatchEvent(new CustomEvent(NAV_EVENT, { detail: { path: to } }));
};

export const useRouter = () => {
  const [currentPath, setCurrentPath] = useState(getPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener(NAV_EVENT, handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener(NAV_EVENT, handleLocationChange);
    };
  }, []);

  const goTo = useCallback((path, opts) => {
    navigate(path, opts);
  }, []);

  return {
    currentPath,
    navigate: goTo,
    isDocs: currentPath.startsWith('/docs') || currentPath.startsWith('/documentation'),
    isLanding: currentPath === '/' || currentPath === '/landing' || currentPath === '/home',
    isFeatures: currentPath.startsWith('/features'),
    isIntegrations: currentPath.startsWith('/integrations'),
    isArchitecture: currentPath.startsWith('/architecture'),
    isSecurity: currentPath.startsWith('/security'),
    isAbout: currentPath.startsWith('/about'),
    isChangelog: currentPath.startsWith('/changelog'),
    isFaq: currentPath.startsWith('/faq'),
    isLogin: currentPath === '/login' || currentPath === '/signin',
    isRegister: currentPath === '/register' || currentPath === '/signup',
    isApp: currentPath === '/app' || currentPath === '/dashboard' || currentPath.startsWith('/workspace'),
  };
};
