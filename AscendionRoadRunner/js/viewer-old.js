import { db } from "./firebase.js";
import { ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const BASE_URL = window.location.origin;
let map;
const markers = {};
const polylines = {};   // 🔹 store trajectory lines

/* ===== DOM ===== */
const leaderEl = document.getElementById("leaderEl");
const driverEl = document.getElementById("driverEl");
const cabEl = document.getElementById("cabEl");
const dateEl = document.getElementById("dateEl");
const pickupEl = document.getElementById("pickupEl");
const timeEl = document.getElementById("timeEl");
const dropEl = document.getElementById("dropEl");
const atDisp = document.getElementById("atDisp");
const tripsDiv = document.getElementById("trips");

/* ===== PICKUP TIME LABEL (Timezone) ===== */
const pickupTimeLabel = document.getElementById("pickupTimeLabel");
if (pickupTimeLabel) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  pickupTimeLabel.innerText = `Pickup Time (Timezone: ${tz})`;
}

/* ===== MAP INIT ===== */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5
  });
  listenFirebase();
}

function waitForMaps() {
  if (window.google && window.google.maps) initMap();
  else setTimeout(waitForMaps, 100);
}
waitForMaps();

/* ===== MODAL ===== */
window.openAddTrip = () => {
  // 🔹 RESET FORM EVERY TIME
  leaderEl.value = "";
  driverEl.value = "";
  cabEl.value = "";
  dateEl.value = "";
  pickupEl.value = "";
  timeEl.value = "";
  dropEl.value = "";
  atDisp.checked = false;

  document.getElementById("addTripModal").style.display = "flex";
};

window.closeAddTrip = () => {
  document.getElementById("addTripModal").style.display = "none";
};

/* ===== SAVE TRIP ===== */
window.saveTrip = () => {
  const id = Date.now().toString();

  set(ref(db, "trips/" + id), {
    leaderName: leaderEl.value,
    driverName: driverEl.value,
    cabNumber: cabEl.value,
    travelDate: dateEl.value,
    pickup: pickupEl.value,
    pickupTime: timeEl.value,
    drop: dropEl.value,
    atDisposal: atDisp.checked,
    status: "active",
    createdAt: Date.now()
  });

  closeAddTrip();
};

/* ===== ACTIONS ===== */
window.copyLink = (l) => navigator.clipboard.writeText(l);
window.endTrip = (id) => set(ref(db, "trips/" + id + "/status"), "ended");
window.deleteTrip = (id) => {
  if (confirm("Delete this trip?")) {
    remove(ref(db, "trips/" + id));
    remove(ref(db, "locations/" + id));
  }
};

/* ===== HELPER: GEOCODE ADDRESS ===== */
async function geocode(address) {
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAjpGN4ickxPdE7kqmapEm65d-tnH4iLrQ`
  );
  const data = await res.json();
  return data.results?.[0]?.geometry?.location;
}

/* ===== FIREBASE LISTENER ===== */
function listenFirebase() {
  onValue(ref(db), async snap => {
    const data = snap.val() || {};
    tripsDiv.innerHTML = "";

    for (const [id, t] of Object.entries(data.trips || {})) {
      const loc = data.locations?.[id];
      const link = `${BASE_URL}/driver.html?id=${id}`;

      const card = document.createElement("div");
      card.className = "trip-card";
      card.innerHTML = `
        <div class="trip-title">${t.driverName}</div>
        <div class="trip-row">Leader: ${t.leaderName}</div>
        <div class="trip-row">Date: ${t.travelDate}</div>
        <div class="trip-row">Cab: ${t.cabNumber}</div>
        <div class="trip-row">Pickup: ${t.pickup}</div>
        <div class="trip-row">Pickup Time: ${t.pickupTime}</div>
        <div class="trip-row">Drop: ${t.drop}</div>
        <div class="trip-row">At Disposal: ${t.atDisposal ? "Yes" : "No"}</div>

        <div class="trip-link">${link}</div>

        <div class="trip-actions">
          <button onclick="copyLink('${link}')">Copy</button>
          <button onclick="endTrip('${id}')">End</button>
          <button onclick="deleteTrip('${id}')">Delete</button>
        </div>
      `;

      /* 🔹 CLICK CARD → ZOOM TO DRIVER */
      card.onclick = () => {
        if (markers[id]) {
          map.setCenter(markers[id].getPosition());
          map.setZoom(17);
        }
      };

      tripsDiv.appendChild(card);

      /* ===== MARKER ===== */
      if (loc) {
        const pos = { lat: loc.lat, lng: loc.lng };
        if (!markers[id]) {
          markers[id] = new google.maps.Marker({ map, position: pos });
        } else {
          markers[id].setPosition(pos);
        }
      }

      /* ===== TRAJECTORY LINE ===== */
      if (t.pickup && t.drop) {
        const pickupLoc = await geocode(t.pickup);
        const dropLoc = await geocode(t.drop);

        if (pickupLoc && dropLoc) {
          if (polylines[id]) polylines[id].setMap(null);

          polylines[id] = new google.maps.Polyline({
            path: [pickupLoc, dropLoc],
            strokeColor: "#00fac2",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map
          });

          /* ===== DEVIATION ALERT ===== */
          if (loc) {
            const distance =
              google.maps.geometry.spherical.computeDistanceToLine(
                new google.maps.LatLng(loc.lat, loc.lng),
                polylines[id]
              );

            if (distance > 300) {
              alert(`⚠️ ${t.driverName} deviated from planned route`);
            }
          }
        }
      }
    }
  });
}

