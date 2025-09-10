export type TelemetryEvent = string;

export function track(event: TelemetryEvent, data?: Record<string, unknown>) {
  // Placeholder telemetry hook
  console.log('[telemetry]', event, data);
}
