'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';

interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const todayStr = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    .toISOString()
    .slice(0, 10);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-fit bg-transparent">
          <CalendarDays className="mr-2 h-4 w-4" />
          {dateRange.from} - {dateRange.to}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="mb-2 text-sm font-medium">Select Date Range</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground text-xs">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                className="border-border mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs">To</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                className="border-border mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <Button onClick={() => setIsOpen(false)} className="mt-4 w-full" size="sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
