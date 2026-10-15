// entry point to initialize all overlay modules

import { initStartScreen } from "./modules/startScreen.js";
import { initTournament } from "./modules/tournament.js";
import { initSponsors } from "./modules/sponsors.js";
import { initWeather } from "./modules/weather.js";
import { initScorebug } from "./modules/scorebug.js";
import { initLineup } from "./modules/lineup.js";
import { initStatistics } from "./modules/statistics.js";
import { initQrCode } from "./modules/qrCode.js";
import { initPlayerSpotlight } from "./modules/playerSpotlight.js";
import { initLowerThird } from "./modules/lowerThird.js";
import { initNotifications } from "./modules/notifications.js";

// Initialize all graphic overlay modules and bind socket event listeners
initStartScreen();
initTournament();
initSponsors();
initWeather();
initLineup();
initScorebug();
initStatistics();
initQrCode();
initLowerThird();
initNotifications();
initPlayerSpotlight();
