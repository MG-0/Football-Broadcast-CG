import { socket, matchId, timelines } from "./core.js";
import { qrCodeGsap } from "../animationsGsap.js";

const SOCIAL_PLATFORMS = [
  { key: "website", label: "Website", icon: "🌐" },
  { key: "instagram", label: "Instagram", icon: "📷" },
  { key: "facebook", label: "Facebook", icon: "🔵" },
  { key: "youtube", label: "Youtube", icon: "🔴" },
  { key: "x", label: "x", icon: "✖️" },
];

// initialize QR Code graphic overlay and socket listeners
export function initQrCode() {
  const qrcodeWrapper = document.getElementById("qrcode-wrapper");
  const qrcodeOverlay = document.getElementById("qrcode-overlay");

  // apply custom offsets and scale parameters to the QR card wrapper
  const applyPosition = (payload) => {
    if (qrcodeWrapper) {
      qrcodeWrapper.style.bottom = `calc(40px + ${payload.yOffset || 0}px)`;
      qrcodeWrapper.style.right = `calc(40px - ${payload.xOffset || 0}px)`;
      qrcodeWrapper.style.scale = payload.scale || 1;
    }
  };

  // populate card elements, dynamically build social icons list, and play reveal timeline
  const handleRender = (payload) => {
    if (payload.isUpdate) {
      applyPosition(payload);
      return;
    }

    applyPosition(payload);

    document.getElementById("qrcode-title").textContent =
      payload.titleQr || "Follow Us";
    document.getElementById("qrcode-subtitle").textContent =
      payload.subTitleQr || "";

    const img = document.getElementById("qrcode-img");
    if (payload.qrCodeDataUrl) {
      img.src = payload.qrCodeDataUrl;
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }

    const container = document.getElementById("qrcode-links");
    container.innerHTML = "";
    SOCIAL_PLATFORMS.forEach(({ key, label, icon }) => {
      if (!payload[key]) return;
      const row = document.createElement("div");
      row.className = "qrcode-link-row";
      row.innerHTML = `
        <span class="qrcode-link-icon">${icon}</span>
        <span class="qrcode-link-text">${payload[key]}</span>
      `;
      container.appendChild(row);
    });

    if (!payload.isUpdate) {
      timelines.qrCode.clear();
      qrCodeGsap(timelines.qrCode, { qrcodeOverlay });
      timelines.qrCode.play();
    }
  };

  // socket events for show and hide commands
  socket.on("qrCode:show", (data) => {
    if (data.matchId !== matchId) return;

    if (data.qrCode) {
      handleRender(data.qrCode);
    } else {
      fetch(`/routes/getMatch/${matchId}`)
        .then((res) => res.json())
        .then((resData) => {
          const savedQr = resData.match?.graphics?.qrCode;
          if (savedQr) {
            handleRender(savedQr);
          }
        })
        .catch((err) => console.error("QR Code fallback fetch error:", err));
    }
  });

  socket.on("qrCode:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.qrCode.reverse();
  });
}
