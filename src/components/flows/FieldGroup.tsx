import React from 'react';

export function FieldGroup({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-900">{title}</label>
      {help && <p className="text-xs text-gray-500 -mt-1">{help}</p>}
      <div className="min-h-[40px] flex items-center">{children}</div>
    </div>
  );
}
