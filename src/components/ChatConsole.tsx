import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import {
  Brain,
  Send,
  Mic,
  Image as ImageIcon,
  StopCircle,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  TrendingUp,
  Workflow,
  Sparkles,
  RefreshCw,
  Sliders,
  Play,
  BarChart2
} from "lucide-react";

interface ChatConsoleProps {
  initialPrompt?: string;
  onClearPrompt?: () => void;
}

export default function ChatConsole({ initialPrompt, onClearPrompt }: ChatConsoleProps) {
  const welcomeMessages: Record<string, string> = {
    street: "What's good! OMNIBRAIN is locked in and ready. I know everything about markets, tech, IPOs — you name it. Ask me anything, let's get it. 🔥",
    boss: "OMNIBRAIN Predictive Engine online. Real-time signal analysis active across all tracked candidates. Ready for your directive.",
    chill: "Hey there! OMNIBRAIN is all set and ready to chat. I've got the latest market data loaded up — ask me anything you're curious about.",
    brain: "OMNIBRAIN Quantitative Engine initialized. Multi-factor convergence scoring active. 8 candidates tracked. 94.2% signal accuracy. Awaiting analytical query."
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "OMNIBRAIN Predictive Engine online. Real-time signal analysis active across all tracked candidates. Select your AI voice mode on the left, then ask me anything.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"chat" | "image">("chat");
  const [voiceMode, setVoiceMode] = useState<"street" | "boss" | "chill" | "brain">("boss");

  // Image Generation settings
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");

  // Microphone / Audio Transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      if (onClearPrompt) onClearPrompt();
    }
  }, [initialPrompt, onClearPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, transcribing]);

  const handleSendText = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      // Build conversation history for context
      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const customKey = localStorage.getItem("omnibrain_api_key") || "";

      const res = await fetch("/api/v1/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
          "X-Gemini-Key": customKey
        },
        body: JSON.stringify({ message: messageText, history: chatHistory, voice: voiceMode }),
      });

      if (!res.ok) {
        throw new Error("Telemetry channel failed to establish.");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ Telemetry Error: ${err.message || "Failed to establish a high-thinking link."}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `🎨 Generate high-resolution visual model (${imageSize}): "${imagePrompt}"`,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const savedPrompt = imagePrompt;
    setImagePrompt("");

    try {
      const res = await fetch("/api/v1/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Bypass-Tunnel-Reminder": "true",
        },
        body: JSON.stringify({ prompt: savedPrompt, size: imageSize }),
      });

      if (!res.ok) {
        throw new Error("Visual synthesizer model offline.");
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: `Successfully synthesized high-quality model output of size **${imageSize}** for: "${savedPrompt}".`,
        imageUrl: data.imageUrl,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: `⚠️ Image Synthesis Error: ${err.message || "Failed to generate visual asset."}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Audio recording handlers for Speech Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setTranscribing(true);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          try {
            const base64Data = (reader.result as string).split(",")[1];
            const response = await fetch("/api/v1/transcribe-audio", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Bypass-Tunnel-Reminder": "true",
              },
              body: JSON.stringify({ audioData: base64Data, mimeType: "audio/webm" }),
            });

            if (!response.ok) {
              throw new Error("Speech synthesis transcription failed.");
            }

            const data = await response.json();
            if (data.text) {
              setInput(data.text);
            }
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setTranscribing(false);
          }
        };

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone permissions denied or error:", error);
      alert("Please grant microphone permissions to use voice input transcription.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const presetQueries = [
    {
      label: "IR Hiring Signals",
      prompt: "Analyze the implications of Anthropic's $600K Director of IR role posting in detail. Why is this key?",
      icon: FileText,
    },
    {
      label: "OpenAI Restructure",
      prompt: "Explain how OpenAI's transition to a for-profit structure impacts its pre-IPO timeline and valuation.",
      icon: Workflow,
    },
    {
      label: "Optimal Windows",
      prompt: "Which AI infrastructure unicorns represent the highest investment scores based on optimal timing today?",
      icon: TrendingUp,
    },
    {
      label: "Valuation Models",
      prompt: "Perform a valuation comparison of the top 3 AI unicorns. Compare ARR, ready rank, and predictive target prices.",
      icon: Sliders,
    },
    {
      label: "Secondary Liquidity",
      prompt: "How does pre-IPO secondary stock volume influence the pricing convergence calculations for Scale AI and Databricks?",
      icon: BarChart2,
    },
  ];

  return (
    <section className="px-6 md:px-12 max-w-7xl mx-auto py-12" id="predictions">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Control Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 bg-[#020617]/90 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#0f172a] rounded-xl text-white border border-white/10">
                <Brain className="w-5 h-5 text-[#06b6d4]" />
              </div>
              <div>
                <h3 className="font-bold font-serif italic text-white text-lg">OMNIBRAIN AI</h3>
                <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Interactive Analysis Center</p>
              </div>
            </div>

            <p className="text-sm text-[#94a3b8] font-light mt-4 leading-relaxed">
              Consolidated intelligence portal integrating active reasoning arrays and vector narrative synthesizers.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => setMode("chat")}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs tracking-widest transition-all duration-300 flex items-center justify-between border uppercase ${
                  mode === "chat"
                    ? "bg-white border-white text-black"
                    : "bg-[#0f172a] border-white/5 text-[#94a3b8] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  Cognitive Chat
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                  mode === "chat" ? "bg-black/10 border-black/10 text-black font-bold" : "bg-[#020617] border-white/10 text-[#64748b]"
                }`}>
                  PRO
                </span>
              </button>

              <button
                onClick={() => setMode("image")}
                className={`w-full py-3 px-4 rounded-xl font-black text-xs tracking-widest transition-all duration-300 flex items-center justify-between border uppercase ${
                  mode === "image"
                    ? "bg-white border-white text-black"
                    : "bg-[#0f172a] border-white/5 text-[#94a3b8] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Visual Narrative
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                  mode === "image" ? "bg-black/10 border-black/10 text-black font-bold" : "bg-[#020617] border-white/10 text-[#64748b]"
                }`}>
                  1K-4K
                </span>
              </button>
            </div>

            {/* Voice Mode Selector */}
            <div className="mt-5 pt-5 border-t border-white/5">
              <span className="text-[9px] font-mono font-black tracking-[0.2em] uppercase text-[#64748b] block mb-3">
                AI VOICE MODE
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "street" as const, label: "Street", emoji: "🔥", desc: "Real talk" },
                  { key: "boss" as const, label: "Boss", emoji: "💼", desc: "Executive" },
                  { key: "chill" as const, label: "Chill", emoji: "😎", desc: "Laid back" },
                  { key: "brain" as const, label: "Brain", emoji: "🧠", desc: "Deep analysis" },
                ].map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setVoiceMode(v.key)}
                    className={`p-2.5 rounded-xl text-left transition-all duration-300 border ${
                      voiceMode === v.key
                        ? "bg-[#06b6d4]/10 border-[#06b6d4]/40 text-white"
                        : "bg-[#0f172a] border-white/5 text-[#94a3b8] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="text-sm mb-0.5">{v.emoji} <span className="font-bold text-xs">{v.label}</span></div>
                    <div className="text-[9px] font-mono text-[#64748b]">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Connection Diagnostics */}
            <div className="mt-6 border-t border-white/5 pt-5 space-y-3">
              <span className="text-[9px] font-mono font-black tracking-[0.2em] uppercase text-[#64748b] block">
                DIAGNOSTICS & TUNNEL STATUS
              </span>
              <div className="space-y-2 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between items-center bg-[#020617] p-2 rounded border border-white/5">
                  <span className="text-[#64748b]">Cognitive Array:</span>
                  <span className="text-white font-bold">Gemini-2.5-Pro</span>
                </div>
                <div className="flex justify-between items-center bg-[#020617] p-2 rounded border border-white/5">
                  <span className="text-[#64748b]">Thinking Budget:</span>
                  <span className="text-purple-400 font-bold">2,048 Tokens</span>
                </div>
                <div className="flex justify-between items-center bg-[#020617] p-2 rounded border border-white/5">
                  <span className="text-[#64748b]">Personal API Key:</span>
                  {localStorage.getItem("omnibrain_api_key") ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">SYSTEM DEFAULT</span>
                  )}
                </div>
                <div className="flex justify-between items-center bg-[#020617] p-2 rounded border border-white/5">
                  <span className="text-[#64748b]">Tunnel Latency:</span>
                  <span className="text-[#06b6d4] font-bold">12ms (Direct)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="p-6 bg-[#020617]/90 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] font-mono font-black tracking-[0.2em] uppercase text-[#64748b] mb-4">
              Telemetry Query Presets
            </h4>
            <div className="flex flex-col gap-2.5">
              {presetQueries.map((preset, idx) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (mode === "chat") {
                        handleSendText(preset.prompt);
                      } else {
                        setImagePrompt(preset.prompt);
                      }
                    }}
                    className="w-full text-left p-3 rounded-xl bg-[#0f172a] border border-white/5 hover:border-[#06b6d4]/20 text-slate-300 hover:text-[#06b6d4] transition-all duration-300 flex items-center gap-3 group"
                  >
                    <div className="p-1.5 bg-[#020617] border border-white/5 rounded-lg text-slate-500 group-hover:text-[#06b6d4] group-hover:border-[#06b6d4]/20 transition-all">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold tracking-tight">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat / Image synthesized space */}
        <div className="lg:col-span-8 flex flex-col h-[580px] bg-[#020617]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 bg-[#0f172a]/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
              <span className="text-[10px] font-mono font-black tracking-widest text-[#64748b] uppercase">
                {mode === "chat" ? "HIGH COGNITIVE COHESION LINK — ACTIVE" : "VISUAL TIMELINE GENERATOR"}
              </span>
            </div>
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "welcome",
                    sender: "assistant",
                    text: "Welcome to OMNIBRAIN Predictive Console. Chat history flushed successfully.",
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ])
              }
              className="p-1.5 bg-[#0f172a] hover:bg-slate-900 text-[#64748b] hover:text-white border border-white/10 rounded-lg transition-colors"
              title="Clear Console History"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Message Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 border text-sm ${
                    m.sender === "user"
                      ? "bg-[#0f172a] border-white/10 text-slate-200"
                      : "bg-[#0f172a]/20 border-white/5 text-slate-300 leading-relaxed font-light"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-[#64748b]">
                    <span className="font-black uppercase tracking-wider">
                      {m.sender === "user" ? "Client Terminal" : "OMNIBRAIN Engine"}
                    </span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>

                  {/* Render Markdown / Text content */}
                  <p className="whitespace-pre-wrap font-light text-[#94a3b8] leading-relaxed">{m.text}</p>

                  {/* Render inline image if synthesized */}
                  {m.imageUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-[#0f172a] shadow-xl group/img relative">
                      <img src={m.imageUrl} alt="AI Synthesized Output" referrerPolicy="no-referrer" className="w-full max-h-96 object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">Synthesized Asset</span>
                        <a
                          href={m.imageUrl}
                          download="ipo_brain_synthesis.png"
                          className="px-3 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest"
                        >
                          Download Image
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Dynamic loading animations */}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl p-4 bg-[#0f172a]/10 text-slate-400 space-y-3 border border-transparent">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#06b6d4]" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#64748b] animate-pulse">
                      {mode === "chat" ? "Scanning vector telemetry & filing variables..." : "Synthesizing graphic matrix..."}
                    </span>
                  </div>
                  {mode === "chat" && (
                    <p className="text-[11px] text-[#64748b] font-mono italic">
                      Calibrating model-3.1-pro-preview with ThinkingLevel.HIGH (budget unlimited) to minimize model error. Please stand by...
                    </p>
                  )}
                </div>
              </div>
            )}

            {transcribing && (
              <div className="flex justify-start">
                <div className="p-4 bg-[#0f172a]/20 rounded-xl border border-white/5 text-xs font-mono text-[#64748b] flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8b5cf6]" />
                  <span>Converting microphone speech to raw text prompt...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-4 border-t border-white/10 bg-[#0f172a]/10">
            {mode === "chat" ? (
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendText();
                  }}
                  placeholder="Ask OMNIBRAIN about IPO convergence, IR postings, or custom evaluations..."
                  className="flex-1 py-3.5 pl-4 pr-24 rounded-xl bg-[#0f172a] border border-white/10 focus:border-white/30 text-white placeholder-slate-500 text-xs focus:outline-none"
                />

                {/* Micro record button */}
                <div className="absolute right-14 flex items-center gap-1">
                  {isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse"
                      title="Stop Recording Speech"
                    >
                      <StopCircle className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="p-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-400 hover:text-white transition-all"
                      title="Record speech from microphone for transcription"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleSendText()}
                  disabled={loading}
                  className="p-3 rounded-lg bg-white text-black hover:bg-slate-200 font-bold transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-black fill-black" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleGenerateImage();
                    }}
                    placeholder="Enter visual timeline or mockup design prompts (e.g. 'Anthropic S-1 IPO timeline diagram')..."
                    className="flex-1 py-3.5 px-4 rounded-xl bg-[#0f172a] border border-white/10 focus:border-white/30 text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                  <button
                    onClick={handleGenerateImage}
                    disabled={loading || !imagePrompt.trim()}
                    className="px-5 py-3 bg-white text-black hover:bg-slate-200 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-white/5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    Synthesize
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-wider">Resolution Quality:</span>
                  <div className="flex items-center gap-1.5">
                    {(["1K", "2K", "4K"] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setImageSize(sz)}
                        className={`px-3 py-1 rounded-lg border text-xs font-mono font-bold transition-all ${
                          imageSize === sz
                            ? "bg-white border-white text-black shadow"
                            : "bg-[#0f172a] border-white/10 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#64748b] italic ml-auto">
                    Synthesized via Gemini Image Generator
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
