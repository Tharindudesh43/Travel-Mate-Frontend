"use client";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useChatContext, ChatSession } from "@/context/ChatContext";
import {
  MessageCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Zap,
  RefreshCw,
} from "lucide-react";
import { isToday, isYesterday, subDays, isAfter } from "date-fns";
import { createPortal } from "react-dom";

function groupSessions(sessions: ChatSession[]) {
  const now = new Date();
  const groups: Record<string, ChatSession[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };
  for (const s of sessions) {
    const d = new Date(s.updated_at);
    if (isToday(d)) groups["Today"].push(s);
    else if (isYesterday(d)) groups["Yesterday"].push(s);
    else if (isAfter(d, subDays(now, 7))) groups["Last 7 Days"].push(s);
    else groups["Older"].push(s);
  }
  return groups;
}

interface TokenStatus {
  tokens: { limit: string; remaining: string; resets_in: string };
  requests: { limit: string; remaining: string; resets_in: string };
}

function TokenStats() {
  const [data, setData] = useState<TokenStatus | null>(null);
  const [loading, setLoading] = useState(false);
 
  
  const fetch_status = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_PORT}/token_status`);
      const json = await res.json();
      if (json.success) setData(json);
    } catch (_) {}
    setLoading(false);
  }, []);
 
  useEffect(() => {
    fetch_status();
  }, [fetch_status]);
 
  const tokenPct = data
    ? Math.round(
        (parseInt(data.tokens.remaining) / parseInt(data.tokens.limit)) * 100
      )
    : null;
 
  const reqPct = data
    ? Math.round(
        (parseInt(data.requests.remaining) / parseInt(data.requests.limit)) * 100
      )
    : null;
 
  const barColor = (pct: number) =>
    pct > 50 ? "bg-emerald-400" : pct > 20 ? "bg-amber-400" : "bg-red-400";
 
  return (
    <div className="mx-3 mb-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Zap size={11} className="text-blue-500" />
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
            Agent Usage
          </span>
        </div>
        <button
          onClick={fetch_status}
          disabled={loading}
          className="p-0.5 rounded hover:bg-gray-200 transition-colors"
        >
          <RefreshCw
            size={10}
            className={`text-gray-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
 
      {loading && !data ? (
        <div className="flex justify-center py-2">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-500">Tokens / min</span>
              <span className="text-[10px] font-medium text-gray-700">
                {parseInt(data.tokens.remaining).toLocaleString()}
                <span className="text-gray-400 font-normal">
                  /{parseInt(data.tokens.limit).toLocaleString()}
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(tokenPct!)}`}
                style={{ width: `${tokenPct}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Resets in {data.tokens.resets_in}
            </p>
          </div>
 
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-500">Requests / day</span>
              <span className="text-[10px] font-medium text-gray-700">
                {parseInt(data.requests.remaining).toLocaleString()}
                <span className="text-gray-400 font-normal">
                  /{parseInt(data.requests.limit).toLocaleString()}
                </span>
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(reqPct!)}`}
                style={{ width: `${reqPct}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Resets in {data.requests.resets_in}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-gray-400 text-center py-1">
          Could not load stats
        </p>
      )}
    </div>
  );
}
 


export default function SessionSidebar() {
  const { isSignedIn, user } = useUser();
  const {
    sessions,
    loadingSessions,
    sidebarOpen,
    setSidebarOpen,
    fetchSessions,
    switchSession,
    deleteSession,
    startNewChat,
    activeSessionId,
  } = useChatContext();

  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  useEffect(() => {
    if (sidebarOpen && email) fetchSessions(email);
  }, [sidebarOpen, email, fetchSessions]);

  const groups = groupSessions(sessions);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-16 z-[61] flex items-center justify-center
              w-6 h-10 bg-white border border-gray-200 shadow-md
              transition-all duration-300 rounded-r-lg hover:bg-gray-50
              ${sidebarOpen ? "left-64" : "left-0"}`}
      >
        {sidebarOpen ? (
          <ChevronLeft size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>

      <div
        className={`fixed top-0 left-0 h-full z-[60] bg-white border-r
                 border-gray-200 shadow-xl flex flex-col
                 transition-all duration-300 ease-in-out
                 ${sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 pt-16 pb-3 border-b border-gray-100">
          <span className="font-semibold text-sm text-gray-700">Chats</span>
          <button
            onClick={() => {
              startNewChat();
              setSidebarOpen(false);
            }}
            className="flex cursor-pointer items-center gap-1 px-2 py-1 text-xs bg-blue-50
                       text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus size={12} /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loadingSessions ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400 px-4">
              <MessageCircle size={24} className="mx-auto mb-2 opacity-40" />
              No chat history yet
            </div>
          ) : (
            Object.entries(groups).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label} className="mb-2">
                  <p className="px-4 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {label}
                  </p>
                  {items.map((session) => (
                    <SessionItem
                      key={session.session_id}
                      session={session}
                      isActive={session.session_id === activeSessionId}
                      onSelect={() => {
                        switchSession(session.session_id);
                        setSidebarOpen(false);
                      }}
                      onDelete={() => deleteSession(session.session_id, email)}
                    />
                  ))}
                </div>
              ),
            )
          )}
        </div>

        <TokenStats />

        {isSignedIn && (
          <div className="border-t border-gray-100 p-3 flex items-center gap-2">
            <img
              src={user?.imageUrl || "https://github.com/openai.png"}
              alt="avatar"
              className="w-7 h-7 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-gray-400 truncate">{email}</p>
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div
        className={`group relative flex items-center gap-2 px-3 py-2 mx-2
                    rounded-lg cursor-pointer transition-colors text-sm
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
        onClick={onSelect}
      >
        <MessageCircle size={13} className="flex-shrink-0 opacity-60" />
        <span className="flex-1 truncate text-xs">{session.title}</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDelete(true);
          }}
          className="flex-shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-100
                     hover:bg-red-100 hover:text-red-500 transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {showDelete &&
        typeof document !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDelete(false)}
            />

            <div
              className="fixed z-[1000] top-1/2 left-1/2
                          -translate-x-1/2 -translate-y-1/2
                          bg-white rounded-2xl shadow-2xl p-5 w-72"
            >
              <div className="flex justify-center mb-3">
                <div
                  className="w-10 cursor-pointer h-10 rounded-full bg-red-100
                              flex items-center justify-center"
                >
                  <Trash2 size={18} className="text-red-500" />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-800 text-center mb-1">
                Delete this chat?
              </h3>
              <p className="text-xs text-gray-500 text-center mb-4 truncate px-2">
                "{session.title}"
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onDelete();
                    setShowDelete(false);
                  }}
                  className="flex-1 cursor-pointer py-2 bg-red-500 text-white text-sm
                           font-medium rounded-xl hover:bg-red-600
                           transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 cursor-pointer py-2 bg-gray-100 text-gray-700 text-sm
                           font-medium rounded-xl hover:bg-gray-200
                           transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
