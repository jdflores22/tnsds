import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Warns the user before they navigate away (in-app or by closing the tab)
 * while there are unsaved changes.
 *
 * @param when - true when the form has unsaved edits.
 * @param message - confirmation prompt shown for in-app navigation.
 */
export function useUnsavedChanges(
  when: boolean,
  message = 'You have unsaved changes. Leave without saving?',
) {
  // Block in-app route changes (React Router).
  const blocker = useBlocker(when);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm(message);
      if (confirmed) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker, message]);

  // Block full-page unload / tab close / refresh.
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);
}
