import React from "react";
import {
  QrCode,
  Save,
  Link2,
  Globe,
  Camera,
  Share2,
  Video,
  Hash,
} from "lucide-react";
import useQrCode from "./useQrCode";

import PageHeader from "../../../../components/Header";
import LiveToggle from "../../../../components/LiveToggle";
import LayoutControls from "../../../../components/LayoutControls";
import FormInput from "../../../../components/FormInput";

export default function QRCodeMatch() {
  const {
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
  } = useQrCode();

  // Social config list with standard utility vector icons
  const SOCIAL_CONFIGS = [
    {
      key: "website",
      label: "Website Link",
      Icon: Globe,
      placeholder: "https://yoursite.com",
    },
    {
      key: "instagram",
      label: "Instagram Handle",
      Icon: Camera,
      placeholder: "@handle or URL",
    },
    {
      key: "facebook",
      label: "Facebook Link",
      Icon: Share2,
      placeholder: "@handle or URL",
    },
    {
      key: "youtube",
      label: "YouTube Channel",
      Icon: Video,
      placeholder: "Channel URL",
    },
    {
      key: "x",
      label: "X (Twitter) Handle",
      Icon: Hash,
      placeholder: "@handle or URL",
    },
  ];

  return (
    <div className="space-y-8 flex-grow flex flex-col font-inter relative z-10 min-h-full">
      {/* Ambient background glow spot */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/5 blur-[130px]" />
      </div>

      <PageHeader
        title="QR Code Graphic"
        description="Configure, save, and broadcast a live QR code graphic that viewers can scan to access your landing page and social links."
        Icon={QrCode}
      />

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow ml-4">
        {/* Left Column: Preview & Layout Controls */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-455 uppercase tracking-widest font-mono">
            Graphics Layout Preview
          </h3>

          {/* Simulated TV Screen Output */}
          <div className="aspect-video w-full rounded-3xl bg-[#090f1d] border border-slate-800/80 shadow-2xl relative overflow-hidden flex items-end justify-end p-6">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />
            <div className="absolute top-4 left-4 bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold text-fuchsia-450 uppercase z-10">
              1080p Stream Output
            </div>

            {/* QR Card Mockup positioned dynamically */}
            <div
              className="relative w-[50%] sm:w-[42%] origin-bottom-right rounded-2xl overflow-hidden border border-slate-800/60 shadow-2xl flex flex-col items-center bg-gradient-to-br from-[#0a0f1d] to-[#161e31] p-3 sm:p-4 gap-2 z-10 transition-all duration-75"
              style={{
                bottom: `${(form.yOffset || 0) / 7}px`,
                right: `${-(form.xOffset || 0) / 7}px`,
                transform: `scale(${form.scale || 1})`,
              }}
            >
              {/* Premium Gradient Top Border Bumper */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1 sm:p-1.5 shadow-md flex items-center justify-center mt-1 shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR"
                    className="w-full h-full object-contain select-none"
                  />
                ) : (
                  <span className="text-slate-400 text-[8px] font-mono">
                    Loading...
                  </span>
                )}
              </div>
              <div className="text-center w-full min-w-0">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-100 uppercase tracking-wider truncate w-full font-outfit">
                  {form.titleQr || "Scan to Follow"}
                </p>
                <p className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase truncate w-full tracking-wider mt-0.5 font-mono">
                  {form.subTitleQr || "Interactive Overlay"}
                </p>
              </div>
            </div>
          </div>

          {/* Live Toggle */}
          <LiveToggle isLive={isLive} onToggle={handleToggleLive} />

          {/* Custom Landing Page Link preview info */}
          <div className="bg-[#0b1021]/80 border border-slate-850 p-5 rounded-3xl space-y-3 shadow-md flex items-center gap-4">
            <span className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 text-fuchsia-450" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block">
                QR Code Destination Link
              </span>
              <a
                href={landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-fuchsia-400 hover:text-fuchsia-350 transition-colors truncate block font-outfit mt-0.5"
              >
                {landingPageUrl} ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Form Settings */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            Data Entry & Settings
          </h3>

          <div className="bg-[#0b1021]/80 border border-slate-850 rounded-3xl p-6 shadow-xl space-y-5">
            {/* ngrok setup tunnel */}
            <div className="bg-fuchsia-950/10 border border-fuchsia-850/20 p-5 rounded-2xl space-y-3.5 shadow-inner">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-fuchsia-450" />
                </span>
                <h4 className="text-[10px] font-black text-fuchsia-300 uppercase tracking-widest font-mono">
                  ngrok Public Tunnel Address
                </h4>
              </div>
              <input
                type="text"
                value={ngrokUrl}
                onChange={(e) => setNgrokUrl(e.target.value)}
                placeholder="https://xxxx.ngrok-free.app"
                className="w-full bg-slate-955 border border-slate-850 focus:border-fuchsia-500/50 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/20 transition duration-150 font-mono placeholder-slate-650"
              />
              <p className="text-[9px] text-slate-500 leading-normal">
                💡 <strong>Important:</strong> Set an ngrok URL to allow viewers
                scanning the QR code on mobile devices to reach the local server
                landing page.
              </p>
            </div>

            {/* Title & Subtitle Card Texts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Card Title Text"
                name="titleQr"
                type="text"
                placeholder="e.g. Scan to Follow Us"
                value={form.titleQr}
                onChange={(e) => handleChange("titleQr", e.target.value)}
              />
              <FormInput
                label="Card Subtitle Text"
                name="subTitleQr"
                type="text"
                placeholder="e.g. Social Landing Page"
                value={form.subTitleQr}
                onChange={(e) => handleChange("subTitleQr", e.target.value)}
              />
            </div>

            {/* Social Links Form List */}
            <div className="space-y-4 border-t border-slate-900/60 pt-5">
              <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block font-mono">
                Landing Page Social Links
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOCIAL_CONFIGS.map(({ key, label, Icon, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-200 uppercase tracking-widest font-outfit flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-fuchsia-450 shrink-0" />
                      {label}
                    </label>
                    <input
                      type="text"
                      value={form[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-slate-955 border border-slate-850 focus:border-fuchsia-500/50 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/20 transition duration-150 font-inter placeholder-slate-650"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/30 rounded-2xl text-xs font-black uppercase tracking-widest transition duration-150 shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2.5 font-outfit active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4 text-white shrink-0" />
              Save QR Code to Database
            </button>
          </div>

          {/* Positioning Offset Controls */}
          <LayoutControls
            xOffset={form.xOffset || 0}
            setXOffset={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.xOffset || 0)
                    : updater;

                return { ...prev, xOffset: nextVal };
              });
            }}
            yOffset={form.yOffset || 0}
            setYOffset={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.yOffset || 0)
                    : updater;

                return { ...prev, yOffset: nextVal };
              });
            }}
            scale={form.scale || 1}
            setScale={(updater) => {
              setForm((prev) => {
                const nextVal =
                  typeof updater === "function"
                    ? updater(prev.scale || 1)
                    : updater;

                return { ...prev, scale: nextVal };
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
