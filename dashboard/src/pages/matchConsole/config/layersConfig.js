import {
  Play,
  Trophy,
  Handshake,
  CloudSun,
  Users,
  Layout,
  Tv,
  BarChart3,
  QrCode,
  Type,
  UserCheck,
  LayoutGrid,
  Sliders,
  Bell,
} from "lucide-react";

// main layers
export const layersConfig = [
  { id: "startScreen", name: "Start Screen", icon: Play },
  { id: "tournament", name: "Tournament", icon: Trophy },
  { id: "sponsors", name: "Sponsors", icon: Handshake },
  { id: "weather", name: " Weather", icon: CloudSun },
  { id: "lineup", name: "Team Lineups", icon: Users },
  { id: "tacticalLineup", name: "Tactical Lineup ", icon: Layout },
  { id: "scorebug", name: "ScoreBug", icon: Tv },
  { id: "statistics", name: " Statistics", icon: BarChart3 },
  { id: "qrCode", name: "QR Code", icon: QrCode },
  { id: "lowerThird", name: "Lower Third", icon: Type },
  { id: "playerSpotlight", name: "Player Spotlight", icon: UserCheck },
];

// sidebar links
export const menuItems = [
  { path: "", name: "Live Control", icon: LayoutGrid, end: true },
  { path: "start-screen", name: "Start Screen", icon: Play, end: true },
  { path: "tournament", name: "Tournament", icon: Trophy, end: true },
  { path: "sponsors", name: "Sponsors", icon: Handshake, end: true },
  { path: "weather", name: "Weather", icon: CloudSun, end: true },
  { path: "lineup", name: "Lineup", icon: Sliders, end: true },
  { path: "scorebug", name: "Score Bug", icon: Tv, end: true },
  { path: "statistics", name: "Statistics", icon: BarChart3, end: true },
  { path: "qr-code", name: "QR Code", icon: QrCode, end: true },
  { path: "lower-third", name: "Lower Third", icon: Type, end: true },
  { path: "notifications", name: "Notifications", icon: Bell, end: true },
  {
    path: "player-spotlight",
    name: "Player Spotlight",
    icon: UserCheck,
    end: true,
  },
];

// ─── Weather Module Configs ───

// weather icons
export const weatherConditionIcons = {
  Sunny: "☀️",
  Cloudy: "☁️",
  Rainy: "🌧️",
  Stormy: "⛈️",
  Wind: "💨",
};

export const weatherConditions = [
  { value: "Sunny", label: "☀️ Sunny" },
  { value: "Cloudy", label: "☁️ Cloudy" },
  { value: "Rainy", label: "🌧️ Rainy" },
  { value: "Stormy", label: "⛈️ Stormy" },
  { value: "Wind", label: "💨 Wind" },
];

export const windDirections = [
  { value: "N", label: "N (North)" },
  { value: "NE", label: "NE (North-East)" },
  { value: "E", label: "E (East)" },
  { value: "SE", label: "SE (South-East)" },
  { value: "S", label: "S (South)" },
  { value: "SW", label: "SW (South-West)" },
  { value: "W", label: "W (West)" },
  { value: "NW", label: "NW (North-West)" },
];

export const pitchConditions = [
  { value: "Dry", label: "Dry (Regular Dry Surface)" },
  { value: "Wet", label: "Wet (Water logged / Heavy rain)" },
  { value: "Damp", label: "Damp (Light moisture surface)" },
  { value: "Greasy", label: "Greasy (Slippery / Fast ball bounce)" },
];

// player positions
export const POSITIONS = [
  { value: "GK", label: "GK (Goalkeeper)" },
  { value: "CB", label: "CB (Center Back)" },
  { value: "LB", label: "LB (Left Back)" },
  { value: "RB", label: "RB (Right Back)" },
  { value: "LWB", label: "LWB (Left Wing Back)" },
  { value: "RWB", label: "RWB (Right Wing Back)" },
  { value: "DM", label: "DM (Defensive Midfielder)" },
  { value: "CM", label: "CM (Central Midfielder)" },
  { value: "AM", label: "AM (Attacking Midfielder)" },
  { value: "LW", label: "LW (Left Winger)" },
  { value: "RW", label: "RW (Right Winger)" },
  { value: "ST", label: "ST (Striker)" },
];

export const STATS_CONFIG = [
  { key: "goals", label: "Goals" },
  { key: "possession", label: "Possession (%)" },
  { key: "shots", label: "Shots" },
  { key: "shotsOnTarget", label: "Shots on Target" },
  { key: "corners", label: "Corners" },
  { key: "fouls", label: "Fouls" },
  { key: "yellowCards", label: "Yellow Cards" },
  { key: "redCards", label: "Red Cards" },
  { key: "offsides", label: "Offsides" },
  { key: "saves", label: "Saves" },
  { key: "passes", label: "Passes" },
];

// default states
export const DEFAULT_QR_STATE = {
  titleQr: "",
  subTitleQr: "",
  website: "",
  instagram: "",
  facebook: "",
  youtube: "",
  x: "",
  yOffset: 0,
  xOffset: 0,
  scale: 1,
};

export const DEFAULT_LOWER_THIRD_STATE = {
  title: "",
  subtitle: "",
  badge: "INFO",
  layout: "left",
  themeMode: "neutral",
  customColor: "#6366f1",
  yOffset: 50,
  xOffset: 0,
  scale: 1,
  speed: 1,
};

export const DEFAULT_NOTIFICATIONS_STATE = {
  type: "substitution",
  yOffset: 50,
  xOffset: 0,
  scale: 1,
  subTeam: "home",
  subPlayerOutId: "",
  subPlayerInId: "",
  cardTeam: "home",
  cardPlayerId: "",
  cardType: "yellow",
  varTitle: "VAR CHECK",
  varDetail: "POSSIBLE PENALTY",
  penaltyTeam: "home",
  penaltyText: "PENALTY KICK",
  penaltyPlayerName: "",
  penaltyShots: [],
  offsideTeam: "home",
  offsidePlayerId: "",
  customPlayerName: "",
  customText: "",
  customBadgeTitle: "PLAYER PROFILE",
  customTeam: "home",
  hydrationTitle: "OFFICIAL COOLING BREAK",
  hydrationMinute: "30'",
  hydrationTemp: "32°C",
  hydrationDetail: "",
  hydrationBadgeTitle: "HYDRATION BREAK",
};

export const DEFAULT_SPOTLIGHT_STATE = {
  team: "home",
  playerId: "",
  playerName: "",
  position: "ST",
  role: "outfield",
  goals: 0,
  assists: 0,
  shots: 0,
  saves: 0,
  conceded: 0,
  savePercentage: 0,
  rating: 8.5,
  playerImgUrl: "https://i.postimg.cc/kX4yXW1b/player-cutout-placeholder.png",
  xOffset: 0,
  yOffset: 0,
  scale: 1,
};

export const TABS_NOTIFICATIONS = [
  { id: "substitution", label: "Substitution", icon: "🔄" },
  { id: "card", label: "Booking Card", icon: "🟨" },
  { id: "var", label: "VAR Check", icon: "📺" },
  { id: "penalty", label: "Penalty Kick", icon: "⚽" },
  { id: "offside", label: "Offside Call", icon: "🚩" },
  { id: "hydration", label: "Hydration Break", icon: "💧" },
  { id: "custom", label: "Custom Profile", icon: "⭐" },
];
