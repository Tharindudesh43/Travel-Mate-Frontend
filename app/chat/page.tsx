"use client";

import styles from "../../styles/HotelCard.module.css";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import { useChatContext } from "@/context/ChatContext";
import { Phone, ShieldAlert, LifeBuoy } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import remarkGfm from "remark-gfm";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/shadcn-io/ai/message";
import WeatherCard from "../../components/Widgets/WeatherCard";
import BusRouteCard from "../../components/Widgets/BusRouteCard";
import { v4 as uuidv4 } from "uuid";
import HotelCard from "../../components/Widgets/HotelCard";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { PaperclipIcon } from "lucide-react";
import dynamic from "next/dynamic";
import TrainCard from "@/components/Widgets/TrainCard";
import ChatIcon from "@/public/ChatIcon.png";
import SessionSidebar from "@/components/Widgets/SessionSidebar";


const NEXT_API_PORT = process.env.NEXT_PUBLIC_API_PORT;

const MapCard = dynamic(() => import("../../components/Widgets/map_card"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "12px",
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Loading map...
    </div>
  ),
});

const models = [
  { id: "Travel Mate Standard", name: "Travel Mate Standard" },
  { id: "Travel Mate Pro", name: "Travel Mate Pro" },
];

type Props = { placeholder?: string; autoFocus?: boolean };

const suggestions = [
  "What are the best hotels near Colombo?",
  "Suggest me a 3-day trip plan in Kandy",
  "How is the weather in Nuwara Eliya?",
  "Show me top beaches in Sri Lanka",
  "How can I travel from Colombo to Galle?",
  "Best time to visit Sigiriya?",
];

