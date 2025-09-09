import React from 'react';
import { cn } from '@/lib/utils';

export function FieldGroup({
  title,
  help,
  children,
  className,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="text-sm font-medium text-gray-900">{title}</label>
      {help && <p className="text-xs text-gray-500 -mt-1">{help}</p>}
      <div className="min-h-[36px] flex items-center">{children}</div>
    </div>
  );
}
