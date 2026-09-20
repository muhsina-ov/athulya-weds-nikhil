import type { WeddingEvent } from "@/config";
import { invite } from "@/config";

/** Convert an ISO string (with offset) to ICS/Google UTC stamp: 20261204T033000Z */
function toUTCStamp(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    p(d.getUTCMonth() + 1) +
    p(d.getUTCDate()) +
    "T" +
    p(d.getUTCHours()) +
    p(d.getUTCMinutes()) +
    p(d.getUTCSeconds()) +
    "Z"
  );
}

export function googleCalendarUrl(ev: WeddingEvent): string {
  const locationText = `${ev.venueName}, ${ev.venueAddress}`;
  const detailsText = `${invite.brideFirst} & ${invite.groomFirst} — ${ev.title}. ${ev.note ?? ""} ${ev.subVenueNote ?? ""}`.trim();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${ev.title} — ${invite.brideFirst} weds ${invite.groomFirst}`,
    dates: `${toUTCStamp(ev.startISO)}/${toUTCStamp(ev.endISO)}`,
    details: detailsText,
    location: locationText,
    ctz: "Asia/Kolkata",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build and trigger download of an .ics file (works for Apple/Outlook). */
export function downloadIcs(ev: WeddingEvent): void {
  const locationText = `${ev.venueName}, ${ev.venueAddress}`.replace(/,/g, "\\,");
  const detailsText = `${invite.brideFirst} & ${invite.groomFirst} — ${ev.title}. ${ev.note ?? ""} ${ev.subVenueNote ?? ""}`.trim();
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//InviteStory//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${ev.id}-${Date.now()}@invitestory`,
    `DTSTAMP:${toUTCStamp(new Date().toISOString())}`,
    `DTSTART:${toUTCStamp(ev.startISO)}`,
    `DTEND:${toUTCStamp(ev.endISO)}`,
    `SUMMARY:${ev.title} — ${invite.brideFirst} weds ${invite.groomFirst}`,
    `DESCRIPTION:${detailsText}`,
    `LOCATION:${locationText}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invite.brideFirst}-weds-${invite.groomFirst}-${ev.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
