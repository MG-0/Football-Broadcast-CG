import { useState, useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import api from "../../../../api/axios.js";
import { toast } from "react-toastify";

export default function useScorebug() {
  const { matchData, overLayStates, toggleOverlay, refreshMatchData } =
    useOutletContext();
  const { id } = useParams();

  const isLive = overLayStates.scorebug || false;

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [period, setPeriod] = useState("1H");
  const [isRunning, setIsRunning] = useState(false);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [scale, setScale] = useState(1);
  const [addedTime, setAddedTime] = useState(0);

  // store to setInterval() to stop it
  const intervalRef = useRef(null);

  // to avoid stale closure
  const timeRef = useRef({ minute, second });

  // Load saved scorebug data from matchData on mount
  useEffect(() => {
    const saved = matchData?.match?.graphics?.scorebug;

    if (saved) {
      setHomeScore(saved.homeScore ?? 0);
      setAwayScore(saved.awayScore ?? 0);
      setMinute(saved.minute ?? 0);
      setSecond(saved.second ?? 0);
      setPeriod(saved.period ?? "1H");
      setXOffset(saved.xOffset ?? 0);
      setYOffset(saved.yOffset ?? 0);
      setScale(saved.scale ?? 1);
      setAddedTime(saved.addedTime ?? 0);
      setIsRunning(false);
    }
  }, [matchData]);

  // Keep timeRef in sync with state for interval reads
  useEffect(() => {
    timeRef.current = { minute, second };
  }, [minute, second]);

  // Auto timer: tick every second when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        let { minute: m, second: s } = timeRef.current;

        s += 1;
        if (s > 59) {
          s = 0;
          m = Math.min(120, m + 1);
        }
        setMinute(m);
        setSecond(s);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const fmt = (val) => String(val).padStart(2, "0");

  const logoUrl = (img) =>
    img ? `/uploads/misc/${img}` : null;

  const adjustOffset = (key, amount) => {
    const setter = key === "xOffset" ? setXOffset : setYOffset;

    setter((prev) => Math.max(-200, Math.min(800, prev + amount)));
  };

  // Collect all current scorebug data into a payload object
  const getScorebugPayload = (isUpdate = false) => ({
    scorebug: {
      homeScore,
      awayScore,
      minute,
      second,
      period,
      isRunning,
      xOffset,
      yOffset,
      scale,
      addedTime,
      isUpdate,
      homeTeam: {
        name: matchData?.homeTeam?.shortName || matchData?.homeTeam?.name,
        imageUrl: matchData?.homeTeam?.imageUrl,
        primaryColor: matchData?.homeTeam?.primaryColor,
      },
      awayTeam: {
        name: matchData?.awayTeam?.shortName || matchData?.awayTeam?.name,
        imageUrl: matchData?.awayTeam?.imageUrl,
        primaryColor: matchData?.awayTeam?.primaryColor,
      },
      tournament: {
        name: matchData?.tournament?.name,
        logoUrl: matchData?.tournament?.logoUrl,
      },
    },
  });

  // Save current state permanently to database
  const handleSave = async () => {
    try {
      await api.patch(`/routes/matches/${id}/scorebug`, {
        homeScore,
        awayScore,
        minute,
        second,
        period,
        isRunning: false,
        xOffset,
        yOffset,
        scale,
        addedTime,
      });
      if (refreshMatchData) await refreshMatchData();
      toast.success("Score Bug saved successfully!");
    } catch (err) {
      console.error("Failed to save score bug:", err);
      toast.error("Failed to save Score Bug.");
    }
  };

  // Toggle the scorebug live on stream
  const handleToggleLive = () => {
    if (isLive) {
      toggleOverlay("scorebug", false);
    } else {
      toggleOverlay("scorebug", true, getScorebugPayload(false));
    }
  };

  // Auto-emit real-time sync when live
  useEffect(() => {
    if (isLive) {
      toggleOverlay("scorebug", true, getScorebugPayload(true), true);
    }
  }, [
    homeScore,
    awayScore,
    minute,
    second,
    period,
    isRunning,
    isLive,
    xOffset,
    yOffset,
    scale,
    addedTime,
  ]);

  const PERIODS = ["1H", "HT", "2H", "ET", "PEN", "FT"];

  const periodLabels = {
    "1H": "1st Half",
    HT: "Half Time",
    "2H": "2nd Half",
    ET: "Extra Time",
    PEN: "Penalties",
    FT: "Full Time",
  };

  const getPeriodStyle = (p) => {
    const colors = {
      "1H": "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
      HT: "bg-amber-500/10  border-amber-500/40  text-amber-400",
      "2H": "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
      ET: "bg-orange-500/10 border-orange-500/40 text-orange-400",
      PEN: "bg-rose-500/10   border-rose-500/40   text-rose-400",
      FT: "bg-slate-700/30  border-slate-600/30  text-slate-400",
    };

    return colors[p] || colors["1H"];
  };

  return {
    matchData,
    isLive,
    homeScore,
    setHomeScore,
    awayScore,
    setAwayScore,
    minute,
    setMinute,
    second,
    setSecond,
    period,
    setPeriod,
    isRunning,
    setIsRunning,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    scale,
    setScale,
    addedTime,
    setAddedTime,
    fmt,
    logoUrl,
    adjustOffset,
    handleSave,
    handleToggleLive,
    PERIODS,
    periodLabels,
    getPeriodStyle,
  };
}
