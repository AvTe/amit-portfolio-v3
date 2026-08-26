/**
 * Where analytics consent must be asked for before any cookie is set.
 *
 * The 30 EEA states, plus the UK (UK GDPR) and Switzerland (revFADP). These
 * codes are handed to Google Consent Mode's `region` parameter, which resolves
 * them against the visitor's IP on Google's side — so the *legal* default is
 * correct regardless of what the browser-side check below concludes.
 */
export const CONSENT_REQUIRED_REGIONS = [
  // EEA
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU",
  "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // UK GDPR, Swiss revFADP
  "GB", "CH",
];

/** Where the visitor's answer is kept. */
export const CONSENT_KEY = "analytics-consent";

export type ConsentChoice = "granted" | "denied";

/**
 * Time zones that sit inside the regions above.
 *
 * Used only to decide whether to *show* the banner. IP geolocation would be
 * more accurate, but reading it means rendering this page per-request instead
 * of serving it from the CDN — too high a price for a personal site.
 *
 * The failure modes are both safe. A false positive shows a banner to someone
 * who did not need one. A false negative shows no banner, but Consent Mode has
 * already denied storage for that region on Google's side, so nothing is set
 * either way.
 */
const EXTRA_ZONES = [
  "Atlantic/Reykjavik", // Iceland
  "Atlantic/Canary", // Spain
  "Atlantic/Madeira", // Portugal
  "Atlantic/Azores", // Portugal
  "Atlantic/Faroe", // Denmark
];

/** Europe/* zones belonging to countries outside the list above. */
const NON_EEA_EUROPE = [
  "Europe/Moscow", "Europe/Istanbul", "Europe/Kyiv", "Europe/Kiev",
  "Europe/Minsk", "Europe/Kaliningrad", "Europe/Volgograd", "Europe/Samara",
  "Europe/Saratov", "Europe/Astrakhan", "Europe/Ulyanovsk", "Europe/Kirov",
  "Europe/Simferopol", "Europe/Belgrade", "Europe/Sarajevo", "Europe/Skopje",
  "Europe/Tirane", "Europe/Podgorica", "Europe/Chisinau",
];

export function needsConsentBanner(): boolean {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!zone) return false;
    if (EXTRA_ZONES.includes(zone)) return true;
    return zone.startsWith("Europe/") && !NON_EEA_EUROPE.includes(zone);
  } catch {
    // No Intl, no signal — the region default has it covered.
    return false;
  }
}
