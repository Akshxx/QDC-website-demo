// Custom navigation events to help with page transitions
export type NavigationEventType = 'start' | 'complete';

export interface NavigationEvent extends Event {
  type: string;
  detail?: {
    page: string;
  };
}

export function emitNavigationEvent(type: NavigationEventType, page: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('qdc-navigation', { 
        detail: { type, page }
      })
    );
  }
}

export function listenToNavigationEvents(
  callback: (event: NavigationEvent) => void
) {
  if (typeof window !== 'undefined') {
    window.addEventListener('qdc-navigation', callback as EventListener);
    return () => window.removeEventListener('qdc-navigation', callback as EventListener);
  }
  return () => {};
}
