// connect to the local socket server
export const socket = io();

// BroadcastChannel fallback for serverless hosting (e.g. Vercel)
export const bc = typeof window !== "undefined" && window.BroadcastChannel ? new BroadcastChannel("football_cg_channel") : null;

const eventListeners = {};
const originalOn = socket.on.bind(socket);

socket.on = function (event, callback) {
  if (!eventListeners[event]) {
    eventListeners[event] = [];
  }
  eventListeners[event].push(callback);
  return originalOn(event, callback);
};

if (bc) {
  bc.onmessage = (e) => {
    if (e.data && e.data.event && eventListeners[e.data.event]) {
      eventListeners[e.data.event].forEach((cb) => {
        try {
          cb(e.data.data);
        } catch (err) {
          console.error("Error executing BC event listener:", err);
        }
      });
    }
  };
}

// extract match ID from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
export const matchId = urlParams.get("id");

console.log("🔌 Overlay Core: matchId parsed from URL is:", matchId);

// connection status listeners
socket.on("connect", () => {
  console.log("🟢 Overlay Socket connected successfully! socketId:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Overlay Socket connection error:", error);
});

// Shared GSAP timelines used across all modules.
export const timelines = {
  startScreen: gsap.timeline({ paused: true }).timeScale(1.2),
  tournament: gsap.timeline({ paused: true }),
  sponsors: gsap.timeline({ paused: true }),
  weather: gsap.timeline({ paused: true }),
  lineup: gsap.timeline({ paused: true }),
  tactical: gsap.timeline({ paused: true }),
  scorebug: gsap.timeline({ paused: true }),
  statistics: gsap.timeline({ paused: true }),
  qrCode: gsap.timeline({ paused: true }),
  lowerThird: gsap.timeline({ paused: true }),
  notifications: gsap.timeline({ paused: true }),
  playerSpotlight: gsap.timeline({ paused: true }),
};
