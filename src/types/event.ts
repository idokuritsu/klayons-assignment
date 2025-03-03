export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  repeatFrequency?: string;
  repeatPeriod?: 'day' | 'week' | 'month' | 'year';
  selectedDays?: string[];
  createdAt: string;
}