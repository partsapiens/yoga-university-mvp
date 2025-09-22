// Error monitoring and reporting utilities for production debugging

interface ErrorReport {
  timestamp: string;
  error: string;
  endpoint: string;
  requestData?: any;
  userAgent?: string;
  environment: {
    nodeEnv: string;
    netlify: boolean;
    hasApiKey: boolean;
    useMock: boolean;
  };
  sessionId?: string;
}

class ErrorReporter {
  private static instance: ErrorReporter;
  private errors: ErrorReport[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory

  private constructor() {}

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  reportError(
    error: Error | string,
    endpoint: string,
    requestData?: any,
    userAgent?: string,
    sessionId?: string
  ): void {
    const errorReport: ErrorReport = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      endpoint,
      requestData: this.sanitizeRequestData(requestData),
      userAgent,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'unknown',
        netlify: process.env.NETLIFY === 'true',
        hasApiKey: !!process.env.OPENAI_API_KEY,
        useMock: process.env.USE_MOCK === 'true'
      },
      sessionId
    };

    // Add to in-memory storage
    this.errors.push(errorReport);
    
    // Keep only the last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console for immediate debugging
    console.error(`[ErrorReporter] ${endpoint}:`, {
      error: errorReport.error,
      timestamp: errorReport.timestamp,
      environment: errorReport.environment,
      sessionId: errorReport.sessionId
    });

    // In production, you might want to send to external monitoring service
    // this.sendToExternalService(errorReport);
  }

  getRecentErrors(limit = 10): ErrorReport[] {
    return this.errors.slice(-limit);
  }

  getErrorStats(): {
    totalErrors: number;
    errorsByEndpoint: Record<string, number>;
    errorsByType: Record<string, number>;
    recentErrorsCount: number;
  } {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const recentErrors = this.errors.filter(
      error => new Date(error.timestamp).getTime() > oneHourAgo
    );

    const errorsByEndpoint: Record<string, number> = {};
    const errorsByType: Record<string, number> = {};

    this.errors.forEach(error => {
      // Count by endpoint
      errorsByEndpoint[error.endpoint] = (errorsByEndpoint[error.endpoint] || 0) + 1;
      
      // Count by error type (first word of error message)
      const errorType = error.error.split(' ')[0] || 'Unknown';
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;
    });

    return {
      totalErrors: this.errors.length,
      errorsByEndpoint,
      errorsByType,
      recentErrorsCount: recentErrors.length
    };
  }

  clearErrors(): void {
    this.errors = [];
    console.log('[ErrorReporter] Error history cleared');
  }

  private sanitizeRequestData(data: any): any {
    if (!data) return data;
    
    // Remove sensitive information from request data
    const sanitized = { ...data };
    
    // Remove or mask sensitive fields
    if (sanitized.apiKey) {
      sanitized.apiKey = '[REDACTED]';
    }
    if (sanitized.password) {
      sanitized.password = '[REDACTED]';
    }
    if (sanitized.token) {
      sanitized.token = '[REDACTED]';
    }
    
    // Truncate long messages to prevent memory issues
    if (sanitized.messages && Array.isArray(sanitized.messages)) {
      sanitized.messages = sanitized.messages.map((msg: any) => ({
        ...msg,
        content: typeof msg.content === 'string' && msg.content.length > 200
          ? msg.content.substring(0, 200) + '...'
          : msg.content
      }));
    }
    
    return sanitized;
  }

  // Optional: Send to external monitoring service
  private async sendToExternalService(errorReport: ErrorReport): Promise<void> {
    // Only in production and if monitoring URL is configured
    const monitoringUrl = process.env.ERROR_MONITORING_URL;
    if (process.env.NODE_ENV !== 'production' || !monitoringUrl) {
      return;
    }

    try {
      // Example: Send to webhook or monitoring service
      await fetch(monitoringUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      // Don't let monitoring errors affect the main application
      console.warn('[ErrorReporter] Failed to send error to monitoring service:', error);
    }
  }
}

// Helper function to generate session IDs for tracking user sessions
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Enhanced logging for OpenAI API calls
export function logOpenAICall(
  endpoint: string,
  requestData: any,
  response: any,
  duration: number,
  error?: Error
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    endpoint,
    duration: `${duration}ms`,
    success: !error,
    requestSize: JSON.stringify(requestData).length,
    responseSize: response ? JSON.stringify(response).length : 0,
    error: error?.message,
    environment: {
      nodeEnv: process.env.NODE_ENV,
      netlify: process.env.NETLIFY === 'true',
      hasApiKey: !!process.env.OPENAI_API_KEY
    }
  };

  if (error) {
    console.error(`[OpenAI] ${endpoint} failed:`, logData);
    ErrorReporter.getInstance().reportError(error, endpoint, requestData);
  } else {
    console.log(`[OpenAI] ${endpoint} success:`, logData);
  }
}

export default ErrorReporter;