interface MessageData {
  message: string | null;
  sender?: "user" | "ai";
  time?: string | null;
  result?: string | null;
  web_description?: string | null;
  emergency?: string | null;
  weather?:
    | string
    | {
        temp?: number;
        temperature?: number;
        description?: string;
        weather?: string;
        summary?: string;
        is_raining?: boolean;
        feels_like?: number;
        humidity?: number;
        wind_speed?: number;
        uv_index?: number;
        rain_mm?: number;
        destination?: string;
        forecast?: {
          date: string;
          condition: string;
          emoji: string;
          temp_max: number;
          temp_min: number;
          rain_chance: number;
        }[];
      }
    | null;
  hotels?:
    | {
        name: string;
        stars: number;
        price: number;
        image?: string;
        main_photo_url?: string | string[];
      }[]
    | null;
  bus_info?: {
    bus_path: string | null;
    time_estimate: string;
    cost: string;
    description: string;
  } | null;
  Train_info?: string | null;
  destination?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <div className="m-2 p-2 rounded-2xl backdrop-blur-md max-w-full overflow-hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 bg-white/50">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50/80">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-100">
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <span className="font-bold text-blue-700">{children}</span>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-5 space-y-2 my-4 text-gray-700">
              {children}
            </ul>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-gray-800">{children}</p>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function EmergencyBlock({ data }: { data: any }) {
  return (
    <div className="m-2 overflow-hidden rounded-2xl border-2 border-red-500 bg-red-50 shadow-2xl">
      <div className="bg-red-600 p-4 flex items-center gap-3 text-white">
        <ShieldAlert className="w-8 h-8 animate-bounce" />
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest">
            Emergency Assistance
          </h2>
          <p className="text-xs opacity-90">
            Official Sri Lanka Tourist Support
          </p>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-red-800 uppercase">
            Primary Contact
          </p>
          <a
            href="tel:0112421052"
            className="flex items-center justify-center gap-3 bg-white border-2 border-red-600 p-4 rounded-xl text-red-600 font-black text-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
          >
            <Phone className="w-6 h-6" /> 011 242 1052
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Police", num: "119" },
            { label: "Suwa Seriya", num: "1990" },
            { label: "Fire", num: "110" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-3 rounded-lg border border-red-100 text-center shadow-sm"
            >
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                {item.label}
              </p>
              <p className="text-lg font-bold text-red-600">{item.num}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <p className="flex items-center gap-2 font-bold text-gray-800 border-b border-red-200 pb-1">
            <LifeBuoy className="w-4 h-4 text-red-500" /> Immediate Steps
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-red-500">01.</span> Stay calm;
              look for a Tourist Police post.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-red-500">02.</span> Keep your
              ID/Passport copy ready.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-red-500">03.</span> Report any
              theft or loss immediately.
            </li>
          </ul>
        </div>
        <div className="bg-green-100 p-3 rounded-lg border border-green-200 text-center">
          <p className="text-green-800 font-medium text-sm">
            ✨ You are safe. Official help is being coordinated.
          </p>
        </div>
      </div>
    </div>
  );
}

function getHighResImage(url: string | string[] | undefined | null): string {
  if (!url) return "/placeholder-hotel.jpg";
  const firstUrl = Array.isArray(url) ? (url[0] ?? "") : url;
  return firstUrl
    ? firstUrl.replace("square60", "max1024")
    : "/placeholder-hotel.jpg";
}

// AnswerChat outside
function AnswerChat({
  emergency,
  message,
  weather,
  web_description,
  hotels,
  result,
  bus_info,
  latitude,
  longitude,
  Train_info,
  destination,
}: MessageData) {
  const textContent = result ?? web_description ?? null;

  const weatherDisplay = useMemo(() => {
    if (!weather || typeof weather === "string") return null;
    return {
      temp: weather.temp ?? weather.temperature ?? null,
      type: weather.description ?? weather.weather ?? null,
      feels_like: weather.feels_like ?? null,
      humidity: weather.humidity ?? null,
      is_raining: weather.is_raining ?? null,
      wind_speed: weather.wind_speed ?? null,
    };
  }, [weather]);

  // caused MapCard to remount and reload the map
  const endCoords = useMemo(
    () => ({
      lat: latitude ?? 0,
      lng: longitude ?? 0,
    }),
    [latitude, longitude],
  );

  const hasValidCoords = !!(
    latitude &&
    longitude &&
    latitude !== 0 &&
    longitude !== 0
  );

  return (
    <div className="flex w-full justify-end pr-2 pb-1">
      <Message from="assistant" className="p-1">
        <MessageAvatar src={ChatIcon.src} name="AI" />
        <MessageContent>
          {textContent && <MarkdownBlock content={textContent} />}

          {hotels && hotels.length > 0 && (
            <div className={styles.container}>
              <div className={styles.expandedView}>
                {hotels
                  .filter((h) => h.main_photo_url || h.image)
                  .map((hotel, index) => (
                    <HotelCard
                      key={index}
                      {...hotel}
                      image={getHighResImage(
                        hotel.main_photo_url ?? hotel.image,
                      )}
                      description={""}
                      rating={hotel.stars}
                      issmall={true}
                    />
                  ))}
              </div>
            </div>
          )}

          {emergency && <EmergencyBlock data={emergency} />}

          <div className="flex flex-row gap-3 flex-wrap items-start my-2">
            {weatherDisplay?.temp != null && weatherDisplay?.type && (
              <WeatherCard
                temp={weatherDisplay.temp}
                type={weatherDisplay.type}
                feels_like={weatherDisplay.feels_like}
                humidity={weatherDisplay.humidity}
                is_raining={weatherDisplay.is_raining}
                wind_speed={weatherDisplay.wind_speed}
              />
            )}

            {bus_info && bus_info.bus_path && bus_info.cost !== "unknown" && (
              <BusRouteCard
                description={bus_info.description}
                route={bus_info.bus_path!}
                cost={bus_info.cost}
                time_estimate={bus_info.time_estimate}
              />
            )}

            {hasValidCoords && (
              <MapCard
                end={endCoords}
                destinationName={destination || "Destination"}
              />
            )}
          </div>

          {Train_info && !Train_info.startsWith("❌") && (
            <div className="w-full flex justify-center my-2">
              <TrainCard rawData={Train_info} />
            </div>
          )}
        </MessageContent>
      </Message>
    </div>
  );
}

function PromptChatBubble({
  message,
  imageUrl,
}: {
  message: string;
  imageUrl: string;
}) {
  return (
    <div className="flex w-full justify-start">
      <Message from="user">
        <MessageAvatar src={imageUrl} name="User" />
        <MessageContent>{message}</MessageContent>
      </Message>
    </div>
  );
}

function Suggestions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2 justify-center">{children}</div>;
}

