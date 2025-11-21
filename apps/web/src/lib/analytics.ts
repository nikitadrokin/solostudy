import posthog from 'posthog-js';

export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      posthog.capture(event, properties);
    }
  },

  taskCreated: (title: string, isMobile: boolean) => {
    analytics.track('task_created', {
      task_length: title.length,
      platform: isMobile ? 'mobile' : 'desktop'
    });
  },

  taskCompleted: (taskAgeDays: number) => {
    analytics.track('task_completed', {
      task_age_days: taskAgeDays
    });
  },

  taskDeleted: (wasCompleted: boolean, taskAgeDays: number) => {
    analytics.track('task_deleted', {
      was_completed: wasCompleted,
      task_age_days: taskAgeDays
    });
  },

  userSignedIn: (email: string) => {
    posthog.identify(email);
    analytics.track('user_signed_in', {
      method: 'email',
      email_domain: email.split('@')[1]
    });
  },

  userSignedUp: (email: string) => {
    posthog.identify(email);
    analytics.track('user_signed_up', {
      method: 'email'
    });
  },

  focusTimerStarted: () => {
    analytics.track('focus_timer_started');
  },

  focusSessionCompleted: (focusTimeSeconds: number) => {
    analytics.track('focus_session_completed', {
      focus_time_seconds: focusTimeSeconds
    });
  }
};
