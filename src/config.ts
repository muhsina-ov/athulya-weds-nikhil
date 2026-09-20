/**
 * ═══════════════════════════════════════════════════════════════
 *  WEDDING INVITATION CONFIG — Athulya weds Nikhil
 *  Kerala Hindu Wedding · 04 December 2026
 * ═══════════════════════════════════════════════════════════════
 */

export interface WeddingEvent {
  id: string;
  label: string;      // small caps label
  title: string;      // script title
  dateLine: string;   // human readable date
  timeLine: string;   // human readable time
  startISO: string;   // ISO 8601 with +05:30 offset (IST)
  endISO: string;
  venueName: string;
  venueAddress: string;
  subVenueNote?: string;
  mapDirectionsUrl: string;
  mapsEmbedUrl: string;
  note?: string;
}

export const invite = {
  // ── Couple ──────────────────────────────────────────────
  brideFirst: "Athulya",
  groomFirst: "Nikhil",
  monogram: "A · N",
  hashtag: "#AthulyaWedsNikhil",
  greetingMalayalam: "ശുഭ മംഗല്യം",
  greetingEnglish: "Shubha Mangalyam",

  // ── Families ────────────────────────────────────────────
  brideParents: "With the loving blessings of parents & family",
  groomParents: "With the loving blessings of parents & family",
  inviteMessage:
    "With the divine grace of the Almighty and the heartfelt blessings of our parents and families, we joyfully invite you to celebrate our wedding and grace this sacred occasion with your presence and blessings.",

  // ── Event Countdown (IST, +05:30) ────────────────────────
  countdownTargetISO: "2026-12-04T09:00:00+05:30",
  countdownLabel: "Until the Sacred Thalikettu",
  weddingDateFormatted: "04 · 12 · 2026",

  // ── Events ───────────────────────────────────────────────
  events: [
    {
      id: "thalikettu",
      label: "Muhurtham & Sadya",
      title: "Thalikettu & Lunch",
      dateLine: "Friday, 4 December 2026",
      timeLine: "9:00 AM – 9:30 AM",
      startISO: "2026-12-04T09:00:00+05:30",
      endISO: "2026-12-04T14:30:00+05:30",
      venueName: "Varahamoorthi Temple, Kolangattukara",
      venueAddress: "Kolangattukara, Thrissur, Kerala",
      subVenueNote: "Followed by traditional Wedding Feast (Lunch) at Sri Durganjali Hall, Thechikottukavu Temple, Peramangalam",
      mapDirectionsUrl: "https://maps.app.goo.gl/QWF3NhNZLBck2dHn6?g_st=ac",
      mapsEmbedUrl: "https://maps.google.com/maps?q=Sri%20Durganjali%20Hall%2C%20Thechikottukavu%20temple%2C%20Peramangalam&t=&z=15&ie=UTF8&iwloc=&output=embed",
      note: "Thalikettu Muhurtham: 9:00 AM – 9:30 AM · Followed by Lunch",
    },
    {
      id: "reception",
      label: "Evening Celebration",
      title: "Wedding Reception",
      dateLine: "Friday, 4 December 2026",
      timeLine: "5:00 PM – 8:00 PM",
      startISO: "2026-12-04T17:00:00+05:30",
      endISO: "2026-12-04T20:00:00+05:30",
      venueName: "Sree Guru Deva Auditorium",
      venueAddress: "Arimbur, Thrissur, Kerala",
      subVenueNote: "Join us for an evening of joy, celebration, dinner & blessings",
      mapDirectionsUrl: "https://maps.app.goo.gl/6QDBh2rnPvFnqQ9g6?g_st=ac",
      mapsEmbedUrl: "https://maps.google.com/maps?q=Sree%20Guru%20Deva%20Auditorium%2C%20Arimbur&t=&z=15&ie=UTF8&iwloc=&output=embed",
      note: "Celebration & Dinner: 5:00 PM to 8:00 PM",
    },
  ] as WeddingEvent[],

  // ── Primary Venue (Fallback / Overview) ──────────────────
  venueName: "Varahamoorthi Temple & Sri Durganjali Hall",
  venueAddress: "Kolangattukara & Peramangalam, Thrissur, Kerala",
  mapsQuery: "Sri Durganjali Hall, Thechikottukavu temple, Peramangalam, Kerala",

  // ── Footer ───────────────────────────────────────────────
  footerBlessing: "With love, prayers & cherished blessings, two lives begin a sacred journey as one",
  creditLine: "Crafted with ♥ by InviteStory · @invitestory.in",
};

// ── Derived helpers ───────────────────────────────────────
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  invite.mapsQuery
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const mapsDirectionsUrl = "https://maps.app.goo.gl/QWF3NhNZLBck2dHn6?g_st=ac";
