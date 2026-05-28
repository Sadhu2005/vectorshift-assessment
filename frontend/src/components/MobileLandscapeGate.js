import { useCallback, useEffect, useState } from 'react';

const MOBILE_MEDIA = '(max-width: 896px), (max-height: 520px) and (pointer: coarse)';

const useMobileLayout = () => {
  const [layout, setLayout] = useState({
    isMobile: false,
    isPortrait: false,
    isFullscreen: false,
  });

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_MEDIA);
    const portraitMq = window.matchMedia('(orientation: portrait)');

    const update = () => {
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const narrow = window.innerWidth <= 896 || window.innerHeight <= 520;
      const isMobile = mobileMq.matches || (touchDevice && narrow);
      setLayout({
        isMobile,
        isPortrait: portraitMq.matches,
        isFullscreen: Boolean(
          document.fullscreenElement || document.webkitFullscreenElement
        ),
      });
    };

    update();
    mobileMq.addEventListener('change', update);
    portraitMq.addEventListener('change', update);
    window.addEventListener('resize', update);
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);

    return () => {
      mobileMq.removeEventListener('change', update);
      portraitMq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);

  return layout;
};

const requestFullscreen = async () => {
  const el = document.documentElement;
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    return;
  }
  if (el.requestFullscreen) {
    await el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    await el.webkitRequestFullscreen();
  }
};

const lockLandscape = async () => {
  const orientation = window.screen?.orientation;
  if (!orientation?.lock) return;
  await orientation.lock('landscape');
};

const RotateOverlay = () => (
  <div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 px-6 text-center text-white"
    role="dialog"
    aria-modal="true"
    aria-labelledby="rotate-title"
  >
    <div
      className="mb-6 animate-pulse text-6xl"
      aria-hidden="true"
      style={{ transform: 'rotate(90deg)' }}
    >
      📱
    </div>
    <h2 id="rotate-title" className="text-xl font-bold">
      Rotate your phone
    </h2>
    <p className="mt-3 max-w-sm text-sm text-slate-300">
      The pipeline editor works best in{' '}
      <span className="font-semibold text-white">landscape</span>. Turn your
      device sideways to continue.
    </p>
  </div>
);

const FullscreenPrompt = ({ onEnter, hint }) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <div className="pointer-events-auto flex max-w-md flex-col items-center gap-2 rounded-xl border border-indigo-200/40 bg-slate-900/95 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
      <p className="text-xs font-medium text-slate-200">
        For the best editing experience on mobile
      </p>
      <button
        type="button"
        onClick={onEnter}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 active:scale-[0.98]"
      >
        Enter fullscreen (landscape)
      </button>
      {hint && (
        <p className="text-[10px] leading-snug text-slate-400">{hint}</p>
      )}
    </div>
  </div>
);

export const MobileLandscapeGate = ({ children }) => {
  const { isMobile, isPortrait, isFullscreen } = useMobileLayout();
  const [hint, setHint] = useState(null);

  const enterFullscreenLandscape = useCallback(async () => {
    setHint(null);
    try {
      await requestFullscreen();
      try {
        await lockLandscape();
      } catch {
        /* Orientation lock often requires installed PWA on iOS */
      }
    } catch {
      setHint(
        'Could not enter fullscreen. Allow fullscreen in your browser, or rotate to landscape and use the editor.'
      );
    }
  }, []);

  if (isMobile && isPortrait) {
    return <RotateOverlay />;
  }

  const showFullscreenPrompt = isMobile && !isPortrait && !isFullscreen;

  return (
    <>
      {showFullscreenPrompt && (
        <FullscreenPrompt onEnter={enterFullscreenLandscape} hint={hint} />
      )}
      <div className="mobile-editor flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </>
  );
};
