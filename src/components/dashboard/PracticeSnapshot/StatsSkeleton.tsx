import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export const StatsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
);
