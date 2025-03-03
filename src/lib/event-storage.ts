import { CalendarEvent } from "@/types/event";

const EVENTS_STORAGE_KEY = "calendar_events";

export const getEvents = (): CalendarEvent[] => {
  const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (!eventsJson) return [];

  try {
    return JSON.parse(eventsJson);
  } catch (error) {
    console.error("Failed to parse events from localStorage:", error);
    return [];
  }
};

export const saveEvent = (
  event: Omit<CalendarEvent, "id" | "createdAt">
): CalendarEvent => {
  const events = getEvents();

  const newEvent: CalendarEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

  return newEvent;
};

export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const filteredEvents = events.filter((event) => event.id !== id);

  if (filteredEvents.length === events.length) {
    return false;
  }

  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
  return true;
};

export const updateEvent = (updatedEvent: CalendarEvent): boolean => {
  const events = getEvents();
  const index = events.findIndex((event) => event.id === updatedEvent.id);

  if (index === -1) {
    return false;
  }

  events[index] = updatedEvent;
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  return true;
};
