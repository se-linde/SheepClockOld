import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { display } from "display";
import * as messaging from "messaging";
import { me as appbit } from "appbit"; 
import { today } from "user-activity"; 
import { battery } from "power";


const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";

let settings = loadSettings();

// Get a handle on the <text> element
const timeLabel = document.getElementById("timeLabel");
const dateLabel = document.getElementById("dateLabel");
const stepLabel = document.getElementById("stepLabel");
const battLabel = document.getElementById("battLabel");

clock.granularity = "seconds";
// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();

  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }

  let minutes = util.zeroPad(today.getMinutes());
  let seconds = util.zeroPad(today.getSeconds());

  let day = util.zeroPad(today.getDate());
  let month = util.zeroPad(today.getMonth() + 1);
  let year = today.getFullYear();

  timeLabel.text = `${hours}:${minutes}:${seconds}`;
  setDateDisplay(dateLabel, day, month, year, settings.USDateFormat);
}

function setDateDisplay(obj, d, m, y, format) {
  
  let date;
  if(format) {
    date = `${m}/${d}/${y}`;
  }
  else {
    date = `${d}/${m}/${y}`;
  }
  
  obj.text = date;
  settings.USDateFormat = format;
}

messaging.peerSocket.onmessage = evt => {
  const dateLabel = document.getElementById("dateLabel");

  let t = new Date();
  let d = util.zeroPad(t.getDate());
  let m = util.zeroPad(t.getMonth() + 1);
  let y = t.getFullYear();
  
  setDateDisplay(dateLabel, d, m, y, evt.data);
}

// appbit.onunload = saveSettings;

function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return {
      USDateFormat: false
    }
  }
}

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}

// Steps count

const stepLabel = document.getElementById("stepLabel");
var stepCount = today.adjusted.steps; 
// console.log(`Steps as num: ${stepCount}`); 
// var stepCountStr = stepCount.toString(); 
// console.log(`Steps as string: ${stepCount}`); 

stepLabel.text = `${stepCount}`; 

// Batttery Level Count 

var battCount = (Math.floor(battery.chargeLevel)); 
battLabel.text = `${battCount}%`; 


