import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/login";
// import Register from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";
import Teams from "./pages/teams/teams";
import Sponsors from "./pages/sponsors/sponsors";
import Tournaments from "./pages/tournaments/tournaments";
import CreateMatch from "./pages/createMatch/createMatch";
import MatchConsole from "./pages/matchConsole/matchConsole";
import LiveLayersPage from "./pages/matchConsole/pages/LiveLayersPage";
import StartScreen from "./pages/matchConsole/pages/startScreen/StartScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TournamentMatch from "./pages/matchConsole/pages/tournament/TournamentMatch";
import SponsorsMatch from "./pages/matchConsole/pages/sponsors/SponsorsMatch";
import WeatherMatch from "./pages/matchConsole/pages/weather/WeatherMatch";
import LineupMatch from "./pages/matchConsole/pages/lineup/LineupMatch";
import ScorebugMatch from "./pages/matchConsole/pages/scorebug/ScorebugMatch";
import StatisticsMatch from "./pages/matchConsole/pages/statistics/StatisticsMatch";
import QRCodeMatch from "./pages/matchConsole/pages/qrCode/QrCodeMatch";
import LowerThirdMatch from "./pages/matchConsole/pages/lowerThird/LowerThirdMatch";
import NotificationsMatch from "./pages/matchConsole/pages/notifications/NotificationsMatch";
import PlayerSpotlightMatch from "./pages/matchConsole/pages/playerSpotlight/PlayerSpotlightMatch";
import ProtectRoutes from "./components/ProtectRoutes";

// main component
function App() {
  // router setup
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Redirect empty path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        <Route element={<ProtectRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/create-match" element={<CreateMatch />} />

          {/* Match Console and sub-routing */}
          <Route path="/match/:id" element={<MatchConsole />}>
            <Route index element={<LiveLayersPage />} />
            <Route path="start-screen" element={<StartScreen />} />
            <Route path="tournament" element={<TournamentMatch />} />
            <Route path="sponsors" element={<SponsorsMatch />} />
            <Route path="weather" element={<WeatherMatch />} />
            <Route path="lineup" element={<LineupMatch />} />
            <Route path="scorebug" element={<ScorebugMatch />} />
            <Route path="statistics" element={<StatisticsMatch />} />
            <Route path="qr-code" element={<QRCodeMatch />} />
            <Route path="lower-third" element={<LowerThirdMatch />} />
            <Route path="notifications" element={<NotificationsMatch />} />
            <Route path="player-spotlight" element={<PlayerSpotlightMatch />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
