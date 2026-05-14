// Get current date and Baktun 13 date
const date1 = new Date("2012-12-21");
date1.setHours(0, 0, 0, 0);

const date2 = new Date();

// Calculate the difference between current date and Baktun 13
const diffInTime = date2.getTime() - date1.getTime();
const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

const baktun = 13;
const katun = Math.floor(diffInDays / 7200);
const tun = Math.floor((diffInDays - katun * 7200) / 360);
const winal = Math.floor((diffInDays - katun * 7200 - tun * 360) / 20);
const kin = diffInDays % 20;

document.getElementById("longcount").textContent =
  baktun + "." + katun + "." + tun + "." + winal + "." + kin;

// Get Cholq'ij full name and number
const cholqijList = [
  "Ajpu'",
  "Imox", "Iq'", "Aq'ab'al", "K'at",
  "Kan", "Kame", "Kej", "Q'anil",
  "Toj", "T'zi'", "B'atz'", "E",
  "Aj", "I'x", "Tz'ikin", "Ajmaq",
  "No'j", "Tijax", "Kawoq"
];

const cholqijDay = cholqijList[kin];

// Calculate Cholq'ij number
const num = 4; // Cholq'ij number of Baktun 13
let cholqijNum = (diffInDays % 13) + num;

if (cholqijNum > 13) {
  cholqijNum = cholqijNum - 13;
}

document.getElementById("cholqijfull").textContent =
  cholqijNum + " " + cholqijDay + " (K'iche')";
