// Current Maya Long Count + Cholq'ij + Haab' + Lord of the Night + Gregorian date
// Uses GMT correlation JDN 584283

const CORR_JDN = 584283;

const HAAB_MONTHS = [
  "Pop", "Wo", "Sip", "Sotz'", "Sek", "Xul", "Yaxk'in", "Mol", "Ch'en", "Yax",
  "Sak", "Keh", "Mak", "K'ank'in", "Muwan", "Pax", "K'ayab", "Kumk'u", "Wayeb'"
];

const TZOLKIN_NAMES = [
  "Imox", "Iq'", "Aq'ab'al", "K'at", "Kan", "Kame", "Kej", "Q'anil", "Toj", "Tz'i'",
  "B'atz'", "E", "Aj", "I'x", "Tz'ikin", "Ajmaq", "No'j", "Tijax", "Kawoq", "Ajpu'"
];

// Epoch alignments: 0.0.0.0.0 = 4 Ajpu', 8 Kumk'u, G9
const TZ_START_NUMBER = 4;
const TZ_START_NAME_INDEX = TZOLKIN_NAMES.indexOf("Ajpu'");
const HAAB_START_ABS_INDEX = 17 * 20 + 8; // 8 Kumk'u
const LORD_START_NUMBER = 9;

function mod(a, m) {
  return ((a % m) + m) % m;
}

function divmodFloor(a, b) {
  const q = Math.floor(a / b);
  return [q, a - q * b];
}

// Proleptic Gregorian to JDN
function gregorianToJDN(year, month, day) {
  const y = year < 0 ? year + 1 : year;
  const a = Math.floor((14 - month) / 12);
  const y_ = y + 4800 - a;
  const m_ = month + 12 * a - 3;

  return day
    + Math.floor((153 * m_ + 2) / 5)
    + 365 * y_
    + Math.floor(y_ / 4)
    - Math.floor(y_ / 100)
    + Math.floor(y_ / 400)
    - 32045;
}

function todayLocalYMD() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const pad = n => String(n).padStart(2, "0");

  return {
    y,
    m,
    d,
    iso: `${y}-${pad(m)}-${pad(d)}`
  };
}

function jdnToLongCount(jdn) {
  const days = jdn - CORR_JDN;

  let rem, b, k, t, winal, kin;

  [b, rem] = divmodFloor(days, 144000);
  [k, rem] = divmodFloor(rem, 7200);
  [t, rem] = divmodFloor(rem, 360);
  [winal, kin] = divmodFloor(rem, 20);

  return { b, k, t, winal, kin, days };
}

function tzolkinFromDays(days) {
  const nameIndex = mod(TZ_START_NAME_INDEX + days, 20);
  const number = mod((TZ_START_NUMBER - 1) + days, 13) + 1;

  return {
    number,
    name: TZOLKIN_NAMES[nameIndex]
  };
}

function haabFromDays(days) {
  const haabIndex = mod(HAAB_START_ABS_INDEX + days, 365);
  const monthIndex = Math.floor(haabIndex / 20);
  const day = haabIndex % 20;

  return {
    day,
    month: HAAB_MONTHS[monthIndex]
  };
}

function lordFromDays(days) {
  const number = mod((LORD_START_NUMBER - 1) + days, 9) + 1;
  return `G${number}`;
}

(function renderToday() {
  const { y, m, d, iso } = todayLocalYMD();
  const jdn = gregorianToJDN(y, m, d);

  const { b, k, t, winal, kin, days } = jdnToLongCount(jdn);
  const tz = tzolkinFromDays(days);
  const haab = haabFromDays(days);
  const lord = lordFromDays(days);

  const longCount = `${b}.${k}.${t}.${winal}.${kin}`;

  const restOfDate =
    `${tz.number} ${tz.name} (Cholq'ij) - ` +
    `${haab.day} ${haab.month} (Haab') - ` +
    `${lord} | ` +
    `${iso} (Gregorian)`;

  document.getElementById("longcount").textContent = longCount;
  document.getElementById("cholqijfull").textContent = restOfDate;
})();
