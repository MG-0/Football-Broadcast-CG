import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import QRCode from "qrcode";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";
import { DEFAULT_QR_STATE } from "../../config/layersConfig.js";

export default function useQrCode() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.qrCode || false;
  const [form, setForm] = useState(DEFAULT_QR_STATE);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [serverBase, setServerBase] = useState(
    `${window.location.origin}/overlay-live`,
  );
  const [ngrokUrl, setNgrokUrl] = useState("");

  const adjustOffset = (key, amount) => {
    setForm((prev) => {
      const minVal = key === "xOffset" ? -650 : -250;
      const maxVal = key === "xOffset" ? 650 : 550;

      return {
        ...prev,
        [key]: Math.max(minVal, Math.min(maxVal, (prev[key] || 0) + amount)),
      };
    });
  };

  // Fetch the real local-network base URL so phones can access the landing page
  useEffect(() => {
    fetch("/server-info")
      .then((r) => r.json())
      .then((info) => {
        if (info.landingBase) setServerBase(info.landingBase);
      })
      .catch(() => {}); // silently fall back
  }, []);

  // The landing page URL — uses ngrok if set, otherwise local IP
  const cleanNgrok = ngrokUrl.trim().replace(/\/$/, "");
  const landingPageUrl = cleanNgrok
    ? `${cleanNgrok}/overlay-live/qr-landing.html?id=${id}`
    : `${serverBase}/qr-landing.html?id=${id}`;

  // Load saved data from DB
  useEffect(() => {
    const saved = matchData?.match?.graphics?.qrCode;

    if (saved) setForm({ ...DEFAULT_QR_STATE, ...saved });
  }, [matchData]);

  // Auto-regenerate QR whenever the landing URL changes
  const generateQR = useCallback(async () => {
    try {
      const dataUrl = await QRCode.toDataURL(landingPageUrl, {
        width: 300,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });

      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error("QR generation error:", err);
    }
  }, [landingPageUrl]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const getPayload = () => ({ ...form, qrCodeDataUrl: qrDataUrl });

  // Save current QR Code configurations
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/qr-code`, getPayload());
      if (refreshMatchData) await refreshMatchData();
      toast.success("QR Code graphic saved successfully!");
    } catch (error) {
      console.error("Save QR error:", error);
      const errMsg =
        error.response?.data?.message || "Failed to save QR Code graphic.";

      toast.error(errMsg);
    }
  };

  // Toggle QR Code live on stream
  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("qrCode", false);
    } else {
      toggleOverlay("qrCode", true, { qrCode: getPayload() });
    }
  };

  // Real-time updates when live
  useEffect(() => {
    if (isLive) {
      toggleOverlay(
        "qrCode",
        true,
        { qrCode: { ...getPayload(), isUpdate: true } },
        true,
      );
    }
  }, [form, qrDataUrl, isLive]);

  return {
    isLive,
    form,
    setForm,
    qrDataUrl,
    ngrokUrl,
    setNgrokUrl,
    cleanNgrok,
    landingPageUrl,
    adjustOffset,
    handleChange,
    handleSave,
    handleToggleLive,
    id,
    serverBase,
  };
}
