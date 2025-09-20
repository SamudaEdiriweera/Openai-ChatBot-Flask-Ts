import React, { useEffect, useState, useRef } from "react";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  message: string;
  structureContent?: any;
  loading?: boolean;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatDisplayRef = useRef<HTMLDivElement>(null);

  // autoscroll on new messages
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    // Prepare user + placeholder messages in one atomic update
    const userMsg: ChatMessage = { id: makeId(), role: "user", message: text };
    const placeholderId = makeId();
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      role: "assistant",
      message: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      // Handle non-OK responses before attempting JSON parsing
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${errText ? `– ${errText}` : ""}`);
      }

      const data: { message?: string; error?: string } = await res.json();

      if (data.error) throw new Error(data.error);
      const botText = data.message ?? ""; // <-- backend returns {message: "..."}
      // Replace the placeholder by id
      setMessages((prev) =>
        prev.map((m) => (m.id === placeholderId ? { ...m, message: botText, loading: false } : m))
      );
    } catch (e: any) {
      // Show the error in place of the placeholder
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId
            ? { ...m, message: `⚠️ ${e?.message || "Failed to fetch"}`, loading: false }
            : m
        )
      );
      console.error("Error fetching bot response:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Submit using the same handler
      handleFormSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="mx-auto w-full max-w-4xl">
        {/* Chat Card */}
        <section className="flex h-[calc(100vh-4rem)] flex-col rounded-2xl bg-gray-900 shadow">
          {/* Header */}
          <header className="h-14 flex items-center justify-center rounded-t-2xl border-b border-gray-800">
            <h1 className="text-xl md:text-2xl font-bold text-green-500">ChatBot</h1>
          </header>

          {/* Chat Display */}
          <div
            id="chat-display"
            ref={chatDisplayRef}
            className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 space-y-3"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {!isUser && (
                      <div className="shrink-0 w-6 h-6 rounded-full bg-gray-700 grid place-items-center text-xs text-gray-300">
                        🤖
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm leading-relaxed break-words ${
                        isUser ? "bg-green-600 text-white" : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {msg.message}
                      {msg.loading && (
                        <span className="ml-2 inline-block animate-pulse align-middle">…</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <footer className="rounded-b-2xl border-t border-gray-800 p-3 md:p-4">
            <form id="chat-form" className="flex w-full items-end gap-2" onSubmit={handleFormSubmit}>
              <textarea
                rows={1}
                name="message"
                id="chat-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Your message…"
                className="flex-1 resize-y rounded-xl border border-gray-700/60 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading && !inputMessage}
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-700/60 bg-gray-900 hover:bg-gray-800 transition disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.9576 7.71521C13.0903 7.6487 13.2019 7.54658 13.2799 7.42027C13.3579 7.29396 13.3992 7.14845 13.3992 7.00001C13.3992 6.85157 13.3579 6.70606 13.2799 6.57975C13.2019 6.45344 13.0903 6.35132 12.9576 6.28481L1.75762 0.684812C1.61875 0.615327 1.46266 0.587759 1.30839 0.605473C1.15412 0.623186 1.00834 0.685413 0.888833 0.784565C0.769325 0.883716 0.681257 1.01551 0.635372 1.16385C0.589486 1.3122 0.587767 1.4707 0.630424 1.62001L1.77362 5.62001C1.82144 5.78719 1.92243 5.93424 2.06129 6.03889C2.20016 6.14355 2.36934 6.20011 2.54322 6.20001H6.20002C6.4122 6.20001 6.61568 6.2843 6.76571 6.43433C6.91574 6.58436 7.00002 6.78784 7.00002 7.00001C7.00002 7.21218 6.91574 7.41567 6.76571 7.5657C6.61568 7.71573 6.4122 7.80001 6.20002 7.80001H2.54322C2.36934 7.79991 2.20016 7.85647 2.06129 7.96113C1.92243 8.06578 1.82144 8.21283 1.77362 8.38001L0.631223 12.38C0.588482 12.5293 0.590098 12.6877 0.635876 12.8361C0.681652 12.9845 0.769612 13.1163 0.889027 13.2155C1.00844 13.3148 1.15415 13.3771 1.30838 13.3949C1.46262 13.4128 1.61871 13.3854 1.75762 13.316L12.9576 7.71601V7.71521Z"
                    fill="#90A4AE"
                  />
                </svg>
              </button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default ChatBot;
