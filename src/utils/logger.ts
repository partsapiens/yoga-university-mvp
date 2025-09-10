interface ErrorLogOptions {
  context?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

export function logError(error: Error | string, options: ErrorLogOptions = {}) {
  const timestamp = new Date().toISOString();
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const logEntry = {
    timestamp,
    message: errorMessage,
    stack: errorStack,
    context: options.context || 'unknown',
    userId: options.userId,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    ...options.additionalData,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logEntry);
  }

  // In production, you would integrate with services like:
  // - Sentry: Sentry.captureException(error, { extra: logEntry });
  // - LogRocket: LogRocket.captureException(error);
  // - Custom API endpoint for error collection

  // For now, store in localStorage for debugging
  if (typeof window !== 'undefined') {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(logEntry);
      
      // Keep only last 50 errors to avoid storage issues
      if (existingLogs.length > 50) {
        existingLogs.shift();
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Failed to store error log:', storageError);
    }
  }
}

export function getStoredErrors(): any[] {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch {
    return [];
  }
}

export function clearStoredErrors(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('errorLogs');
  }
}