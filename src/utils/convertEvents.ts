import { CalendarEvent } from "@/types/event";
import moment from 'moment';

interface BigCalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

function generateRecurringEvents(event: CalendarEvent): BigCalendarEvent[] {
  const events: BigCalendarEvent[] = [];
  const startDate = moment(event.date);
  const endDate = event.endDate ? moment(event.endDate) : moment().add(1, 'year');
  
  let currentDate = startDate.clone();
  const eventDuration = moment(`${event.date}T${event.endTime}`).diff(moment(`${event.date}T${event.startTime}`));

  while (currentDate.isSameOrBefore(endDate)) {
    let shouldAdd = false;

    switch (event.recurrence) {
      case 'daily':
        shouldAdd = true;
        break;
      case 'weekly':
        const currentDay = currentDate.format('dddd').toLowerCase();
        if (event.selectedDays && event.selectedDays.includes(currentDay)) {
          shouldAdd = true;
        }
        break;
      case 'monthly':
        if (currentDate.date() === startDate.date()) {
          shouldAdd = true;
        }
        break;
      case 'custom':
        const currentDay2 = currentDate.format('dddd').toLowerCase();
        if (event.selectedDays && event.selectedDays.includes(currentDay2)) {
          if (event.repeatFrequency && event.repeatPeriod) {
            const freq = parseInt(event.repeatFrequency);
            const diffInPeriod = moment.duration(currentDate.diff(startDate));
            const periodsElapsed = Math.floor(diffInPeriod.as(event.repeatPeriod));
            if (periodsElapsed % freq === 0) {
              shouldAdd = true;
            }
          }
        }
        break;
      default:
        shouldAdd = currentDate.isSame(startDate, 'day');
    }

    if (shouldAdd) {
      const eventStart = currentDate.clone().format('YYYY-MM-DD') + 'T' + event.startTime;
      events.push({
        title: event.title,
        start: new Date(eventStart),
        end: new Date(moment(eventStart).add(eventDuration, 'milliseconds').format())
      });
    }

    currentDate.add(1, 'day');
  }

  return events;
}

function convertEvents(events: CalendarEvent[]): BigCalendarEvent[] {
  return events.flatMap(generateRecurringEvents);
}

export default convertEvents;
export type { BigCalendarEvent };
