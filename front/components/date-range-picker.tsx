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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent text-sm sm:w-auto sm:text-base"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {dateRange.from} - {dateRange.to}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90vw] max-w-sm p-0 sm:w-auto sm:max-w-md"
        align="start"
      >
        <div className="space-y-4 p-4">
          <div className="text-sm font-medium">Selecciona el rango de fechas</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-muted-foreground text-xs">Desde</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                className="border-border mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-xs">Hasta</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                className="border-border mt-1 w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <Button onClick={() => setIsOpen(false)} className="w-full text-sm" size="sm">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
