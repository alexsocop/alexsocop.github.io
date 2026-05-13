/*PRODUCE CURRENT LONG COUNT
Get current date and Baktun 13 date*/
const date1 = new Date("2012-12-21");
date1.setHours(0); //Default hour is at 08:00, set it to 00:00
const date2 = new Date();

//Calculate the difference between current date and Baktun 13
let Diff_In_Time = date2.getTime() - date1.getTime();
let Diff_In_Days = Math.floor(Diff_In_Time / (1000 * 3600 * 24));

const baktun = 13;
let katun = Math.floor(Diff_In_Days / 7200);
let tun = Math.floor((Diff_In_Days - (katun * 7200)) / 360);
let winal = Math.floor((Diff_In_Days - (katun * 7200) - (tun * 360)) / 20);
let kin = Diff_In_Days % 20;

//Get Cholq'ij full name and number
const cholqij_list = ["Ajpu'",
  "Imox", "Iq'", "Aq'ab'al", "K'at", 
  "Kan", "Kame", "Kej", "Q'anil",
  "Toj", "T'zi'", "B'atz'", "E",
  "Aj", "I'x", "Tz'ikin", "Ajmaq",
  "No'j", "Tijax", "Kawoq"];

let cholqij_day = cholqij_list[kin];

//Calculate cholqij number
const num = 4; //This is the cholqij number of Baktun 13
x = Math.floor(Diff_In_Days / 13);
y = 13 * x;
let cholqij_num = Diff_In_Days - y + num;
if (cholqij_num > 13) {
  cholqij_num = cholqij_num - 13;
}

function mayan() {
  document.getElementById("longcount").innerHTML = "Today's Mayan long count: " + baktun + "." + katun + "." + tun + "." + winal + "." + kin + " (Cholq'ij day: " + cholqij_num + " " + cholqij_day + ")";
}
