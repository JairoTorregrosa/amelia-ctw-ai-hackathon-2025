/**
 * Centralized UI component types
 */

import { ReactNode } from 'react';

// Chart types
export type ChartDataPoint = {
  name: string;
  value: number;
  date?: string;
  [key: string]: unknown;
};

export type ChartConfig = {
  [k in string]: {
    label?: ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
};

// Date range types
export interface DateRange {
  from: string;
  to: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Common prop patterns
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Modal/Dialog types
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

// Toast types (re-exported from ui component)
export type { ToastProps, ToastActionElement } from '@/components/ui/toast';
