"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PracticeSession } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

interface CalendarStreakProps {
  sessions: PracticeSession[];
}

const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  
  // Adjust to start from Monday (0 = Sunday, 1 = Monday, etc.)
  const startOffset = (firstDay.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - startOffset);
  
  const days = [];
  const current = new Date(startDate);
  
  while (current <= endDate || days.length < 42) {
    days.push({
      date: new Date(current),
      dateString: current.toISOString().slice(0, 10),
      isCurrentMonth: current.getMonth() === month,
      isToday: current.toDateString() === new Date().toDateString(),
    });
    current.setDate(current.getDate() + 1);
    
    if (days.length >= 42) break;
  }
  
  return days;
};

export const CalendarStreak: React.FC<CalendarStreakProps> = ({ sessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarDays(year, month);
  const sessionDates = new Set(sessions.map((s) => s.completedAt.slice(0, 10)));
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleDateClick = (dateString: string, isCurrentMonth: boolean, isPastDate: boolean) => {
    if (!isCurrentMonth || isPastDate) return;
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };
  
  const scheduleSession = (dateString: string) => {
    // TODO: Implement session scheduling
    console.log('Schedule session for', dateString);
    setSelectedDate(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Practice Calendar
          </CardTitle>
          <Button 
            onClick={goToToday} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={goToPreviousMonth}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {monthNames[month]} {year}
          </h3>
          <Button
            onClick={goToNextMonth}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-xs font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isPracticeDay = sessionDates.has(day.dateString);
            const isPastDate = day.date < new Date(new Date().setHours(0, 0, 0, 0));
            const isFutureDate = day.date > new Date();
            const isSelected = selectedDate === day.dateString;
            
            return (
              <div
                key={day.dateString}
                className={cn(
                  'relative p-2 h-10 flex items-center justify-center text-sm cursor-pointer rounded-md transition-colors',
                  // Base styles
                  day.isCurrentMonth 
                    ? 'text-foreground hover:bg-accent' 
                    : 'text-muted-foreground/40',
                  // Today highlight
                  day.isToday && 'ring-2 ring-primary ring-inset',
                  // Practice day highlight
                  isPracticeDay && 'bg-primary text-primary-foreground font-semibold',
                  // Future date scheduling
                  isFutureDate && day.isCurrentMonth && 'hover:bg-primary/10',
                  // Selected state
                  isSelected && 'ring-2 ring-accent-foreground',
                  // Disabled past dates
                  isPastDate && !isPracticeDay && 'cursor-default'
                )}
                onClick={() => handleDateClick(day.dateString, day.isCurrentMonth, isPastDate && !isFutureDate)}
              >
                {day.date.getDate()}
                
                {/* Practice indicator dot */}
                {isPracticeDay && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full opacity-70" />
                )}
                
                {/* Future session scheduling button */}
                {isSelected && isFutureDate && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        scheduleSession(day.dateString);
                      }}
                      size="sm"
                      className="h-6 px-2 text-xs bg-background border shadow-md hover:shadow-lg"
                      variant="outline"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Schedule
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span>Practice Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border-2 border-primary rounded-sm"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-accent rounded-sm"></div>
            <span>Future Sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarStreak;
