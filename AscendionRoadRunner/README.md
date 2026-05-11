# 🚗 RoadRunner - Leadership Surface Movement Tracking

Real-time GPS tracking system for leadership ground transportation with live maps, route monitoring, and deviation alerts.

## 🌟 Features

- ✅ **Real-time GPS Tracking** - Live driver location updates
- ✅ **Interactive Map Dashboard** - Google Maps integration
- ✅ **Route Trajectory** - Visual route lines between pickup and drop
- ✅ **Deviation Alerts** - Security alerts when driver goes off planned route
- ✅ **Trip Management** - Create, edit, and end trips
- ✅ **Coordinator Tracking** - Track coordinator and employee information
- ✅ **Database View** - View all trip data in table format
- ✅ **CSV Export** - Download complete trip history
- ✅ **Driver App** - Mobile-friendly driver tracking interface

## 🚀 Live Demo

[View Live Application](https://roadrunner.onrender.com)

## 📸 Screenshots

### Viewer Dashboard
Main dashboard showing all active and ended trips with live GPS tracking.

### Driver Interface
Mobile-friendly interface for drivers to share their real-time location.

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express
- **Database:** Firebase Realtime Database
- **Maps:** Google Maps JavaScript API
- **Hosting:** Render

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Google Maps API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/roadrunner.git
cd roadrunner
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open browser:
```
http://localhost:3000
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Update `js/firebase.js` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Google Maps API

1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Geometry Library
3. Update API key in `viewer.html` and `driver.html`

## 📱 Usage

### For Coordinators (Viewer Dashboard)

1. **Create Trip:**
   - Click "+ ADD TRIP" button
   - Fill in trip details (coordinator, leader, driver, route)
   - Save trip

2. **Monitor Live:**
   - View driver locations on map in real-time
   - See route trajectory lines
   - Get deviation alerts if driver goes off route

3. **Manage Trips:**
   - Edit trip details
   - End trips when complete
   - Export data to CSV

### For Drivers (Driver App)

1. Open driver link provided by coordinator
2. Enable location sharing when prompted
3. Keep app open during trip
4. Location updates automatically every 3 seconds

## 📊 Database Structure

```
trips/
  {tripId}/
    - coordinatorName
    - coordinatorCode
    - leaderName
    - driverName
    - cabNumber
    - travelDate
    - pickup
    - pickupTime
    - drop
    - atDisposal
    - status
    - createdAt
    - updatedAt

locations/
  {tripId}/
    - lat
    - lng
    - timestamp
```

## 🔐 Security Features

- **Route Deviation Monitoring:** Alerts when driver deviates >500m from planned route
- **Real-time Tracking:** Continuous GPS updates every 3 seconds
- **Trip Status Management:** Track active vs ended trips
- **Coordinator Authorization:** Trip assignment and monitoring

## 🎨 UI Features

- **Professional Dashboard:** Skybridge-inspired design
- **Background Watermark:** Subtle Ascendion "A" logo
- **Responsive Layout:** Works on desktop, tablet, and mobile
- **Dark Theme:** Easy on the eyes for extended use
- **Smooth Animations:** Professional transitions and effects

## 📈 Performance

- Lightweight and fast
- Optimized for real-time updates
- Minimal server load
- Efficient Firebase queries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Credits

Developed by Ascendion for leadership ground transportation coordination.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ by Ascendion**
