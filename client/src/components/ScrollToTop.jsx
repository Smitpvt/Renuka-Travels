import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reusable component that resets scroll position to top (0, 0)
 * whenever the React Router route pathname changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
