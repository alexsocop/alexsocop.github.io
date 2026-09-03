// Current Maya Long Count + Cholqʼij + Haabʼ + Lord of the Night + Gregorian date
// Uses GMT correlation JDN 584283 and the same calendar logic as kin.html.

const CORR_JDN = 584283;

// Choose "great" for the Community Gran Wayebʼ calculation used by default in
// kin.html, or "standard" for the uninterrupted 365-day Haabʼ.
const HAAB_MODE = "great";
const HAAB_DAY_BASE = 0;

const HAAB_MONTHS = [
  "Pop", "Wo", "Sip", "Sotzʼ", "Sek", "Xul", "Yaxkʼin", "Mol", "Chʼen", "Yax",
  "Sak", "Keh", "Mak", "Kʼankʼin", "Muwan", "Pax", "Kʼayab", "Kumkʼu", "Wayebʼ"
];

const CHOLQIJ_NAMES = [
  "Imox", "Iqʼ", "Aqʼabʼal", "Kʼat", "Kan", "Keme", "Kej", "Qʼanil", "Toj", "Tzʼiʼ",
  "Bʼatzʼ", "E", "Aj", "Iʼx", "Tzʼikin", "Ajmaq", "Noʼj", "Tijax", "Kawoq", "Ajpuʼ"
];

// Epoch alignments for 0.0.0.0.0: 4 Ajpuʼ, 8 Kumkʼu, G9.
const CHOLQIJ_START_NUMBER = 4;
const CHOLQIJ_START_NAME_INDEX = CHOLQIJ_NAMES.indexOf("Ajpuʼ");
const HAAB_START_ABS_INDEX = 17 * 20 + 8;
const LORD_START_NUMBER = 9;

// Community Gran Wayebʼ configuration supplied by the Ajqʼij:
// 2013-01-02 = 0 Gran Wayebʼ
// 2013-01-14 = 12 Gran Wayebʼ
// 2013-01-15 = 0 Pop
const GREAT_WAYEB_ANCHOR_YEAR = 2013;
const GREAT_WAYEB_ANCHOR_MONTH = 1;
const GREAT_WAYEB_ANCHOR_DAY_OF_MONTH = 2;
const GREAT_WAYEB_DAYS = 13;
const HAAB_YEARS_PER_GREAT_CYCLE = 52;
const REGULAR_HAAB_DAYS = 365;
const REGULAR_WAYEB_DAYS = 5;

// Gran Wayebʼ replaces the final regular five-day Wayebʼ of the 52-Haab block:
// (52 × 365) - 5 + 13 = 18,988 days.
const ORDINARY_DAYS_PER_GREAT_CYCLE =
  HAAB_YEARS_PER_GREAT_CYCLE * REGULAR_HAAB_DAYS - REGULAR_WAYEB_DAYS;
const GREAT_WAYEB_CYCLE_DAYS =
  ORDINARY_DAYS_PER_GREAT_CYCLE + GREAT_WAYEB_DAYS;

function mod(a, m) {
  return ((a % m) + m) % m;
}

function divmodFloor(a, b) {
  const q = Math.floor(a / b);
  return [q, a - q * b];
}

// Proleptic Gregorian to JDN. Negative years use historical numbering:
// -1 means 1 BCE; there is no input year zero.
function gregorianToJDN(year, month, day) {
  const astronomicalYear = year < 0 ? year + 1 : year;
  const a = Math.floor((14 - month) / 12);
  const y = astronomicalYear + 4800 - a;
  const m = month + 12 * a - 3;

  return day
    + Math.floor((153 * m + 2) / 5)
    + 365 * y
    + Math.floor(y / 4)
    - Math.floor(y / 100)
    + Math.floor(y / 400)
    - 32045;
}

function todayLocalYMD() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const pad = value => String(value).padStart(2, "0");

  return {
    y,
    m,
    d,
    iso: `${y}-${pad(m)}-${pad(d)}`
  };
}

