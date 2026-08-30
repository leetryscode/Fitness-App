import * as Notifications from 'expo-notifications';
import { getAllEntries } from '../db/entries';
import { getBooleanSetting, getNumberSetting } from '../db/settings';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function getQuietDays(entries: { timestamp: number }[], now: Date): number {
  if (entries.length === 0) return Infinity;

  const entryDays = new Set(
    entries.map((e) => {
      const d = new Date(e.timestamp);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  let quietDays = 0;
  const check = new Date(now);
  check.setHours(0, 0, 0, 0);

  while (quietDays < 365) {
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
    if (entryDays.has(key)) break;
    quietDays++;
    check.setDate(check.getDate() - 1);
  }

  return quietDays;
}

export async function checkAndScheduleReminder(): Promise<void> {
  const enabled = await getBooleanSetting('reminderEnabled', true);
  if (!enabled) return;

  const threshold = await getNumberSetting('quietDaysThreshold', 3);
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const entries = await getAllEntries();
  const quietDays = getQuietDays(entries, new Date());

  if (quietDays >= threshold) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Gym Recovery',
        body: `It's been ${quietDays} quiet days — log a workout or check your recovery map.`,
      },
      trigger: null,
    });
  }
}

export async function scheduleDailyReminderCheck(): Promise<void> {
  const enabled = await getBooleanSetting('reminderEnabled', true);
  if (!enabled) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Gym Recovery',
      body: 'Check in on your recovery — open the app to see your body map.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 10,
      minute: 0,
    },
  });
}
