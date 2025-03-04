import { CalendarEvent } from "@/types/event";

interface BigCalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

function convertEvents(events: CalendarEvent[]): BigCalendarEvent[] {
  return events.map((event) => ({
    title: event.title,
    start: new Date(`${event.date}T${event.startTime}`),
    end: new Date(`${event.date}T${event.endTime}`)
  }));
}

export default convertEvents;
export type { BigCalendarEvent };