function jdnToLongCount(jdn) {
  const days = jdn - CORR_JDN;
  let remainder;
  let b;
  let k;
  let t;
  let winal;
  let kin;

  [b, remainder] = divmodFloor(days, 144000);
  [k, remainder] = divmodFloor(remainder, 7200);
  [t, remainder] = divmodFloor(remainder, 360);
  [winal, kin] = divmodFloor(remainder, 20);

  return { b, k, t, winal, kin, days };
}

function cholqijFromDays(days) {
  const nameIndex = mod(CHOLQIJ_START_NAME_INDEX + days, 20);
  const number = mod((CHOLQIJ_START_NUMBER - 1) + days, 13) + 1;

  return {
    number,
    name: CHOLQIJ_NAMES[nameIndex]
  };
}

function standardHaabFromDays(days) {
  const haabIndex = mod(HAAB_START_ABS_INDEX + days, REGULAR_HAAB_DAYS);
  const monthIndex = Math.floor(haabIndex / 20);
  const dayZeroBased = haabIndex % 20;
  const day = HAAB_DAY_BASE === 0 ? dayZeroBased : dayZeroBased + 1;

  return {
    day,
    month: HAAB_MONTHS[monthIndex],
    greatWayeb: false
  };
}

function greatWayebHaabFromJDN(jdn) {
  const anchorJDN = gregorianToJDN(
    GREAT_WAYEB_ANCHOR_YEAR,
    GREAT_WAYEB_ANCHOR_MONTH,
    GREAT_WAYEB_ANCHOR_DAY_OF_MONTH
  );
  const position = mod(jdn - anchorJDN, GREAT_WAYEB_CYCLE_DAYS);

  if (position < GREAT_WAYEB_DAYS) {
    return {
      day: position,
      month: "Gran Wayebʼ",
      greatWayeb: true
    };
  }

  const regularPosition = mod(position - GREAT_WAYEB_DAYS, REGULAR_HAAB_DAYS);
  const monthIndex = Math.floor(regularPosition / 20);
  const dayZeroBased = regularPosition % 20;
  const day = HAAB_DAY_BASE === 0 ? dayZeroBased : dayZeroBased + 1;

  return {
    day,
    month: HAAB_MONTHS[monthIndex],
    greatWayeb: false
  };
}

function haabForJDN(jdn, days, mode = HAAB_MODE) {
  if (mode === "standard") {
    return standardHaabFromDays(days);
  }
  if (mode === "great") {
    return greatWayebHaabFromJDN(jdn);
  }
  throw new Error("HAAB_MODE must be either 'great' or 'standard'.");
}

function lordFromDays(days) {
  const number = mod((LORD_START_NUMBER - 1) + days, 9) + 1;
  return `G${number}`;
}

(function renderToday() {
  const { y, m, d, iso } = todayLocalYMD();
  const jdn = gregorianToJDN(y, m, d);

  const { b, k, t, winal, kin, days } = jdnToLongCount(jdn);
  const cholqij = cholqijFromDays(days);
  const haab = haabForJDN(jdn, days);
  const lord = lordFromDays(days);

  const longCount = `${b}.${k}.${t}.${winal}.${kin}`;
  const restOfDate =
    `${cholqij.number} ${cholqij.name} (Cholqʼij) - `
    + `${haab.day} ${haab.month} (Haabʼ) - `
    + `${lord} | `
    + `${iso} (Gregorian)`;

  const longCountElement = document.getElementById("longcount");
  const calendarRoundElement = document.getElementById("cholqijfull");

  if (!longCountElement || !calendarRoundElement) {
    console.error(
      "Maya calendar output requires elements with IDs 'longcount' and 'cholqijfull'."
    );
    return;
  }

  longCountElement.textContent = longCount;
  calendarRoundElement.textContent = restOfDate;
})();
