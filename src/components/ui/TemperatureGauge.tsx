interface TemperatureGaugeProps {
  current: number;
  threshold: number;
  safeRange: string;
}

export default function TemperatureGauge({ current, threshold, safeRange }: TemperatureGaugeProps) {
  const isRisk = current > threshold;
  // Map temperature from -40 to 0 onto 0-100%
  const min = -40;
  const max = 5;
  const pct = Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
  const thresholdPct = Math.min(100, Math.max(0, ((threshold - min) / (max - min)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold tabular-nums text-polar-ink">{current}°C</p>
          <p className="text-xs text-polar-muted">Current Temperature</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-polar-muted">Safe: {safeRange}</p>
          <p className="text-xs text-polar-muted">Threshold: {threshold}°C</p>
        </div>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        {/* Safe zone */}
        <div className="absolute h-full bg-green-200" style={{ left: 0, width: `${thresholdPct}%` }} />
        {/* Danger zone */}
        <div className="absolute h-full bg-red-200" style={{ left: `${thresholdPct}%`, right: 0 }} />
        {/* Current temp marker */}
        <div
          className={`absolute top-0 h-full w-1.5 ${isRisk ? 'bg-red-600' : 'bg-green-600'} rounded-full shadow-md`}
          style={{ left: `calc(${pct}% - 3px)` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400 font-mono">{min}°C</span>
        {isRisk ? (
          <span className="font-bold text-red-600">THRESHOLD EXCEEDED — COLD-CHAIN RISK</span>
        ) : (
          <span className="font-semibold text-green-600">Within safe range</span>
        )}
        <span className="text-gray-400 font-mono">{max}°C</span>
      </div>
    </div>
  );
}
