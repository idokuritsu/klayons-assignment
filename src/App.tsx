import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EventsPage } from "@/pages/EventsPage";
import { CreateEventPage } from "@/pages/CreateEventPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/create" element={<CreateEventPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
