export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function checkAndScheduleReminder(): Promise<void> {
  // Reminders disabled for initial TestFlight build.
}

export async function scheduleDailyReminderCheck(): Promise<void> {
  // Reminders disabled for initial TestFlight build.
}
