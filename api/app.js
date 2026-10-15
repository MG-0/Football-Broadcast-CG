const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const http = require("http");
const os = require("os");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const usersRoute = require("./routes/users");
const allRoutes = require("./routes/allRoutes");

// CREATE SERVER EXPRESS------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin dynamically (including LAN, localhost, ngrok)
      callback(null, true);
    },
    credentials: true,
  }),
);

// Helper: get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "localhost";
}

//  STATICS FILES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/overlay-live", express.static(path.join(__dirname, "../overlay")));


// DATABASE CONNECTION-----------

// MIDDLEWARE---------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

let lastState = { visible: false, data: null };

// SOCKET CONNECTION IO------------------------------------------
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // SOCKET START SCREEN-------------------------------
  // SHOW
  socket.on("startScreen:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("startScreen:show", data);
  });

  // HIDE
  socket.on("startScreen:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("startScreen:hide", data);
  });

  // SOCKET TOURNAMENT---------------------------------
  // SHOW
  socket.on("tournament:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("tournament:show", data);
  });

  // HIDE
  socket.on("tournament:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("tournament:hide", data);
  });

  // SOCKET SPONSORS--------------------------------
  // SHOW
  socket.on("sponsors:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("sponsors:show", data);
  });

  // HIDE------------
  socket.on("sponsors:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("sponsors:hide", data);
  });

  // SOCKET WEATHER----------------------------------------
  // SHOW
  socket.on("weather:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("weather:show", data);
  });

  // HIDE------------
  socket.on("weather:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("weather:hide", data);
  });

  // SOCKET LINEUP----------------------------------------
  // SHOW
  socket.on("lineup:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("lineup:show", data);
  });

  // HIDE
  socket.on("lineup:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("lineup:hide", data);
  });

  // SOCKET SCOREBUG----------------------------------------
  // SHOW
  socket.on("scorebug:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("scorebug:show", data);
  });

  // HIDE
  socket.on("scorebug:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("scorebug:hide", data);
  });

  // SOCKET STATISTICS----------------------------------------
  // SHOW
  socket.on("statistics:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("statistics:show", data);
  });

  // HIDE
  socket.on("statistics:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("statistics:hide", data);
  });

  // SOCKET PLAYER SPOTLIGHT----------------------------------------
  // SHOW
  socket.on("playerSpotlight:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("playerSpotlight:show", data);
  });

  // HIDE
  socket.on("playerSpotlight:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("playerSpotlight:hide", data);
  });

  // SOCKET NOTIFICATIONS----------------------------------------
  // SHOW
  socket.on("notifications:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("notifications:show", data);
  });

  // HIDE
  socket.on("notifications:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("notifications:hide", data);
  });

  // SOCKET QRCODE----------------------------------------
  // SHOW
  socket.on("qrCode:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("qrCode:show", data);
  });

  // HIDE
  socket.on("qrCode:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("qrCode:hide", data);
  });

  // SOCKET LOWER THIRD----------------------------------------
  // SHOW
  socket.on("lowerThird:show", (data) => {
    lastState = { visible: true, data: data };
    io.emit("lowerThird:show", data);
  });

  // HIDE
  socket.on("lowerThird:hide", (data) => {
    lastState = { visible: false, data: lastState.data };
    io.emit("lowerThird:hide", data);
  });

  // DISCONNETION------------------------------------------
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// API ROUTES
app.use("/users", usersRoute);
app.use("/routes", allRoutes);

// SERVER INFO (local IP for QR landing page)
app.get("/server-info", (req, res) => {
  const ip = getLocalIP();
  const PORT_NUM = process.env.PORT || 5000;

  res.json({
    ip,
    port: PORT_NUM,
    landingBase: `http://${ip}:${PORT_NUM}/overlay-live`,
  });
});

// SERVE FRONTEND (REACT DIST)
app.use(express.static(path.join(__dirname, "dist")));

// SPA FALLBACK ROUTE (Return index.html for all non-API GET requests)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// SERVER IS CONNECTIONS----------
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  const ip = getLocalIP();

  console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`📱 Local Network: http://${ip}:${PORT}`);
});
