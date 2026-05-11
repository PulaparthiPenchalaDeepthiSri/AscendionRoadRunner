import { db } from "./firebase.js";
import { ref, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const BASE_URL = window.location.origin;
let map;
const markers = {};
const polylines = {};
let editingTripId = null;
let allTripsData = {};

/* ===== DOM ===== */
const leaderEl = document.getElementById("leaderEl");
const driverEl = document.getElementById("driverEl");
const cabEl = document.getElementById("cabEl");
const dateEl = document.getElementById("dateEl");
const pickupEl = document.getElementById("pickupEl");
const timeEl = document.getElementById("timeEl");
const dropEl = document.getElementById("dropEl");
const atDisp = document.getElementById("atDisp");
const coordinatorName = document.getElementById("coordinatorName");
const coordinatorCode = document.getElementById("coordinatorCode");
const tripsDiv = document.getElementById("cards");
const addTripBtn = document.getElementById("add-trip-btn");
const tripModal = document.getElementById("trip-modal");
const cancelBtn = document.getElementById("cancel-btn");
const saveBtn = document.getElementById("save-btn");
const downloadBtn = document.getElementById("download-btn");
const databaseBtn = document.getElementById("database-btn");
const databaseModal = document.getElementById("database-modal");
const closeDatabaseBtn = document.getElementById("close-db-btn");
const databaseTbody = document.getElementById("database-tbody");

// Summary elements
const sumTotal = document.getElementById("sum-total");
const sumActive = document.getElementById("sum-active");
const sumEnded = document.getElementById("sum-ended");

/* ===== MAP INIT ===== */
function initMap() {
  map = new google.maps.Map(document.getElementById("trips-map"), {
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

/* ===== MODALS ===== */
addTripBtn.addEventListener("click", () => {
  editingTripId = null;
  leaderEl.value = "";
  driverEl.value = "";
  cabEl.value = "";
  dateEl.value = "";
  pickupEl.value = "";
  timeEl.value = "";
  dropEl.value = "";
  atDisp.checked = false;
  coordinatorName.value = "";
  coordinatorCode.value = "";
  tripModal.classList.add("active");
});

cancelBtn.addEventListener("click", () => {
  tripModal.classList.remove("active");
  editingTripId = null;
});

saveBtn.addEventListener("click", () => {
  const tripData = {
    leaderName: leaderEl.value,
    driverName: driverEl.value,
    cabNumber: cabEl.value,
    travelDate: dateEl.value,
    pickup: pickupEl.value,
    pickupTime: timeEl.value,
    drop: dropEl.value,
    atDisposal: atDisp.checked,
    coordinatorName: coordinatorName.value,
    coordinatorCode: coordinatorCode.value,
    updatedAt: Date.now()
  };

  if (editingTripId) {
    update(ref(db, "trips/" + editingTripId), tripData);
  } else {
    const id = Date.now().toString();
    set(ref(db, "trips/" + id), {
      ...tripData,
      status: "active",
      createdAt: Date.now()
    });
  }

  tripModal.classList.remove("active");
  editingTripId = null;
});

/* ===== DATABASE MODAL ===== */
databaseBtn.addEventListener("click", () => {
  populateDatabaseTable();
  databaseModal.classList.add("active");
});

closeDatabaseBtn.addEventListener("click", () => {
  databaseModal.classList.remove("active");
});

// Close database modal on outside click
databaseModal.addEventListener("click", (e) => {
  if (e.target === databaseModal) {
    databaseModal.classList.remove("active");
  }
});

function populateDatabaseTable() {
  databaseTbody.innerHTML = "";
  
  Object.entries(allTripsData).forEach(([id, trip]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id.slice(-8)}</td>
      <td>${trip.coordinatorName || "N/A"}</td>
      <td>${trip.coordinatorCode || "N/A"}</td>
      <td>${trip.leaderName || "N/A"}</td>
      <td>${trip.driverName || "N/A"}</td>
      <td>${trip.cabNumber || "N/A"}</td>
      <td>${trip.travelDate || "N/A"}</td>
      <td>${trip.pickup || "N/A"}</td>
      <td>${trip.pickupTime || "N/A"}</td>
      <td>${trip.drop || "N/A"}</td>
      <td>${trip.atDisposal ? "Yes" : "No"}</td>
      <td><span class="status-badge-table status-${trip.status}">${trip.status || "active"}</span></td>
    `;
    databaseTbody.appendChild(row);
  });
}

/* ===== ACTIONS ===== */
window.copyLink = (l) => {
  navigator.clipboard.writeText(l);
  showNotification("Link copied to clipboard!");
};

window.editTrip = (id, tripData) => {
  editingTripId = id;
  leaderEl.value = tripData.leaderName || "";
  driverEl.value = tripData.driverName || "";
  cabEl.value = tripData.cabNumber || "";
  dateEl.value = tripData.travelDate || "";
  pickupEl.value = tripData.pickup || "";
  timeEl.value = tripData.pickupTime || "";
  dropEl.value = tripData.drop || "";
  atDisp.checked = tripData.atDisposal || false;
  coordinatorName.value = tripData.coordinatorName || "";
  coordinatorCode.value = tripData.coordinatorCode || "";
  tripModal.classList.add("active");
};

window.endTrip = (id) => {
  if (confirm("End this trip?")) {
    set(ref(db, "trips/" + id + "/status"), "ended");
    showNotification("Trip ended successfully!");
  }
};

/* ===== NOTIFICATION ===== */
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 120px;
    right: 48px;
    background: linear-gradient(135deg, #10B981, #059669);
    color: #001b20;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 700;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ===== CSV EXPORT ===== */
downloadBtn.addEventListener("click", () => {
  const csvData = convertToCSV(allTripsData);
  downloadCSV(csvData, `RoadRunner_Trips_${new Date().toISOString().split('T')[0]}.csv`);
  showNotification("Data exported successfully!");
});

function convertToCSV(trips) {
  const headers = [
    "Trip ID",
    "Coordinator Name",
    "Coordinator Code",
    "Leader Name",
    "Driver Name",
    "Cab Number",
    "Travel Date",
    "Pickup Location",
    "Pickup Time",
    "Drop Location",
    "At Disposal",
    "Status",
    "Created At",
    "Updated At"
  ];

  const rows = Object.entries(trips).map(([id, trip]) => [
    id,
    trip.coordinatorName || "N/A",
    trip.coordinatorCode || "N/A",
    trip.leaderName || "N/A",
    trip.driverName || "N/A",
    trip.cabNumber || "N/A",
    trip.travelDate || "N/A",
    trip.pickup || "N/A",
    trip.pickupTime || "N/A",
    trip.drop || "N/A",
    trip.atDisposal ? "Yes" : "No",
    trip.status || "active",
    new Date(trip.createdAt).toLocaleString(),
    trip.updatedAt ? new Date(trip.updatedAt).toLocaleString() : "N/A"
  ]);

  return [headers, ...rows].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ===== HELPER: GEOCODE ADDRESS ===== */
async function geocode(address) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAjpGN4ickxPdE7kqmapEm65d-tnH4iLrQ`
    );
    const data = await res.json();
    return data.results?.[0]?.geometry?.location;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/* ===== FIREBASE LISTENER ===== */
function listenFirebase() {
  onValue(ref(db), async snap => {
    const data = snap.val() || {};
    allTripsData = data.trips || {};
    tripsDiv.innerHTML = "";

    // Calculate summary stats
    const trips = Object.entries(allTripsData);
    const totalTrips = trips.length;
    const activeTrips = trips.filter(([_, t]) => t.status === "active").length;
    const endedTrips = trips.filter(([_, t]) => t.status === "ended").length;

    // Update summary
    sumTotal.textContent = totalTrips;
    sumActive.textContent = activeTrips;
    sumEnded.textContent = endedTrips;

    for (const [id, t] of trips) {
      const loc = data.locations?.[id];
      const driverLink = `${BASE_URL}/driver.html?id=${id}`;
      const shortLink = `driver.html?id=${id.slice(-8)}`;

      const statusBadge = t.status === "active" 
        ? `<div class="trip-badge"><div class="badge-pulse"></div>ACTIVE</div>` 
        : `<div class="trip-badge ended">ENDED</div>`;

      const card = document.createElement("div");
      card.className = "trip-card";
      card.innerHTML = `
        <div class="trip-card-header">
          <div class="trip-callsign">${t.cabNumber || "N/A"}</div>
          ${statusBadge}
        </div>
        
        <div class="trip-leader">Leader: ${t.leaderName}</div>
        
        <div class="route-display">${t.pickup} → ${t.drop}</div>
        <div class="time-display">${t.travelDate} • ${t.pickupTime}</div>
        
        <div class="trip-info-grid">
          <div class="trip-info-item">
            <div class="trip-info-label">Driver</div>
            <div class="trip-info-value">${t.driverName}</div>
          </div>
          
          <div class="trip-info-item">
            <div class="trip-info-label">Coordinator</div>
            <div class="trip-info-value">${t.coordinatorName || "N/A"}</div>
          </div>
          
          <div class="trip-info-item">
            <div class="trip-info-label">Employee Code</div>
            <div class="trip-info-value">${t.coordinatorCode || "N/A"}</div>
          </div>
          
          <div class="trip-info-item">
            <div class="trip-info-label">At Disposal</div>
            <div class="trip-info-value">${t.atDisposal ? "Yes" : "No"}</div>
          </div>
        </div>

        <div class="trip-link-box">
          <span class="link-icon">🔗</span>
          <span class="link-text">${shortLink}</span>
        </div>

        <div class="trip-actions">
          <button onclick='copyLink("${driverLink}")'>Copy Link</button>
          <button onclick='editTrip("${id}", ${JSON.stringify(t).replace(/'/g, "\\'")})'}>Edit</button>
          <button onclick="endTrip('${id}')">End Trip</button>
        </div>
      `;

      /* CLICK CARD → ZOOM TO DRIVER */
      card.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        
        if (markers[id]) {
          map.setCenter(markers[id].getPosition());
          map.setZoom(17);
        }
      });

      tripsDiv.appendChild(card);

      /* ===== MARKER ===== */
      if (loc) {
        const pos = { lat: loc.lat, lng: loc.lng };
        if (!markers[id]) {
          markers[id] = new google.maps.Marker({ 
            map, 
            position: pos,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#10B981",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3
            },
            title: `${t.driverName} - ${t.cabNumber}`
          });
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
            strokeColor: "#10B981",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map
          });

          /* ===== DEVIATION ALERT ===== */
          if (loc && t.status === "active") {
            const driverPos = new google.maps.LatLng(loc.lat, loc.lng);
            const distanceResult = google.maps.geometry.spherical.computeDistanceToLine(
              driverPos,
              polylines[id]
            );
            const distance = distanceResult.distance;

            if (distance > 500) {
              console.warn(`⚠️ DEVIATION ALERT: ${t.driverName} is ${Math.round(distance)}m off route`);
              
              const alertDiv = document.createElement("div");
              alertDiv.style.cssText = `
                position: fixed;
                top: 180px;
                right: 48px;
                background: linear-gradient(135deg, #F59E0B, #D97706);
                color: #fff;
                padding: 16px 24px;
                border-radius: 12px;
                font-weight: 700;
                z-index: 10000;
                box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
              `;
              alertDiv.innerHTML = `⚠️ ${t.driverName} deviated ${Math.round(distance)}m from route`;
              document.body.appendChild(alertDiv);
              
              setTimeout(() => alertDiv.remove(), 5000);
            }
          }
        }
      }
    }
  });
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
