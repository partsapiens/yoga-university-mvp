import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import toast from 'react-hot-toast';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  if (typeof v === 'string') return v.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  return [];
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

export function toastSuccess(message: string) {
  toast.success(message, {
    duration: 2000,
    position: 'bottom-center',
  });
}

export function toastError(message: string) {
  toast.error(message, {
    duration: 3000,
    position: 'bottom-center',
  });
}
