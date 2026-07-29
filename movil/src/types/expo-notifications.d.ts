declare module 'expo-notifications' {
  export type NotificationPermissionsStatus = {
    granted: boolean;
  };

  export type NotificationTriggerInput = {
    hour?: number;
    minute?: number;
    repeats?: boolean;
  };

  export function requestPermissionsAsync(): Promise<NotificationPermissionsStatus>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function scheduleNotificationAsync(input: {
    content: {
      title: string;
      body: string;
      sound?: boolean | string;
      data?: Record<string, unknown>;
    };
    trigger: NotificationTriggerInput;
  }): Promise<string>;
}
