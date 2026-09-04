// FloatingAssistant.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "pixel-retroui";
import './FloatingAssistant.css';

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi — I'm Mustansir AI. Ask me a quick question about Mustansir." }
  ]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current.querySelector(".fa-messages");
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const toggleOpen = () => setOpen((v) => !v);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { sender: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/predict", { text: text });
      const aiText = res?.data?.result ?? "Sorry, no response.";
      setMessages((m) => [...m, { sender: "ai", text: aiText }]);
    } catch {
      setMessages((m) => [...m, { sender: "ai", text: "⚠️ Error connecting to assistant." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        :root{
          --scroll-top-size: 56px;
          --scroll-top-bottom: 20px;
          --gap-between-buttons: 8px;
        }

        /* Floating button: static "AI", centered content, no hover expansion */
        .fa-floating-btn {
          position: fixed;
          right: 20px;
          bottom: calc(var(--scroll-top-bottom) + var(--scroll-top-size) + var(--gap-between-buttons));
          width: var(--scroll-top-size);
          height: var(--scroll-top-size);
          border-radius: 12px;
          background: linear-gradient(135deg,#06b6d4 0%,#10b981 100%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 8px 24px rgba(2,6,23,0.18);
          cursor: pointer;
          z-index: 9999;
          border: none;
          outline: none;
          transition: transform 140ms ease, box-shadow 140ms ease;
        }

        .fa-floating-btn:focus {
          box-shadow: 0 10px 28px rgba(2,6,23,0.22), 0 0 0 6px rgba(6,182,212,0.06);
        }

        /* keep it static — no hover expansion or label */
        .fa-floating-btn:hover {
          transform: translateY(-3px);
        }

        /* Panel */
        .fa-panel {
            position: fixed;
            right: 20px;
            bottom: 100px;
            width: 360px;
            height: 520px;
            max-width: calc(100% - 44px);
            max-height: calc(100vh - 120px);
            border-radius: 14px;
            background: linear-gradient(180deg,#071226,#0b1b2b);
            box-shadow: 0 28px 80px rgba(2,6,23,0.6);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            overflow: auto;       /* allow scrollbars when resized */
            resize: both;         /* enable manual resizing */
        }

        .fa-header {
          height: 64px;
          display:flex;
          align-items:center;
          gap:12px;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        }

        .fa-mbox {
          width:40px;height:40px;border-radius:10px;background:#10b981;color:#04261a;display:flex;align-items:center;justify-content:center;font-weight:800;
        }

        .fa-title { color: #e6eef6; font-weight:700; font-size:14px; }

        .fa-close {
          margin-left: auto;
          background: transparent;
          border: none;
          color: #cfe8e8;
          cursor: pointer;
          padding:6px;
          border-radius:8px;
        }
        .fa-close:hover { background: rgba(255,255,255,0.02); transform: translateY(-2px); }

        .fa-messages {
          padding: 14px;
          overflow-y: auto;
          display:flex;
          flex-direction:column;
          gap:10px;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
          flex:1;
          overflow-y: auto;
        }

        .fa-row { display:flex; align-items:flex-end; gap:10px; }
        .fa-row.ai { justify-content:flex-start; }
        .fa-row.user { justify-content:flex-end; }

        .fa-avatar {
          width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;
        }
        .fa-avatar.ai { background:#bfe9ff; color:#003049; }
        .fa-avatar.user { background:#e6e9ee; color:#1f2937; }

        .fa-bubble {
          padding:10px 14px;
          border-radius:14px;
          max-width:74%;
          line-height:1.45;
          white-space:pre-wrap;
          box-shadow: 0 8px 20px rgba(2,6,23,0.12);
        }
        .fa-bubble.ai { background: rgba(255,255,255,0.96); color:#04263a; border-radius:14px 14px 14px 8px; }
        .fa-bubble.user { background: linear-gradient(90deg,#2b7be4,#1f5fcf); color:white; border-radius:14px 14px 8px 14px; }

        .fa-composer {
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.03);
          display:flex;
          gap:10px;
          align-items:center;
          background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
        }

        .fa-input {
          flex:1;
          min-height:46px;
          max-height:140px;
          padding:12px 14px;
          border-radius:12px;
          border: none;
          background: rgba(255,255,255,0.03);
          color: #e6eef6;
          outline: none;
          resize: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.02);
        }

        .fa-input::placeholder { color: rgba(230,238,246,0.5); }

        .fa-send {
          background: linear-gradient(180deg,#06b6d4,#0284c7);
          color:white;
          border:none;
          padding:10px 14px;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          box-shadow: 0 8px 20px rgba(2,6,23,0.18);
        }

        @media (max-width:420px){
          .fa-panel { right: 12px; left: 12px; width: auto; bottom: 80px; height: 70vh; max-height: calc(100vh - 120px); }
          .fa-floating-btn { right: 12px; bottom: calc(var(--scroll-top-bottom) + var(--scroll-top-size) + var(--gap-between-buttons)); width:48px; height:48px; border-radius:12px; font-size:14px; }
        }
      `}</style>

      {/* show static "AI" button when panel is closed */}
      {!open && (
        <button
          className="fa-floating-btn"
          aria-label="Open Mustansir AI quick chat"
          onClick={toggleOpen}
        >
          <span className="fa-launcher-mark">MS</span>
          <span className="fa-launcher-label">AI</span>
        </button>
      )}

      {/* chat panel */}
      {open && (
        <div className="fa-panel" ref={panelRef} role="dialog" aria-modal="false" aria-label="Mustansir quick chat">
          <div className="fa-header">
            <div className="fa-mbox">M</div>
            <div className="fa-title">Mustansir AI — Quick chat</div>
            <button
              className="fa-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
              style={{ marginLeft: 6 }}
            >
              ✕
            </button>
          </div>

          <div className="fa-messages">
            {messages.map((m, i) => (
              <div key={i}>
                <div className={`fa-row ${m.sender === "user" ? "user" : "ai"}`}>
                  {m.sender === "ai" && <div className="fa-avatar ai">M</div>}
                  <div className={`fa-bubble ${m.sender === "user" ? "user" : "ai"}`}>{m.text}</div>
                  {m.sender === "user" && <div className="fa-avatar user">U</div>}
                </div>
              </div>
            ))}

            {loading && (
              <div className="fa-row ai" aria-live="polite">
                <div className="fa-avatar ai">M</div>
                <div className="fa-bubble ai">Thinking…</div>
              </div>
            )}
          </div>

          <div className="fa-composer">
            <textarea
              className="fa-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a quick question about Mustansir. Press Enter to send."
              aria-label="Message input"
            />
            <Button className="fa-send" onClick={sendMessage} aria-label="Send message" bg="#ff6b5a" textColor="#241b2f" shadow="#241b2f" borderColor="#241b2f">Send</Button>
          </div>
        </div>
      )}
    </>
  );
}
