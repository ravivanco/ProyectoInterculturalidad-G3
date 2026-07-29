import * as Notifications from 'expo-notifications';

import { mealSlotLabels, mealSlotOrder } from '../constants/mealSlots';
import type { MealSlot } from '../types/nutritionPlan';

export type MealReminder = {
  slot: MealSlot;
  hour: number;
  minute: number;
};

export const mealReminderSchedule: MealReminder[] = [
  { slot: 'breakfast', hour: 7, minute: 30 },
  { slot: 'morningSnack', hour: 10, minute: 0 },
  { slot: 'lunch', hour: 13, minute: 0 },
  { slot: 'afternoonSnack', hour: 16, minute: 30 },
  { slot: 'dinner', hour: 19, minute: 30 },
];

function formatTime(reminder: MealReminder) {
  return `${String(reminder.hour).padStart(2, '0')}:${String(reminder.minute).padStart(2, '0')}`;
}

export const mealReminderService = {
  async activateLocalMealReminders() {
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Activa el permiso de notificaciones para recibir recordatorios.');
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    const identifiers = await Promise.all(
      mealReminderSchedule.map((reminder) => Notifications.scheduleNotificationAsync({
        content: {
          title: `Recordatorio: ${mealSlotLabels[reminder.slot]}`,
          body: `Es hora de revisar y registrar tu ${mealSlotLabels[reminder.slot].toLowerCase()} del plan.`,
          sound: true,
          data: { mealSlot: reminder.slot },
        },
        trigger: {
          hour: reminder.hour,
          minute: reminder.minute,
          repeats: true,
        },
      })),
    );

    return mealSlotOrder.map((slot) => {
      const reminder = mealReminderSchedule.find((item) => item.slot === slot);
      if (!reminder) throw new Error(`Horario no configurado para ${slot}.`);
      return {
        slot,
        label: mealSlotLabels[slot],
        time: formatTime(reminder),
      };
    }).filter((_, index) => identifiers[index]);
  },
};
