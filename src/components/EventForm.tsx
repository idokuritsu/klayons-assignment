import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, X } from "lucide-react";
import { saveEvent } from "@/lib/event-storage";
import { useToast } from "@/hooks/use-toast";

export function EventForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [recurrence, setRecurrence] = useState("none");
  const [recurrenceDialogOpen, setRecurrenceDialogOpen] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("1");
  const [repeatPeriod, setRepeatPeriod] = useState("week");
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const handleDayToggle = (day: keyof typeof selectedDays) => {
    setSelectedDays({
      ...selectedDays,
      [day]: !selectedDays[day],
    });
  };

  const handleCreateEvent = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an event title",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const eventData = {
      title,
      date: date ? format(date, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      startTime,
      endTime,
      recurrence: recurrence as
        | "none"
        | "daily"
        | "weekly"
        | "monthly"
        | "custom",
      repeatFrequency: recurrence !== "none" ? repeatFrequency : undefined,
      repeatPeriod:
        recurrence !== "none"
          ? (repeatPeriod as "day" | "week" | "month" | "year")
          : undefined,
      selectedDays:
        recurrence !== "none"
          ? Object.entries(selectedDays)
              .filter(([_, selected]) => selected)
              .map(([day]) => day)
          : undefined,
    };

    console.log(eventData);
    saveEvent(eventData);

    toast({
      title: "Success",
      description: "Event created successfully!",
    });

    navigate("/");
  };

  const handleSaveRecurrence = () => {
    setRecurrence("custom");
    setRecurrenceDialogOpen(false);
  };

  const openRecurrenceDialog = () => {
    setRecurrenceDialogOpen(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Calendar Event</CardTitle>
        <CardDescription>
          Fill in the details for your new event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recurrence">Recurrence</Label>
          <div className="flex gap-2">
            <Select
              value={recurrence}
              onValueChange={(value) => {
                setRecurrence(value);
                if (value === "custom") {
                  openRecurrenceDialog();
                }
              }}
            >
              <SelectTrigger id="recurrence" className="flex-1">
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {recurrence !== "none" && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  if (recurrence === "custom") {
                    openRecurrenceDialog();
                  } else {
                    setRecurrence("none");
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Dialog
          open={recurrenceDialogOpen}
          onOpenChange={setRecurrenceDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Repeat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-20">Start</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "MM/dd/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <Label className="w-20">Repeat every</Label>
                <Select
                  value={repeatFrequency}
                  onValueChange={setRepeatFrequency}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="1" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={repeatPeriod} onValueChange={setRepeatPeriod}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">day</SelectItem>
                    <SelectItem value="week">week</SelectItem>
                    <SelectItem value="month">month</SelectItem>
                    <SelectItem value="year">year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                    const dayKey = [
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ][index] as keyof typeof selectedDays;

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-center w-8 h-8 rounded-full cursor-pointer ${
                          selectedDays[dayKey]
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                        onClick={() => handleDayToggle(dayKey)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Occurs every {selectedDays.thursday ? "Thursday" : "day"}{" "}
                  until
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-20">End date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      {endDate ? format(endDate, "MM/dd/yyyy") : "No end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      fromDate={date}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Discard
                </Button>
              </DialogClose>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setRecurrence("none");
                    setRecurrenceDialogOpen(false);
                  }}
                >
                  Remove
                </Button>
                <Button type="button" onClick={handleSaveRecurrence}>
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleCreateEvent}>
          Create Event
        </Button>
      </CardFooter>
    </Card>
  );
}
