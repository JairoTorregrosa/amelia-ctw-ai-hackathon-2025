import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from './loading-spinner';

interface ChartLoadingSkeletonProps {
  title: string;
  icon: React.ReactNode;
  height?: number;
}

export function ChartLoadingSkeleton({ title, icon, height = 250 }: ChartLoadingSkeletonProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="bg-muted/30 flex items-center justify-center rounded-lg"
          style={{ height: `${height}px` }}
        >
          <LoadingSpinner size="lg" text="Cargando datos del gráfico..." />
        </div>
      </CardContent>
    </Card>
  );
}
