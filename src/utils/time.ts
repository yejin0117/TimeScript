// src/utils/time.ts
export function toOffsetDateTime(date: string, time: string, offsetMinutes = 540) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hh = pad(Math.floor(abs / 60));
  const mm = pad(abs % 60);
  return `${date}T${time}:00${sign}${hh}:${mm}`; // 2025-10-05T19:00:00+09:00
}
