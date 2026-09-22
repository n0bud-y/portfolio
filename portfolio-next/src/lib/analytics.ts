/**
 * Analytics-ready event layer. No third-party analytics is installed.
 *
 * Any element with `data-track="<event>"` (and optional `data-track-label`) fires
 * `track()` on click via PageEffects. Listen for events with:
 *   window.addEventListener('portfolio:track', (e) => console.log(e.detail));
 * …or forward them to Plausible / GA / PostHog inside the listener later.
 */
export type AnalyticsEvent =
  | 'resume_click'
  | 'project_open'
  | 'contact_click'
  | 'linkedin_click'
  | 'github_click';

export function track(event: AnalyticsEvent, props: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('portfolio:track', { detail: { event, ...props } }));
  if (process.env.NODE_ENV === 'development') console.debug('[track]', event, props);
}
