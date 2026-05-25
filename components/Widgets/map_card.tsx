"use client";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { MapPin, AlertCircle, Locate, Navigation, Shield } from "lucide-react";
import { createPortal } from "react-dom";

interface MapCardProps {
  end: { lat: number; lng: number };
  destinationName?: string;
}

const COLOMBO = { lat: 6.9271, lng: 79.8612 };
type LocationStatus = "loading" | "granted" | "denied" | "colombo";

function MapCard({ end, destinationName }: MapCardProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const startMarker = useRef<any>(null);
  const endMarker = useRef<any>(null);
  const watchId = useRef<number | null>(null);
  const isClient = useRef(false);
  const [status, setStatus] = useState<LocationStatus>("loading");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [isClient2, setIsClient2] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [showSettingsGuide, setShowSettingsGuide] = useState(false);

  const getBrowserInstructions = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Edg")) return { browser: "Edge", icon: "🌐", steps: ["Turn on Location Services","Click the 🔒 lock in address bar", "Click Permissions", "Set Location to Allow", "Reload page"] };
    if (ua.includes("Chrome")) return { browser: "Chrome", icon: "🔵", steps: ["Turn on Location Services","Click the 🔒 lock in address bar", "Click Site Settings", "Set Location to Allow", "Reload page"] };
    if (ua.includes("Firefox")) return { browser: "Firefox", icon: "🦊", steps: ["Turn on Location Services","Click the 🔒 lock in address bar", "Click Connection Secure", "More Info → Permissions", "Allow Location → Reload"] };
    if (ua.includes("Safari")) return { browser: "Safari", icon: "🧭", steps: ["Turn on Location Services","Safari menu → Settings for This Website", "Set Location to Allow", "Reload page"] };
    return { browser: "Browser", icon: "🌍", steps: ["Turn on Location Services","Open browser settings", "Find Site Permissions", "Set Location to Allow", "Reload page"] };
  };

  useEffect(() => { setIsClient2(true); }, []);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const sendLocationNotification = useCallback(() => {
    if (!("Notification" in window)) return;
    const send = () => new Notification("📍 TravelMate — Location Blocked", { body: "To enable: click the 🔒 lock icon in your browser address bar → Site Settings → Location → Allow → Reload the page.", icon: "/marker-icon.png", tag: "location-request" });
    if (Notification.permission === "granted") send();
    else if (Notification.permission === "default") Notification.requestPermission().then(p => { if (p === "granted") send(); });
  }, []);

  useEffect(() => {
    if (!isClient2) return;
    if (!("geolocation" in navigator)) { setStatus("colombo"); sendLocationNotification(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setAccuracy(pos.coords.accuracy); setStatus("granted"); },
      () => { setStatus("denied"); sendLocationNotification(); },
      { enableHighAccuracy: true, timeout: 8000 }
    );
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(newLoc); setAccuracy(pos.coords.accuracy); setStatus("granted");
        if (startMarker.current && mapInstance.current) startMarker.current.setLatLng([newLoc.lat, newLoc.lng]);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    return () => { if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current); };
  }, [isClient2, sendLocationNotification]);

  useEffect(() => {
    if (!isClient2 || !mapRef.current || status === "loading") return;
    const startCoord = userLoc ?? COLOMBO;
    import("leaflet").then(async ({ default: L }) => {
      await import("leaflet-routing-machine");
      const startIcon = L.divIcon({ className: "", html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);border:3px solid white;box-shadow:0 2px 12px rgba(59,130,246,0.6);display:flex;align-items:center;justify-content:center;animation:pulse-blue 2s infinite;"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div><style>@keyframes pulse-blue{0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.5);}50%{box-shadow:0 0 0 10px rgba(59,130,246,0);}}</style>`, iconSize: [36, 36], iconAnchor: [18, 18] });
      const endIcon = L.divIcon({ className: "", html: `<div style="width:36px;height:44px;position:relative;"><div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:linear-gradient(135deg,#ef4444,#b91c1c);border:3px solid white;box-shadow:0 2px 12px rgba(239,68,68,0.6);"></div><div style="position:absolute;top:6px;left:6px;width:20px;height:20px;border-radius:50%;background:white;transform:rotate(45deg);"></div></div>`, iconSize: [36, 44], iconAnchor: [18, 44] });
      if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; startMarker.current = null; endMarker.current = null; }
      const map = L.map(mapRef.current!, { zoomControl: true, attributionControl: false }).setView([startCoord.lat, startCoord.lng], 10);
      mapInstance.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
      startMarker.current = L.marker([startCoord.lat, startCoord.lng], { icon: startIcon }).addTo(map).bindPopup(status === "granted" ? `<b>📍 Your Location</b><br/>Accuracy: ~${Math.round(accuracy ?? 0)}m` : `<b>📍 Colombo Fort</b><br/><small>Enable location for real position</small>`);
      endMarker.current = L.marker([end.lat, end.lng], { icon: endIcon }).addTo(map).bindPopup(`<b>🏁 ${destinationName || "Destination"}</b>`).openPopup();
      map.fitBounds(L.latLngBounds([startCoord.lat, startCoord.lng], [end.lat, end.lng]), { padding: [50, 50] });
      L.Icon.Default.mergeOptions({ iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png", iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png" });
      L.Routing.control({ waypoints: [L.latLng(startCoord.lat, startCoord.lng), L.latLng(end.lat, end.lng)], lineOptions: { styles: [{ color: "#2563eb", weight: 5, opacity: 0.8 }] }, show: false, addWaypoints: false, routeWhileDragging: false, fitSelectedRoutes: true, showAlternatives: false, containerClassName: "hidden" }).addTo(map);
    });
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [isClient2, status, userLoc, end.lat, end.lng, destinationName]);

  if (!isClient2) return null;

  return (
    <div className="w-full my-3 rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid rgba(0,0,0,0.07)" }}>

      {/* Top header band */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: status === "granted"
            ? "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)"
            : status === "loading"
            ? "linear-gradient(90deg, #374151 0%, #4b5563 100%)"
            : "linear-gradient(90deg, #92400e 0%, #b45309 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            {status === "granted"
              ? <Navigation size={15} className="text-white" />
              : status === "loading"
              ? <Locate size={15} className="text-white animate-pulse" />
              : <AlertCircle size={15} className="text-white" />
            }
          </div>
          <div>
            <p className="text-white text-[13px] font-semibold leading-tight">
              {status === "granted" ? "Live Navigation" : status === "loading" ? "Locating you…" : "Location unavailable"}
            </p>
            <p className="text-white/60 text-[11px] leading-tight mt-0.5">
              {status === "granted"
                ? accuracy ? `GPS · ~${Math.round(accuracy)}m accuracy` : "GPS active"
                : status === "loading"
                ? "Waiting for GPS signal"
                : "Showing Colombo as start point"}
            </p>
          </div>
        </div>

        {(status === "denied" || status === "colombo") && (
          <button
            onClick={() => {
              if ("permissions" in navigator) {
                navigator.permissions.query({ name: "geolocation" as PermissionName }).then((perm) => {
                  if (perm.state === "denied") {
                    sendLocationNotification();
                    setToastMsg("Opening settings hint...");
                    setShowSettingsGuide(true);
                  } else {
                    navigator.geolocation?.getCurrentPosition(
                      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setAccuracy(pos.coords.accuracy); setStatus("granted"); setShowSettingsGuide(false); },
                      () => setShowSettingsGuide(true),
                      { enableHighAccuracy: true, timeout: 8000 }
                    );
                  }
                });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
          >
            <Locate size={11} />
            Enable GPS
          </button>
        )}
      </div>

      {/* Route Strip */}
      <div className="flex items-center px-4 py-2.5 bg-white gap-3" style={{ borderBottom: "1px solid #f0f0f0" }}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">From</p>
            <p className="text-[12px] text-gray-800 font-semibold truncate">
              {status === "granted" ? "Your Location" : "Colombo Fort"}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-1 px-1">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center shrink-0">
            <MapPin size={12} className="text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">To</p>
            <p className="text-[12px] text-gray-800 font-semibold truncate">
              {destinationName || "Destination"}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ height: "300px", width: "100%", zIndex: 0 }} />

      {/* Bottom Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white" style={{ borderTop: "1px solid #f0f0f0" }}>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <Shield size={11} />
          <span>Powered by OpenStreetMap</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: status === "granted" ? "#16a34a" : "#9ca3af" }}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === "granted" ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
          <span>{status === "granted" ? "Live" : "Static"}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {status === "loading" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 touch-none"
          style={{ background: "rgba(15,23,42,0.75)", backdropFilter: "blur(12px)" }}>
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" />
              <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-blue-300/50 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Locate size={22} className="text-blue-400" />
              </div>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-widest uppercase">Finding your location</p>
              <p className="text-white/40 text-xs mt-1 tracking-wide">Please allow location access</p>
            </div>
          </div>
        </div>,
        document.body
      )}


      {showSettingsGuide && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <div className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.2)" }}>

            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <MapPin size={17} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Enable Location</p>
                  <p className="text-xs text-gray-400">{getBrowserInstructions().icon} {getBrowserInstructions().browser} detected</p>
                </div>
              </div>
              <button onClick={() => setShowSettingsGuide(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500 text-sm">
                ✕
              </button>
            </div>

            <div className="px-5 py-4 flex flex-col gap-2.5">
              {getBrowserInstructions().steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "white" }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-5 pb-6 flex flex-col gap-2">
              <button onClick={() => window.location.reload()}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                style={{ background: "linear-gradient(90deg,#2563eb,#1d4ed8)" }}>
                Reload after enabling →
              </button>
              <button onClick={() => { setShowSettingsGuide(false); setStatus("colombo"); }}
                className="w-full py-2.5 rounded-2xl text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                Use Colombo instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap text-xs font-medium text-white px-4 py-2 rounded-full"
          style={{ background: "rgba(17,24,39,0.9)", backdropFilter: "blur(8px)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default memo(MapCard);