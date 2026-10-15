import { socket, matchId, timelines } from "./core.js";
import { weatherGsap } from "../animationsGsap.js";

// initialize weather graphics and socket event listeners
export function initWeather() {
  const weatherOverlay = document.getElementById("weather-overlay");

  weatherGsap(timelines.weather, { weatherOverlay });

  // populate DOM elements with weather statistics and condition icon emojis
  function renderWeatherDetails(weather) {
    document.getElementById("weather-val-location").textContent =
      weather.location || "";
    document.getElementById("weather-val-temp").textContent =
      weather.temperature || "";
    document.getElementById("weather-val-condition").textContent =
      weather.condition || "";
    document.getElementById("weather-val-humidity").textContent =
      (weather.humidity || "0") + "%";
    document.getElementById("weather-val-windspeed").textContent =
      (weather.windSpeed || "0") + " km/h";
    document.getElementById("weather-val-winddir").textContent =
      weather.windDirection || "";
    document.getElementById("weather-val-rainprob").textContent =
      (weather.rainProbability || "0") + "%";
    document.getElementById("weather-val-pitch").textContent =
      weather.pitchCondition || "";

    const conditionIcons = {
      Sunny: "☀️",
      Cloudy: "☁️",
      Rainy: "🌧️",
      Stormy: "⛈️",
      Wind: "💨",
    };
    document.getElementById("weather-val-icon").textContent =
      conditionIcons[weather.condition] || "☀️";

    timelines.weather.play();
  }

  // socket listeners for weather graphics control
  socket.on("weather:show", (data) => {
    if (data.matchId !== matchId) return;

    // set custom placement offsets and scaling of the weather box
    const applyPosition = (weatherData) => {
      weatherOverlay.style.bottom = `calc(45px + ${weatherData.yOffset || 0}px)`;
      weatherOverlay.style.left = `calc(45px + ${weatherData.xOffset || 0}px)`;
      weatherOverlay.style.scale = weatherData.scale || 1;
    };

    if (data.weather) {
      if (data.weather.isUpdate) {
        applyPosition(data.weather);
        return;
      }
      applyPosition(data.weather);
      renderWeatherDetails(data.weather);
    } else {
      fetch(`/routes/getMatch/${matchId}`)
        .then((res) => res.json())
        .then((resData) => {
          const savedWeather = resData.match?.graphics?.weather;
          if (savedWeather) {
            applyPosition(savedWeather);
            renderWeatherDetails(savedWeather);
          }
        })
        .catch((err) =>
          console.error("Failed to fetch weather fallback details:", err),
        );
    }
  });

  socket.on("weather:hide", (data) => {
    if (data.matchId !== matchId) return;
    timelines.weather.reverse();
  });
}
