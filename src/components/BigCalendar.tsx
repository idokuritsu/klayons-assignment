import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import convertEvents from "@/utils/convertEvents";
import { CalendarEvent } from "@/types/event";

const localizer = momentLocalizer(moment);

interface BigCalendarProps {
  events: CalendarEvent[];
}

const BigCalendar = ({ events }: BigCalendarProps) => {
  const calendarEvents = convertEvents(events);
  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      style={{ height: 500 }}
      startAccessor="start"
      endAccessor="end"
    />
  );
};

export default BigCalendar;
