import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';
import { TOUR_STEPS } from './tourSteps';

const CARD_WIDTH = 340;
const CARD_HEIGHT = 230;
const SPOT_PADDING = 6;
const GUTTER = 16;

interface Spot {
  top: number;
  left: number;
  width: number;
  height: number;
}

const getCardStyle = (spot: Spot | null): React.CSSProperties => {
  const { innerWidth: vw, innerHeight: vh } = window;
  const width = Math.min(CARD_WIDTH, vw - GUTTER * 2);
  if (!spot) return { width, left: (vw - width) / 2, top: (vh - CARD_HEIGHT) / 2 };

  const left = Math.min(Math.max(GUTTER, spot.left + spot.width / 2 - width / 2), vw - width - GUTTER);
  const below = spot.top + spot.height + 12;
  if (vh - below >= CARD_HEIGHT) return { width, left, top: below };
  if (spot.top - 12 >= CARD_HEIGHT) return { width, left, bottom: vh - spot.top + 12 };
  return { width, left, bottom: GUTTER * 5 };
};

interface TourProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  onClose: () => void;
}

const Tour: React.FC<TourProps> = ({ activePage, onNavigate, onClose }) => {
  const { t } = usePreferences();
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState<Spot | null>(null);
  const step = TOUR_STEPS[index];
  const isLast = index === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (step.page !== activePage) onNavigate(step.page);
  }, [step, activePage, onNavigate]);

  useEffect(() => {
    let frame = 0;
    let attempts = 0;
    let element: Element | undefined;

    const measure = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const top = Math.max(0, rect.top - SPOT_PADDING);
      const bottom = Math.min(window.innerHeight, rect.bottom + SPOT_PADDING);
      setSpot({
        top,
        left: rect.left - SPOT_PADDING,
        width: rect.width + SPOT_PADDING * 2,
        height: bottom - top,
      });
    };

    // The target may belong to a page that is still rendering, and only one of the two layouts is visible
    const locate = () => {
      element = Array.from(document.querySelectorAll(`[data-tour="${step.target}"]`))
        .find((el) => el.getClientRects().length > 0);
      if (element) {
        element.scrollIntoView({ block: 'center', behavior: 'instant' });
        measure();
      } else if (attempts++ < 60) {
        frame = requestAnimationFrame(locate);
      } else {
        setSpot(null);
      }
    };

    frame = requestAnimationFrame(locate);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      {spot ? (
        <div
          className="fixed rounded-xl pointer-events-none transition-all duration-200 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
          style={spot}
        />
      ) : (
        <div className="fixed inset-0 bg-black/60" />
      )}
      <div role="dialog" aria-modal="true" aria-label={t(step.title)} className="card fixed p-4 shadow-xl animate-rise" style={getCardStyle(spot)} key={index}>
        <p className="text-xs font-medium text-accent mb-1">
          {t('tour.step', { current: index + 1, total: TOUR_STEPS.length })}
        </p>
        <h2 className="font-semibold mb-1">{t(step.title)}</h2>
        <p className="text-sm text-muted mb-4">{t(step.body)}</p>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="text-sm text-subtle hover:text-ink py-2 mr-auto">{t('common.skip')}</button>
          {index > 0 && (
            <button onClick={() => setIndex(index - 1)} className="btn-secondary">{t('common.back')}</button>
          )}
          <button onClick={() => (isLast ? onClose() : setIndex(index + 1))} className="btn-primary">
            {t(isLast ? 'common.finish' : 'common.next')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Tour;
