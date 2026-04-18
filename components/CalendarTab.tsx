"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Filter, Layers, Clock, TrendingUp, MoreHorizontal, Users
} from "lucide-react";
import EventModal from "@/components/calendar/EventModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-custom.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import CalendarNotificationManager from "@/components/calendar/CalendarNotificationManager";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Mock user for "Welcome back"
const GREETINGS = [
  "Time to organize your success.",
  "Plan your work, work your plan.",
  "Focus on what matters today.",
  "Your schedule looks promising."
];

// --- HELPER COMPONENTS DEFINED OUTSIDE TO PREVENT RE-RENDERS ---

const getEventIcon = (type: string) => {
  switch (type) {
    case 'work': return <div className="p-0.5"><Clock size={12} /></div>;
    case 'meeting': return <div className="p-0.5"><Users size={12} /></div>;
    case 'personal': return <div className="p-0.5"><CalendarIcon size={12} /></div>;
    case 'health': return <div className="p-0.5"><TrendingUp size={12} /></div>;
    default: return <div className="w-1.5 h-1.5 rounded-full bg-white/50" />;
  }
};

const CustomEventComponent = ({ event }: any) => {
  // Safety check
  if (!event) return null;

  return (
    <div
      className="h-full w-full px-2 py-1 rounded-lg text-xs font-semibold overflow-hidden border border-white/20 backdrop-blur-sm transition-all hover:scale-[1.02] hover:z-10 shadow-sm flex items-center gap-1.5"
      style={{
        backgroundColor: event.color || '#4F46E5',
        color: 'white',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
      }}
    >
      {getEventIcon(event.type)}
      <span className="truncate">{event.title}</span>
    </div>
  );
};

