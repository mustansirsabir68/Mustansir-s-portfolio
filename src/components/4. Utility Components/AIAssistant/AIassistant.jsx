import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button, Card } from 'pixel-retroui';
import './Assistant.css';

function AssistantPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "👋 Hi, I'm Mustansir AI. Ask me anything about my portfolio, projects, or career journey." }
  ]);
  const [input, setInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [jdText, setJdText] = useState('');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('mustansir_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }
    try {
      localStorage.setItem('mustansir_theme', theme);
    } catch {}
  }, [theme]);

  const scrollToBottom = () => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:8000/predict', { text: input });
      const aiMessage = { sender: 'ai', text: res.data.result };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Error connecting to assistant.' }]);
    }
  };

  const handleCompare = async () => {
    if (!jdText.trim()) return;
    try {
      const res = await axios.post('http://localhost:8000/match', { text: jdText });
      const { score: score, details: details } = res.data;
      console.log (res.data)
       // Push a structured AI message that includes analysis metadata
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Resume Match Analysis:\nScore: ${score}%\n${details}`,
          analysis: { score } // details intentionally omitted here because they are already in text
        }
      ]);

      setShowPopup(false);
      setJdText('');
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Error analyzing JD.' }]);
    }
  };

  const newChat = () => {
    setMessages([{ sender: 'ai', text: "👋 Hi, I'm Mustansir AI. Ask me anything about my portfolio, projects, or career journey." }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="assistant-root">
      <style>{`
        :root{
          --sidebar-width: 240px;
          --accent: #06788d;
          --muted: #9aa4b2;
          --glass: rgba(255,255,255,0.03);
          --transition: 180ms ease;
          --icon-color: #000407;
        }

        /* Dark theme variables (default) */
        .theme-dark {
          --sidebar-bg: #071428;
          --panel-bg: #061021;
          --chat-bg-start: #071226;
          --chat-bg-end: #0b1b2b;
          --bubble-ai-bg: rgba(255,255,255,0.95);
          --bubble-ai-color: #04263a;
          --bubble-user-start: #2b7be4;
          --bubble-user-end: #1f5fcf;
          --header-bg: rgba(255,255,255,0.02);
          --brand-m-bg: #10b981;
          --avatar-ai: #bfe9ff;
          --avatar-user: #e6e9ee;
          --text: #e6eef6;
          --muted: #9aa4b2;
          --icon-color: #eaeff4;
          --popup-bg: linear-gradient(180deg,#071226,#081827);
          --popup-border: rgba(255,255,255,0.06);
          --popup-button-bg: linear-gradient(90deg,#06b6d4,#1e90ff);
          --popup-button-color: #04263a;
          --popup-cancel-border: rgba(255,255,255,0.06);
        }

        /* Light theme variables */
        .theme-light {
          --sidebar-bg: linear-gradient(180deg,#f3f7fb,#e9f1f7);
          --panel-bg: #f6f9fc;
          --chat-bg-start: #ffffff;
          --chat-bg-end: #f6fbff;
          --bubble-ai-bg: #f1f7fb;
          --bubble-ai-color: #04263a;
          --bubble-user-start: #0b63c6;
          --bubble-user-end: #0753a8;
          --header-bg: rgba(0,0,0,0.03);
          --brand-m-bg: #10b981;
          --avatar-ai: #dbeeff;
          --avatar-user: #f0f2f5;
          --text: #0b1220;
          --muted: #5b6b78;
          --icon-color: #000407;
          --popup-bg: linear-gradient(180deg,#ffffff,#f7fbff);
          --popup-border: rgba(11,20,34,0.06);
          --popup-button-bg: linear-gradient(90deg,#0b63c6,#0753a8);
          --popup-button-color: #ffffff;
          --popup-cancel-border: rgba(11,20,34,0.08);
        }

        *{ box-sizing: border-box; }
        body { margin:0; }

        .assistant-root{
          display:flex;
          height:100vh;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          color: var(--text);
          background: var(--panel-bg);
          transition: background var(--transition), color var(--transition);
        }

        /* Sidebar */
        .sidebar{
          width:var(--sidebar-width);
          min-width:var(--sidebar-width);
          background: var(--sidebar-bg);
          border-right: 1px solid rgba(0,0,0,0.06);
          padding-top:72px;
          display:flex;
          flex-direction:column;
          gap:8px;
          position:fixed;
          left:0;
          top:0;
          bottom:0;
          z-index:60;
          transition: background var(--transition);
        }

        .brand{
          position:fixed;
          top:14px;
          left:18px;
          display:flex;
          align-items:center;
          gap:10px;
        }

        .m-box{
          width:36px;height:36px;border-radius:8px;background:var(--brand-m-bg);color:#04261a;display:flex;align-items:center;justify-content:center;font-weight:700;
        }

        .brand .title{ font-weight:700; color:var(--text); font-size:14px; }

        .menu-btn{
          background:transparent;
          border:none;
          color: var(--text);
          opacity:0.95;
          padding:12px 18px;
          text-align:left;
          cursor:pointer;
          font-size:14px;
          display:flex;
          align-items:center;
          gap:10px;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
          margin:4px 12px;
          border-radius:8px;
        }

        .menu-btn:hover{
          transform: translateX(6px);
          background: var(--glass);
          color: var(--text);
        }

        .menu-spacer{ flex:1; }

        /* Main area offset to account for fixed sidebar */
        .main{
          margin-left: var(--sidebar-width);
          flex:1;
          display:flex;
          flex-direction:column;
          position:relative;
        }

        /* Header */
        .header{
          height:72px;
          display:flex;
          align-items:center;
          gap:12px;
          padding:0 24px;
          background: var(--header-bg);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          position:fixed;
          left:var(--sidebar-width);
          right:0;
          top:0;
          z-index:50;
          backdrop-filter: blur(6px);
          transition: background var(--transition);
        }

        .header .title{ display:flex; align-items:center; gap:12px; font-weight:700; color:var(--text); }

        .header-right {
          margin-left: auto;
          display:flex;
          align-items:center;
          gap:12px;
        }

        .theme-toggle {
          display:inline-flex;
          align-items:center;
          gap:8px;
          background: transparent;
          border: 1px solid rgba(0,0,0,0.06);
          padding:8px 10px;
          border-radius:10px;
          cursor:pointer;
          transition: transform 120ms ease, background 120ms ease;
          color: var(--text);
        }

        .theme-toggle:hover { transform: translateY(-2px); background: var(--glass); }

        /* Chat wrap */
        .chat-wrap{
          margin-top:72px;
          padding:28px;
          display:flex;
          gap:24px;
          height: calc(100vh - 72px);
        }

        .chat-panel{
          flex:1;
          background: linear-gradient(180deg, var(--chat-bg-start), var(--chat-bg-end));
          border-radius:12px;
          padding:18px;
          display:flex;
          flex-direction:column;
          box-shadow: 0 8px 30px rgba(2,6,23,0.6);
          overflow:hidden;
          transition: background var(--transition);
        }

        /* messages area */
        .messages{
          flex:1;
          overflow:auto;
          padding:8px 6px;
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .msg-row{
          display:flex;
          align-items:center;
          gap:10px;
          max-width:100%;
        }

        .msg-row.ai{ justify-content:flex-start; }
        .msg-row.user{ justify-content:flex-end; }

        .avatar{
          width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#072033;
          flex-shrink:0;
        }

        .avatar.ai{ background: var(--avatar-ai); color:#003049; }
        .avatar.user{ background: var(--avatar-user); color:#1f2937; }

        .bubble{
          padding:12px 16px;
          border-radius:14px;
          max-width:78%;
          line-height:1.45;
          white-space:pre-wrap;
          box-shadow: 0 6px 18px rgba(2,6,23,0.25);
        }

        .bubble.ai{
          background: var(--bubble-ai-bg);
          color: var(--bubble-ai-color);
          border-radius:14px 14px 14px 4px;
          align-self:flex-start;
        }

        .bubble.user{
          background: linear-gradient(90deg, var(--bubble-user-start), var(--bubble-user-end));
          color:white;
          border-radius:14px 14px 4px 14px;
          align-self:flex-end;
        }

        /* input area */
        .composer{
          margin-top:12px;
          display:flex;
          gap:12px;
          align-items:center;
        }

        .composer textarea{
          flex:1;
          min-height:48px;
          max-height:160px;
          resize:none;
          padding:12px 14px;
          border-radius:10px;
          border:1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.02);
          color: var(--text);
          outline:none;
          font-size:14px;
        }

        .send-btn{
          background: linear-gradient(180deg,#06b6d4,#0284c7);
          color:white;
          border:none;
          padding:10px 14px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }

        .send-btn:hover{ transform: translateY(-2px); }

        /* inline progress wrapper (centered) */
        .analysis-progress-row{
          display:flex;
          justify-content:center; /* center align the whole row */
          align-items:center;
          gap:12px;
          width:100%;
          margin-bottom:6px;
        }

        .progress-compact {
          width:96px;
          height:96px;
          display:flex;
          align-items:center;
          justify-content:center;
        }

        .progress-label {
          text-align:center;
          color: var(--muted);
          font-size:13px;
          margin-top:6px;
        }

        /* popup - uses theme variables */
        .popup-backdrop{
          position:fixed; inset:0; background:rgba(2,6,23,0.45); display:flex; align-items:center; justify-content:center; z-index:120;
        }
        .popup{
          width:520px; max-width:92%;
          background: var(--popup-bg);
          border-radius:12px;
          padding:18px;
          box-shadow:0 20px 60px rgba(2,6,23,0.12);
          border: 1px solid var(--popup-border);
          transition: background var(--transition), border var(--transition), box-shadow var(--transition);
        }
        .popup h3{ margin:0; color: var(--text); }
        .popup p{ color: var(--muted); margin-top:6px; }
        .popup textarea{ width:100%; min-height:160px; padding:12px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:transparent; color:var(--text); }
        .popup .row{ display:flex; gap:10px; margin-top:12px; justify-content:flex-end; }

        .popup .btn-compare{
          background: var(--popup-button-bg);
          color: var(--popup-button-color);
          padding:10px 14px;
          border-radius:8px;
          border:none;
          font-weight:700;
          cursor:pointer;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .popup .btn-compare:hover{ transform: translateY(-3px); box-shadow: 0 10px 30px rgba(2,6,23,0.12); }

        .popup .btn-cancel{
          background: transparent;
          color: var(--text);
          padding:10px 14px;
          border-radius:8px;
          border:1px solid var(--popup-cancel-border);
          cursor:pointer;
        }
        .popup .btn-cancel:hover{ transform: translateY(-2px); background: rgba(0,0,0,0.02); }

        @media (max-width:980px){
          .header{ left:0; }
          .main{ margin-left:0; }
          .sidebar{ position:fixed; left:0; top:72px; z-index:60; transform: translateX(-100%); transition: transform 200ms ease; }
          .chat-wrap{ padding:16px; }
          .popup{ width:92%; padding:14px; }
        }
      `}</style>

      {/* Sidebar */}
      <aside className="sidebar" aria-label="Sidebar">
        <div className="brand">
          <div className="m-box">M</div>
          <div className="title">Mustansir AI</div>
        </div>

        <button className="menu-btn" onClick={newChat}>
           <span className="menu-icon" style={{ color: 'var(--icon-color)' }}>
            <i className="lni lni-comments"></i>
          </span>
          New Chat
        </button>

        <button className="menu-btn" onClick={() => setShowPopup(true)}>
          <span className="menu-icon" style={{ color: 'var(--icon-color)' }}>
            <i className="lni lni-bar-chart"></i>
          </span>
          Resume Match Analysis
        </button>

        <div className="menu-spacer" />

        <div style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: 13 }}>
          Pro tip: paste a Job Description into Resume Match Analysis to get a score and suggestions.
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Header */}
        <header className="header" role="banner">
          <div className="title">
            <div className="m-box" style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--brand-m-bg)', color: '#04261a' }}>M</div>
            <div>
              <div style={{ fontWeight: 800 }}>Mustansir AI</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Portfolio assistant</div>
            </div>
          </div>

          {/* Right side: theme toggle */}
          <div className="header-right" role="toolbar" aria-label="Header actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              title={theme === 'light' ? 'Switch to night' : 'Switch to day'}
            >
              <span className="theme-icon" aria-hidden>
                {theme === 'light' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#04263a"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V2M12 22v-2M4.22 4.22L2.8 2.8M21.2 21.2l-1.42-1.42M4 12H2M22 12h-2M4.22 19.78l-1.42 1.42M21.2 2.8L19.78 4.22" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" fill="#fff"/>
                  </svg>
                )}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{theme === 'light' ? 'Night' : 'Day'}</span>
            </button>
          </div>
        </header>

        {/* Chat area */}
        <div className="chat-wrap">
          <Card className="chat-panel" aria-label="Chat window">
            <div className="messages" role="log" aria-live="polite">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const hasAnalysis = msg.analysis && typeof msg.analysis.score === 'number';
                const score = hasAnalysis ? msg.analysis.score : null;

                // Determine progress color set and label based on score thresholds
                let gradientId = `g-${idx}`;
                let gradientStops = null;
                let verdictLabel = '';
                if (hasAnalysis) {
                  if (score > 75) {
                    // strong match - blue gradient
                    gradientStops = [{ offset: '0%', color: '#06b6d4' }, { offset: '100%', color: '#1e90ff' }];
                    verdictLabel = 'Resume Match';
                  } else if (score < 35) {
                    // not match - red gradient
                    gradientStops = [{ offset: '0%', color: '#ff4d4f' }, { offset: '100%', color: '#ff1f3a' }];
                    verdictLabel = 'Resume Not Match';
                  } else {
                    // neutral - amber/orange
                    gradientStops = [{ offset: '0%', color: '#f59e0b' }, { offset: '100%', color: '#f97316' }];
                    verdictLabel = 'Partial Match';
                  }
                }

                return (
                  <React.Fragment key={idx}>
                    {hasAnalysis && (
                      <div className="analysis-progress-row" aria-hidden>
                        <div className="progress-compact" role="img" aria-label={`Match score ${score} percent`}>
                          <svg width="96" height="96" viewBox="0 0 120 120">
                            <defs>
                              <linearGradient id={gradientId} x1="0" x2="1">
                                {gradientStops && gradientStops.map((s, i) => (
                                  <stop key={i} offset={s.offset} stopColor={s.color} />
                                ))}
                              </linearGradient>
                            </defs>

                            {/* background ring */}
                            <circle cx="60" cy="60" r="44" stroke="rgba(0,0,0,0.06)" strokeWidth="12" fill="none" />

                            {/* progress ring */}
                            <circle
                              cx="60" cy="60" r="44"
                              stroke={`url(#${gradientId})`}
                              strokeWidth="12"
                              strokeLinecap="round"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 44}
                              strokeDashoffset={2 * Math.PI * 44 * (1 - score / 100)}
                              transform="rotate(-90 60 60)"
                            />

                            {/* center text */}
                            <text x="60" y="66" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--text)">
                              {score}%
                            </text>
                          </svg>

                          {/* verdict label below the circle */}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 0 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{verdictLabel}</div>
                        </div>
                      </div>
                    )}

                    <div
                      className={`msg-row ${isUser ? 'user' : 'ai'}`}
                      style={{ alignSelf: isUser ? 'flex-end' : 'flex-start' }}
                    >
                      {!isUser && <div className="avatar ai">M</div>}
                      <div className={`bubble ${isUser ? 'user' : 'ai'}`}>
                        {msg.text}
                      </div>
                      {isUser && <div className="avatar user">U</div>}
                    </div>
                  </React.Fragment>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Composer */}
            <div className="composer" role="form" aria-label="Message composer">
              <textarea
                placeholder="Ask Mustansir AI about projects, skills, or request a resume analysis. Press Enter to send."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button className="send-btn" onClick={sendMessage} bg="#ff6b5a" textColor="#241b2f" shadow="#241b2f" borderColor="#241b2f">Send</Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Popup */}
      {showPopup && (
        <div className="popup-backdrop" role="dialog" aria-modal="true">
          <div className="popup">
            <h3>Resume Match Analysis</h3>
            <p>Paste the Job Description below and click Compare. Results will appear in the chat.</p>
            <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste Job Description here..." />
            <div className="row">
              <button className="btn-cancel" onClick={() => { setShowPopup(false); setJdText(''); }}>
                Cancel
              </button>
              <Button className="btn-compare" onClick={handleCompare} bg="#c8f36a" textColor="#241b2f" shadow="#241b2f" borderColor="#241b2f">
                Compare
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssistantPage;
