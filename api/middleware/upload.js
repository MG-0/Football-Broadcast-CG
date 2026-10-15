const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ─── Dynamic destination based on route ──────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine subfolder from route path
    let folder = "misc";
    const url = req.originalUrl || "";

    if (url.includes("/teams")) folder = "teams";
    else if (url.includes("/sponsors")) folder = "sponsors";
    else if (url.includes("/players") || url.includes("/player-spotlight"))
      folder = "players";
    else if (url.includes("/tournament-logo")) folder = "tournament";

    const dir = path.join(__dirname, "../uploads", folder);

    fs.mkdirSync(dir, { recursive: true }); // create if missing
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// ─── File type filter ─────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed (jpeg, png, jpg, webp, svg)."),
      false,
    );
  }
};

// ─── Export ───────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