const CustomToolbarComponent = (props: any) => {
  const { onNavigate, onView, view, label } = props;

  const goToBack = () => onNavigate("PREV");
  const goToNext = () => onNavigate("NEXT");
  const goToCurrent = () => onNavigate("TODAY");

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mb-8 gap-4 w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex bg-white/40 backdrop-blur-md rounded-2xl p-1.5 border border-white/50 shadow-sm shrink-0 w-full md:w-auto justify-between md:justify-start">
          <button onClick={goToBack} className="p-2 hover:bg-white/80 rounded-xl transition-all text-slate-600 hover:text-indigo-600">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToCurrent} className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-700 transition-colors">
            Today
          </button>
          <button onClick={goToNext} className="p-2 hover:bg-white/80 rounded-xl transition-all text-slate-600 hover:text-indigo-600">
            <ChevronRight size={20} />
          </button>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight text-center md:text-left truncate w-full md:w-auto">
          {label}
        </h2>
      </div>

      <div className="flex bg-slate-100/50 backdrop-blur-md rounded-2xl p-1.5 border border-white/50 shadow-inner w-full lg:w-auto overflow-x-auto hide-scrollbar shrink-0">
        {Object.values(Views).map((name) => (
          <button
            key={name as string}
            onClick={() => onView(name)}
            className={`relative px-4 py-2 text-[10px] md:text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap z-10 flex-1 lg:flex-none text-center ${view === name ? "text-white shadow-lg shadow-indigo-500/30" : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"}`}
          >
            {view === name && (
              <motion.div
                layoutId="view-tab"
                className="absolute inset-0 bg-indigo-600 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {(name as string).replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};


const eventStyleGetter = (event: any) => {
  return {
    style: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0
    }
  };
};

// --- MAIN COMPONENT ---

export default function CalendarTab() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setGreeting(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
  }, []);

  // Sidebar State
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [upcomingMenuOpen, setUpcomingMenuOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Memoize components to avoid re-renders
  const { components } = useMemo(() => ({
    components: {
      toolbar: CustomToolbarComponent,
      event: CustomEventComponent
    }
  }), []);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const data = await res.json();
        // Ensure data is array
        if (!Array.isArray(data)) {
          console.error("API returned non-array", data);
          return;
        }
        const parsed = data.map((e: any) => ({
          ...e,
          id: e.id || e._id, // Normalize ID for keys
          start: new Date(e.startTime || e.start),
          end: new Date(e.endTime || e.end),
        }));
        setEvents(parsed);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter Logic
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(e => activeFilters.includes(e.type || 'work')));
    }
  }, [events, activeFilters]);

  // Filter Counts
  const getFilterCount = (type: string) => {
    return events.filter(e => (e.type || 'work') === type).length;
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setModalOpen(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    try {
      const method = eventData.id ? "PUT" : "POST";
      // Map start/end to startTime/endTime correctly
      const payload = {
        ...eventData,
        startTime: eventData.startTime || eventData.start,
        endTime: eventData.endTime || eventData.end
      };

      const res = await fetch("/api/calendar", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchEvents();
      }
    } catch (error) {
      console.error("Failed to save event", error);
    }
  };

  const upcomingEvents = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return events
      .filter(e => new Date(e.start) >= startOfDay)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5);
  }, [events]);

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-140px)] gap-6 p-2">
      <CalendarNotificationManager events={events} />

      {/* SIDEBAR */}
      <div className="w-full xl:w-80 flex flex-col gap-5 shrink-0 overflow-y-auto hide-scrollbar pb-4">

        {/* Profile / Greeting Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200/50 group shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/20 rounded-full -ml-16 -mb-16 blur-3xl group-hover:bg-rose-500/30 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-3xl font-black tracking-tight mb-2 truncate leading-tight">
                  Hello, <br />
                  <span className="text-indigo-200">{session?.user?.name?.split(' ')[0] || 'User'}</span>
                </h3>
                {isMounted && (
                  <p className="text-indigo-100/80 text-sm font-medium border-l-2 border-indigo-400/50 pl-3 line-clamp-1">
                    {greeting}
                  </p>
                )}
              </div>
              {isMounted && (
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-all duration-300">
                  <span className="text-xs font-bold uppercase text-indigo-200 tracking-wider">{format(new Date(), 'MMM')}</span>
                  <span className="text-2xl font-black leading-none">{format(new Date(), 'd')}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold bg-black/20 rounded-xl p-3 backdrop-blur-sm w-fit max-w-full">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">{events.filter(e => new Date(e.start) >= new Date()).length} Upcoming Events</span>
            </div>
          </div>
        </div>

        {/* Create Event Button */}
        <button
          onClick={() => { setSelectedEvent(null); setSelectedSlot(null); setModalOpen(true); }}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-300 hover:shadow-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <div className="p-1 bg-white/20 rounded-lg">
            <Plus size={20} className="text-white" />
          </div>
          Create Event
        </button>

        {/* Daily Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Layers size={40} className="text-slate-800" />
            </div>
            <div className="font-black text-3xl text-slate-800 mb-1">
              {events.filter(e => new Date(e.start).toDateString() === new Date().toDateString()).length}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasks</div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Clock size={40} className="text-indigo-600" />
            </div>
            <div className="font-black text-3xl text-indigo-600 mb-1">
              {(() => {
                const todayEvents = events.filter(e => new Date(e.start).toDateString() === new Date().toDateString());
                const hours = todayEvents.reduce((acc, e) => {
                  return acc + (new Date(e.end).getTime() - new Date(e.start).getTime()) / (1000 * 60 * 60);
                }, 0);
                return Math.round(hours * 10) / 10;
              })()}h
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Busy</div>
          </div>
        </div>

        {/* Filter Pills - NEW MODERN DESIGN */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-700 text-sm uppercase tracking-wide">
              <Filter size={16} className="text-slate-400" /> Filters
            </h4>
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 px-2 py-1 rounded-lg transition-colors"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['work', 'meeting', 'personal', 'health', 'social'].map(type => {
              const count = getFilterCount(type);
              const isActive = activeFilters.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)} // Toggle filter
                  className={`relative p-3 rounded-2xl text-left border transition-all duration-300 group overflow-hidden ${isActive
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border-transparent shadow-lg shadow-slate-900/20'
                    : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-sm'
                    }`}
                >
                  {/* Background Glow for Active */}
                  {isActive && <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full blur-xl -mr-4 -mt-4" />}

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'bg-slate-300 group-hover:bg-indigo-400 transition-colors'}`} />
                      <span className="text-xs font-bold capitalize">{type}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors'}`}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1 relative">
          <div className="flex justify-between items-center mb-4">
            <h4 className="flex items-center gap-2 font-bold text-slate-800">
              <TrendingUp size={18} className="text-indigo-500" /> Upcoming
            </h4>
            <div className="relative">
              <button
                onClick={() => setUpcomingMenuOpen(!upcomingMenuOpen)}
                className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>

              <AnimatePresence>
                {upcomingMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUpcomingMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-2"
                    >
                      <button onClick={fetchEvents} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium transition-colors">
                        Refresh List
                      </button>
                      <button onClick={() => setView(Views.AGENDA)} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium transition-colors">
                        View Full Agenda
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No upcoming events for today.
              </div>
            ) : (
              upcomingEvents.map(e => (
                <div
                  key={e.id}
                  onClick={() => handleSelectEvent(e)}
                  className="group flex gap-3 items-start p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer"
                >
                  <div className="flex flex-col items-center min-w-[3rem] bg-slate-100 rounded-xl p-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <span className="text-xs font-bold text-slate-500 uppercase">{format(e.start, 'MMM')}</span>
                    <span className="text-lg font-black text-slate-800">{format(e.start, 'dd')}</span>
                  </div>
                  <div className="flex-1 pt-1">
                    <h5 className="font-bold text-slate-700 text-sm leading-tight mb-1">{e.title}</h5>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                      {format(e.start, 'h:mm a')}
                    </div>
                  </div>
                </div>
              ))
            )}

            <button className="w-full py-3 text-xs font-bold text-slate-500 border border-slate-100 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors mt-2">
              View All Schedule
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CALENDAR */}
      <div className="flex-1 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-indigo-100/50 p-6 md:p-8 flex flex-col overflow-hidden relative z-0 h-full">
        {/* Floating gradient in background for depth */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={components}
          eventPropGetter={eventStyleGetter}
          popup
          tooltipAccessor={e => e?.title || 'Event'}
        />
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        initialDate={selectedSlot?.start}
        initialEvent={selectedEvent}
      />

      {/* Mobile Add Button */}
      <button
        onClick={() => { setSelectedEvent(null); setSelectedSlot(null); setModalOpen(true); }}
        className="md:hidden fixed bottom-8 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
