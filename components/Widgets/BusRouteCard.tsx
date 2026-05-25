import { Bus, Crown, Shield } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BusRouteCardProps {
  route: any;
  cost: string;
  time_estimate: any;
  description?: string;
}

const BusRouteCard: React.FC<BusRouteCardProps> = ({
  route,
  cost,
  time_estimate,
  description,
}) => {
  const parseFares = (fareString: string): Record<string, string> => {
    try {
      const validJson = fareString.replace(/'/g, '"');
      return JSON.parse(validJson);
    } catch (error) {
      console.error("Parsing error:", error);
      return {};
    }
  };
  const fares = parseFares(cost);

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="px-5 pt-5 pb-4" style={{ background: "#0C447C" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <Bus size={20} color="white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: "rgba(255,255,255,0.55)" }}>Bus route</p>
            <p className="text-base font-bold leading-tight" style={{ color: "white" }}>{route}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#4ade80" }} />
          <div className="flex-1 relative h-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="bus-dot absolute -top-1.5 w-3 h-3 rounded-full"
              style={{ background: "rgba(255,255,255,0.6)" }} />
          </div>
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "#f87171" }} />
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "rgba(255,255,255,0.8)" }}>
            {time_estimate}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 border-b" style={{ borderColor: "#f1f5f9" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
          Fares
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(fares).map(([name, price]) => {
            const isAC = name.includes("AC");
            const isPrivate = name.includes("Private");

            const theme = isPrivate
              ? { bg: "#FAEEDA", border: "#FAC775", iconBg: "#633806", labelColor: "#854F0B", titleColor: "#412402", priceColor: "#412402", priceMuted: "#854F0B" }
              : isAC
              ? { bg: "#E6F1FB", border: "#B5D4F4", iconBg: "#0C447C", labelColor: "#185FA5", titleColor: "#0C447C", priceColor: "#0C447C", priceMuted: "#185FA5" }
              : { bg: "#f8fafc", border: "#e2e8f0", iconBg: "#E6F1FB", labelColor: "#64748b", titleColor: "#1e293b", priceColor: "#0C447C", priceMuted: "#64748b" };

            const rawPrice = price.includes("Rs.") ? price.split(".").slice(1).join(".").trim() : price;

            return (
              <div key={name}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 transition-all"
                style={{ background: theme.bg, border: `0.5px solid ${theme.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: theme.iconBg }}>
                    {isPrivate
                      ? <Crown size={15} color="white" />
                      : <Bus size={15} color={isAC ? "white" : "#185FA5"} />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: theme.labelColor, marginBottom: 1 }}>Service</p>
                    <p className="text-sm font-bold leading-tight" style={{ color: theme.titleColor }}>{name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: theme.labelColor, marginBottom: 1 }}>Fare</p>
                  <p className="text-base font-black leading-tight" style={{ color: theme.priceColor }}>
                    {rawPrice}
                    <span className="text-xs font-medium ml-1" style={{ color: theme.priceMuted }}>LKR</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {description && (
        <div className="px-5 py-4 border-b" style={{ borderColor: "#f1f5f9" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
            About this route
          </p>
          <div className="text-sm leading-relaxed" style={{ color: "#475569" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3 rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                    <table className="min-w-full divide-y" style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead style={{ background: "#f1f5f9" }}>{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#64748b" }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2.5 text-sm border-t" style={{ color: "#334155", borderColor: "#e2e8f0" }}>
                    {children}
                  </td>
                ),
                strong: ({ children }) => (
                  <span className="font-bold" style={{ color: "#0C447C" }}>{children}</span>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-5 space-y-1.5 my-3" style={{ color: "#475569" }}>{children}</ul>
                ),
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed" style={{ color: "#475569" }}>{children}</p>
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <div className="px-5 py-3 flex items-center justify-center gap-2">
        <Shield size={11} color="#94a3b8" />
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          Data sourced from public information. Please validate before travel.
        </p>
      </div>

      <style jsx>{`
        @keyframes driveLinearNoOverlap {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(100px); }
          100% { transform: translateX(0); }
        }
        .bus-dot {
          animation: driveLinearNoOverlap 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BusRouteCard;