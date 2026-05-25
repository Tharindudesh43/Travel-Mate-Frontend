"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const NEXT_API_PORT = process.env.NEXT_PUBLIC_API_PORT;

export interface ChatSession {
  session_id:    string;
  title:      string;
  created_at: string;
  updated_at: string;
}

interface ChatContextType {
  sessionId:       string;
  startNewChat:    () => void;
  shouldClear:     boolean;
  clearMessages:   () => void;
  sessions:        ChatSession[];
  loadingSessions: boolean;
  sidebarOpen:     boolean;
  setSidebarOpen:  (v: boolean) => void;
  fetchSessions:   (email: string) => Promise<void>;
  switchSession:   (chatId: string) => void;
  deleteSession:   (session_id: string, email: string) => Promise<void>;
  activeSessionId: string;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessionId,       setSessionId]       = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [shouldClear,     setShouldClear]     = useState<boolean>(false);
  const [sessions,        setSessions]        = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [switchTo,        setSwitchTo]        = useState<string | null>(null);

  useEffect(() => {
    const existing = sessionStorage.getItem("travel_session_id");
    const id = existing || uuidv4();
    if (!existing) sessionStorage.setItem("travel_session_id", id);
    setSessionId(id);
    setActiveSessionId(id);
  }, []);

  const startNewChat = () => {
    const newId = uuidv4();
    sessionStorage.setItem("travel_session_id", newId);
    setSessionId(newId);
    setActiveSessionId(newId);
    setShouldClear(true);

    if (sessionId) {
      fetch(`${NEXT_API_PORT}/session/${sessionId}`, { method: "DELETE" })
        .catch(console.error);
    }
  };

  const clearMessages = () => setShouldClear(false);

  const fetchSessions = useCallback(async (email: string) => {
    if (!email) return;
    setLoadingSessions(true);
    try {
      const res  = await fetch(`${NEXT_API_PORT}/get_sessions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ email }),
      });
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      console.error("fetchSessions error:", e);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const switchSession = useCallback((chatId: string) => {
    sessionStorage.setItem("travel_session_id", chatId);
    setSessionId(chatId);
    setActiveSessionId(chatId);
    setShouldClear(true);  
    setSwitchTo(chatId);  
  }, []);

  const deleteSession = useCallback(async (session_id: string, email: string) => {
    try {
      await fetch(`${NEXT_API_PORT}/delete_session/${session_id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.session_id !== session_id));
      if (session_id === sessionId) startNewChat();
    } catch (e) {
      console.error("deleteSession error:", e);
    }
  }, [sessionId]);

  return (
    <ChatContext.Provider value={{
      sessionId, startNewChat, shouldClear, clearMessages,
      sessions, loadingSessions, sidebarOpen, setSidebarOpen,
      fetchSessions, switchSession, deleteSession, activeSessionId,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be inside ChatProvider");
  return ctx;
}