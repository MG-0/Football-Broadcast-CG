import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";
import { weatherConditionIcons } from "../../config/layersConfig";

export default function useWeather() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.weather || false;

  // Local state for weather form inputs
  const [location, setLocation] = useState("");
  const [temperature, setTemperature] = useState(25);
  const [condition, setCondition] = useState("Sunny");
  const [humidity, setHumidity] = useState(50);
  const [windSpeed, setWindSpeed] = useState(10);
  const [windDirection, setWindDirection] = useState("NE");
  const [rainProbability, setRainProbability] = useState(0);
  const [pitchCondition, setPitchCondition] = useState("Dry");
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);

  // Fetch and load saved weather details from API
  useEffect(() => {
    if (matchData?.match?.graphics?.weather) {
      const saved = matchData.match.graphics.weather;

      setLocation(saved.location || "Cairo International Stadium");
      setTemperature(Number(saved.temperature) || 28);
      setCondition(saved.condition || "Sunny");
      setHumidity(Number(saved.humidity) || 45);
      setWindSpeed(Number(saved.windSpeed) || 12);
      setWindDirection(saved.windDirection || "NE");
      setRainProbability(Number(saved.rainProbability) || 0);
      setPitchCondition(saved.pitchCondition || "Dry");
      setXOffset(saved.xOffset ?? 0);
      setYOffset(saved.yOffset ?? 0);
      setScale(saved.scale ?? 1);
    }
  }, [matchData]);

  // Read weather icon dynamically from config mappings
  const getConditionIcon = (cond) => {
    return weatherConditionIcons[cond] || "☀️";
  };

  // Collect form data into a structured payload
  const getWeatherData = (isUpdate = false) => {
    return {
      location,
      temperature,
      condition,
      humidity,
      windSpeed,
      windDirection,
      rainProbability,
      pitchCondition,
      xOffset,
      yOffset,
      scale,
      isUpdate,
    };
  };

  // Save weather config permanently to database
  const handleSaveWeather = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.patch(`/routes/matches/${id}/weather`, getWeatherData(false));
      if (refreshMatchData) {
        await refreshMatchData();
      }
      toast.success("Weather configuration saved successfully!");
    } catch (error) {
      console.error("Failed to save weather config:", error);
      toast.error("Failed to save weather configuration.");
    }
  };

  // Toggle Live status
  const handleToggleLive = () => {
    toggleOverlay("weather", !isLive, { weather: getWeatherData(false) });
  };

  // Real-time synchronization when graphic is live
  useEffect(() => {
    if (isLive) {
      toggleOverlay("weather", true, { weather: getWeatherData(true) }, true);
    }
  }, [
    location,
    temperature,
    condition,
    humidity,
    windSpeed,
    windDirection,
    rainProbability,
    pitchCondition,
    xOffset,
    yOffset,
    scale,
    isLive,
  ]);

  return {
    matchData,
    isLive,
    location,
    setLocation,
    temperature,
    setTemperature,
    condition,
    setCondition,
    humidity,
    setHumidity,
    windSpeed,
    setWindSpeed,
    windDirection,
    setWindDirection,
    rainProbability,
    setRainProbability,
    pitchCondition,
    setPitchCondition,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    getConditionIcon,
    handleSaveWeather,
    handleToggleLive,
  };
}
