import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 — non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Not Found — Augusto González-Bonorino</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-cobalt mb-6">
            Error / 404
          </div>
          <h1 className="font-serif text-8xl md:text-9xl leading-none">404</h1>
          <div className="hairline-t mt-8 pt-6">
            <p className="text-sm text-muted-foreground mb-1 font-mono">
              {location.pathname}
            </p>
            <p className="text-foreground mb-8">
              This page doesn&rsquo;t exist, or hasn&rsquo;t been written yet.
            </p>
            <a
              href="/"
              className="link-cobalt font-mono text-sm uppercase tracking-[0.14em]"
            >
              ← return home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