function Suggestion({
  suggestion,
  onClick,
}: {
  suggestion: string;
  onClick: (s: string) => void;
}) {
  return (
    <Button variant="outline" size="sm" onClick={() => onClick(suggestion)}>
      {suggestion}
    </Button>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 md:pt-20 gap-6 md:gap-8 px-4 md:px-0">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-1.5 items-center">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2 h-2 rounded-full bg-brand-burgundy animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 tracking-widest uppercase font-medium">
            Loading your travel history
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home({
  placeholder = "Ask About Your Destination...",
  autoFocus = true,
}: Props) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [active, setActive] = useState(false);
  const [input, setInput] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { sidebarOpen } = useChatContext();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { sessionId, shouldClear, clearMessages } = useChatContext();
  const { isSignedIn, user, isLoaded } = useUser();

  // Auto-scroll
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(t);
  }, [messages, active]);

  // New Chat clear signal
  useEffect(() => {
    if (shouldClear) {
      setMessages([]);
      setInput("");
      clearMessages();
    }
  }, [shouldClear, clearMessages]);

  // Load chat history
  useEffect(() => {
    if (!user || !sessionId) return;
    const syncHistory = async () => {
      setLoadingHistory(true);
      const sessionData = sessionStorage.getItem("travel_session_id");
      const emailAddress = user.primaryEmailAddress?.emailAddress;
      if (!sessionData || !emailAddress) {
        setLoadingHistory(false);
        return;
      }

      try {
        const res = await fetch(`${NEXT_API_PORT}/session_history_chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionData,
            email: emailAddress,
          }),
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();

        const parsed: MessageData[] = [];
        for (const msg of data.messages ?? []) {
          if (msg.role === "user") {
            parsed.push({
              message: String(msg.content ?? ""),
              sender: "user",
              hotels: null,
            });
          } else if (msg.role === "assistant") {
            let ai: any = {};
            try {
              ai =
                typeof msg.content === "string"
                  ? JSON.parse(msg.content)
                  : msg.content;
            } catch {
              ai = { result: msg.content };
            }
            parsed.push({
              message: ai.result ?? ai.message ?? null,
              result: ai.result ?? null,
              sender: "ai",
              destination: ai.destination ?? null,
              latitude: ai.latitude ?? null,
              longitude: ai.longitude ?? null,
              weather: ai.weather ?? null,
              hotels: ai.hotels ?? null,
              bus_info: ai.Bus_info ?? ai.bus_info ?? null,
              Train_info: ai.Train_info ?? null,
              web_description: ai.web_description ?? null,
              emergency: ai.emergency ?? null,
            });
          }
        }
        setMessages(parsed);
      } catch (err) {
        console.error("History Sync Error:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    syncHistory();
  }, [user, sessionId]);

  const sendMessage = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>, directInput?: string) => {
      if (e) e.preventDefault(); 

      const inputValue = (directInput ?? input).trim();
      if (!inputValue) return;

      if (!isLoaded) {
        console.warn("⏳ Clerk not loaded yet — waiting...");
        return;
      }

      const email = user?.primaryEmailAddress?.emailAddress ?? null;

      setActive(true);
      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          message: inputValue,
          sender: "user",
          hotels: null,
          bus_info: null,
          web_description: "",
          weather: null,
          result: "",
          Train_info: null,
          time: new Date().toISOString(),
        },
      ]);

      try {
        const res = await fetch(`${NEXT_API_PORT}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: inputValue,
            session_id: sessionId,
            user_email: email,
          }),
        });
        const data = await res.json();

        console.log("API Response:", data);

        const aiMsg: MessageData = {
          hotels: data.hotels ?? null,
          result: data.result ?? null,
          message: data.result ?? null,
          sender: "ai",
          bus_info: data.Bus_info ?? null,
          weather: data.weather ?? null,
          web_description: data.web_description ?? null,
          Train_info: data.Train_info ?? null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          destination: data.destination ?? null,
          emergency: data.emergency ?? null,
        };

        setActive(false);
        setMessages((prev) => [
          ...prev,
          data.success
            ? aiMsg
            : {
                ...aiMsg,
                message: "Error: " + (data.error ?? "Unknown error"),
              },
        ]);

        send_chat_store(inputValue, aiMsg);
      } catch (err) {
        setActive(false);
        setMessages((prev) => [
          ...prev,
          {
            message: "⚠️ Network error",
            sender: "ai",
            hotels: null,
            bus_info: null,
            web_description: "",
            result: err instanceof Error ? err.message : "No response",
            Train_info: null,
          },
        ]);
      }
    },
    [input, isLoaded, user, sessionId],
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage(undefined, suggestion);
    },
    [sendMessage],
  );

  const send_chat_store = async (userquery: string, agentresponse: any) => {
    const email =
      isLoaded && user?.primaryEmailAddress?.emailAddress
        ? user.primaryEmailAddress.emailAddress
        : null;
    try {
      await fetch(`${NEXT_API_PORT}/store_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || uuidv4(),
          userquery,
          user_email: email,
          agentresponse:
            typeof agentresponse === "string"
              ? agentresponse
              : JSON.stringify(agentresponse),
        }),
      });
    } catch (err) {
      console.error("❌ store_message error:", err);
    }
  };

  const userAvatarUrl =
    isSignedIn && typeof user?.imageUrl === "string"
      ? user.imageUrl
      : "https://github.com/openai.png";

  return (
    <div>
      <SessionSidebar />
      <main
        className={`flex-1 overflow-y-auto pt-10 pl-2 pr-2 scroll-smooth
                  transition-all duration-300
                  ${sidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        {messages.length === 0 ? (
          <div className="p-8 w-full flex-1 flex flex-col justify-center items-center">
            {loadingHistory ? (
              <LoadingState />
            ) : (
              <div>
                <Suggestions>
                  {suggestions.map((s, i) => (
                    <Suggestion
                      key={i}
                      onClick={handleSuggestionClick}
                      suggestion={s}
                    />
                  ))}
                </Suggestions>
                <div className="flex flex-col items-center justify-center text-center pt-30 font-semibold">
                  <p className="changa sm:text-6xl md:text-7xl text-4xl">
                    Explore{" "}
                    <span className="text-yellow-500 font-extrabold">C</span>
                    <span className="text-red-700   font-extrabold">e</span>
                    <span className="text-orange-400 font-extrabold">l</span>
                    <span className="text-green-600 font-extrabold">y</span>
                    <span className="text-sky-600   font-extrabold">o</span>
                    <span className="text-pink-600  font-extrabold">
                      n
                    </span>{" "}
                    With TravelMate
                  </p>
                  <p className="typewriter-loop font-inter font-extralight text-lg mt-3">
                    Your everyday travel companion.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pb-32">
            {messages.map((msg, i) =>
              msg.sender === "user" ? (
                <React.Fragment key={i}>
                  <PromptChatBubble
                    message={msg.message || ""}
                    imageUrl={userAvatarUrl}
                  />
                  {active && i === messages.length - 1 && (
                    <div className="flex items-center gap-1.5 px-4 py-6">
                      <div className="flex gap-1.5">
                        {[0, 150, 300].map((delay) => (
                          <div
                            key={delay}
                            className="w-2 h-2 rounded-full bg-brand-burgundy animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">
                        TravelMate is thinking...
                      </span>
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <AnswerChat
                  key={i}
                  bus_info={msg.bus_info}
                  result={msg.result}
                  hotels={msg.hotels}
                  web_description={msg.web_description}
                  weather={msg.weather}
                  message={msg.message}
                  Train_info={msg.Train_info}
                  latitude={msg.latitude}
                  longitude={msg.longitude}
                  emergency={msg.emergency}
                  destination={msg.destination}
                />
              ),
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-transparent px-4 sm:px-6 md:px-10 lg:px-40 xl:px-60 py-2 z-50">
        <PromptInput onSubmit={sendMessage} className="p-3">
          <PromptInputTextarea
            className="min-h-[28px] p-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputButton>
                <PaperclipIcon size={16} />
              </PromptInputButton>
              <PromptInputModelSelect onValueChange={setModel} value={model}>
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((m) =>
                    m.name === "Travel Mate Pro" ? (
                      <PromptInputModelSelectItem
                        key={m.id}
                        value={m.id}
                        disabled
                      >
                        {m.name}
                      </PromptInputModelSelectItem>
                    ) : (
                      <PromptInputModelSelectItem key={m.id} value={m.id}>
                        {m.name}
                      </PromptInputModelSelectItem>
                    ),
                  )}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={active || !isLoaded} className="h-8" />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
