import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { CalendarEvent } from "@/types/event";
import { getEvents, deleteEvent } from "@/lib/event-storage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import BigCalendar from "./BigCalendar";

export function EventList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleDeleteEvent = (id: string) => {
    if (deleteEvent(id)) {
      setEvents(events.filter((event) => event.id !== id));
      toast({
        title: "Event deleted",
        description: "The event has been successfully deleted.",
      });
    }
  };

  const getRecurrenceText = (event: CalendarEvent) => {
    if (event.recurrence === "none") return null;

    if (event.recurrence === "daily") return "Repeats daily";
    if (event.recurrence === "weekly") return "Repeats weekly";
    if (event.recurrence === "monthly") return "Repeats monthly";

    if (event.recurrence === "custom") {
      const frequency = event.repeatFrequency || "1";
      const period = event.repeatPeriod || "week";

      let text = `Repeats every ${frequency} ${period}`;
      if (parseInt(frequency) > 1) text += "s";

      if (event.selectedDays && event.selectedDays.length > 0) {
        const days = event.selectedDays
          .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(", ");
        text += ` on ${days}`;
      }

      return text;
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Calendar Events</h1>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No events found. Create your first event!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <CardDescription>
                  <div className="flex items-center mt-1">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {event.recurrence !== "none" && (
                  <Badge variant="secondary" className="mt-2">
                    {getRecurrenceText(event)}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Created {format(parseISO(event.createdAt), "MMM d, yyyy")}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <BigCalendar events={events} />
    </div>
  );
}
