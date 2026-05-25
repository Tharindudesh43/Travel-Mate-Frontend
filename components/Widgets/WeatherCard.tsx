"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

import Sunny from "../../public/animations/sunny.json";
import Cloudy from "../../public/animations/cloudy.json";
import Dizzle from "../../public/animations/dizzle.json";
import Rainy from "../../public/animations/rainy.json";
import Clouds from "../../public/animations/clouds.json";

interface WeatherCardProps {
  temp?: number | null;
  type?: string | null;
  feels_like?: number | null;
  humidity?: number | null;
  is_raining?: boolean | null;
  wind_speed?: number | null;
}

const getAnimationKey = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes("clear") || t.includes("mainly clear")) return "Sunny";
  if (t.includes("thunder")) return "Rainy";
  if (t.includes("rain") || t.includes("drizzle") || t.includes("shower"))
    return "Dizzle";
  if (t.includes("overcast")) return "Clouds";
  if (t.includes("cloud") || t.includes("fog") || t.includes("partly"))
    return "Cloudy";
  return "Sunny";
};

const getBgColor = (temp: number, type: string): string => {
  const t = type.toLowerCase();
  if (t.includes("thunder"))
    return "linear-gradient(135deg, #2c3e50 0%, #4a00e0 100%)";
  if (t.includes("rain") || t.includes("shower"))
    return "linear-gradient(135deg, #4682B4 0%, #1E90FF 100%)";
  if (t.includes("drizzle"))
    return "linear-gradient(135deg, #6a9fd8 0%, #a8c8e8 100%)";
  if (t.includes("overcast") || t.includes("fog"))
    return "linear-gradient(135deg, #A9A9A9 0%, #696969 100%)";
  if (t.includes("cloud") || t.includes("partly"))
    return "linear-gradient(135deg, #89a4c7 0%, #b8cce4 100%)";
  if (t.includes("clear") || t.includes("sunny"))
    return temp > 25
      ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
      : "linear-gradient(135deg, #FFA500 0%, #FF6347 100%)";
  return "linear-gradient(135deg, #87CEEB 0%, #00BFFF 100%)";
};

const getConditionLabel = (
  type: string,
  is_raining?: boolean | null,
): string => {
  const t = type.toLowerCase();
  if (t.includes("thunder")) return "⚡ Storm active";
  if (is_raining) return "● Raining now";
  if (t.includes("drizzle")) return "● Drizzling";
  return "";
};

const WeatherCard = ({
  temp,
  type,
  feels_like,
  humidity,
  is_raining,
  wind_speed,
}: WeatherCardProps) => {
  const [animationData, setAnimationData] = useState<any>(Sunny);
  const animations: Record<string, any> = {
    Sunny,
    Cloudy,
    Dizzle,
    Rainy,
    Clouds,
  };

  useEffect(() => {
    if (!type) return;
    const key = getAnimationKey(type);
    setAnimationData(animations[key] ?? Sunny);
  }, [type]);

  const displayTemp = temp ?? "--";
  const displayType = type ?? "Unknown";
  const displayHum = humidity != null ? `Humidity ${humidity}%` : null;
  const displayFeels = feels_like != null ? `Feels ${feels_like}°` : null;
  const displayWind = wind_speed != null ? `Wind ${wind_speed} km/h` : null;
  const conditionBadge = type ? getConditionLabel(type, is_raining) : "";
  const bgColor = getBgColor(temp ?? 25, displayType);

  return (
    <div
      style={{
        width: "210px",
        borderRadius: "20px",
        background: bgColor,
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "white",
        margin: "6px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-24px",
          right: "-24px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-32px",
          left: "-16px",
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.07)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ padding: "16px 16px 14px", position: "relative", zIndex: 1 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                margin: "0 0 3px",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {displayType}
            </p>
            <p
              style={{
                fontSize: "40px",
                fontWeight: 800,
                margin: 0,
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              {displayTemp}°
              <span style={{ fontSize: "18px", fontWeight: 400, opacity: 0.7 }}>
                C
              </span>
            </p>
          </div>

          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {animationData && (
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ width: 36, height: 36 }}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px",
            marginTop: "12px",
          }}
        >
          {displayFeels && <span style={pill}>{displayFeels}</span>}
          {displayHum && <span style={pill}>{displayHum}</span>}
          {displayWind && <span style={pill}>{displayWind}</span>}
          {conditionBadge && (
            <span
              style={{
                ...pill,
                background: "rgba(255,255,255,0.22)",
                fontWeight: 700,
              }}
            >
              {conditionBadge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const pill: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  padding: "3px 9px",
  borderRadius: "99px",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  whiteSpace: "nowrap",
};

export default WeatherCard;
