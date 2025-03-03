import { EventForm } from '@/components/EventForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateEventPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
      <div className="flex justify-center">
        <EventForm />
      </div>
    </div>
  );
}