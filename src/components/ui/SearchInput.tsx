"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, type, value, onClear, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pl-10", // Add padding for the search icon
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {/* A simple SVG search icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <Cross2Icon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
