"use client";

import { useEffect, useMemo, useState } from "react";

type View = "home" | "roadmap" | "library" | "speaking" | "progress";
type LibraryTab = "patterns" | "vocabulary" | "grammar";

const icons: Record<string, string> = {
  home: "⌂", roadmap: "⌁", library: "▤", speaking: "◉", progress: "↗",
};

const nav: { id: View; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "roadmap", label: "Roadmap" },
  { id: "library", label: "Library" },
  { id: "speaking", label: "Speaking" },
  { id: "progress", label: "Progress" },
];

const patterns = [
  {
    intent: "EXPRESS UNCERTAINTY",
    pattern: "We don’t have enough evidence to conclude that ___ caused ___.",
    meaning: "我們沒有足夠證據可以判定 ___ 導致了 ___。",
    example: "We don’t have enough evidence to conclude that the redesign caused the traffic decline.",
    context: "Data / Analytics",
    mastery: "Can use with preparation",
    tone: "mint",
  },
  {
    intent: "DISCUSS A TRADE-OFF",
    pattern: "We considered ___, but decided to prioritize ___ because ___.",
    meaning: "我們考慮過 ___，但決定優先處理 ___，因為 ___。",
    example: "We considered a fully flexible workflow, but decided to prioritize predictability because exceptions were difficult to maintain.",
    context: "Complex System",
    mastery: "Learning",
    tone: "blue",
  },
  {
    intent: "EXPLAIN A CONSTRAINT",
    pattern: "Given ___, the most practical option was to ___.",
    meaning: "考量到 ___，最實際的做法是 ___。",
    example: "Given the current engineering capacity, the most practical option was to roll out the feature gradually.",
    context: "Engineering Collaboration",
    mastery: "Can understand",
    tone: "amber",
  },
  {
    intent: "CHALLENGE AN ASSUMPTION",
    pattern: "What evidence do we have that ___?",
    meaning: "我們有哪些證據可以支持 ___？",
    example: "What evidence do we have that users understand the new permission model?",
    context: "Product Thinking",
    mastery: "Can use independently",
    tone: "violet",
  },
];

const vocabulary = [
  ["reliable baseline", "可靠的基準線", "A stable reference point used to compare product performance.", "Data / Analytics"],
  ["traffic decline", "流量下滑", "A measurable decrease in visits, views, or sessions.", "Data / Analytics"],
  ["gradual rollout", "漸進式發布", "Releasing a change to an increasing share of users over time.", "Experiment"],
  ["edge case", "邊界情境", "An uncommon condition outside the typical user flow.", "Complex System"],
  ["role permission", "角色權限", "Access rules based on a user’s role in the system.", "BPM / Enterprise"],
  ["human review", "人工審核", "A checkpoint where a person validates AI-generated output.", "AI Product"],
];

const grammar = [
  ["Express uncertainty", "Hedging", "Use careful language when evidence is limited.", "The decline may be related to the rollout, but we cannot confirm causality yet."],
  ["Explain causality", "Cause & effect", "Separate correlation from a supported causal claim.", "The new flow reduced one step, which led to a higher completion rate."],
  ["State a hypothesis", "Conditional", "Describe what you expect under a testable condition.", "If we simplify the permission setup, new admins may complete onboarding faster."],
  ["Describe constraints", "Concession & contrast", "Acknowledge a limitation before presenting the decision.", "Although the flexible model covers more cases, it is harder to maintain."],
];

const phases = [
  ["01", "Product English Foundation", "Explain familiar work clearly for 3–5 minutes.", "IN PROGRESS", "3 / 5 milestones"],
  ["02", "Professional Product Communication", "Explain evidence, rationale, trade-offs, and constraints.", "NEXT", "0 / 6 milestones"],
  ["03", "Case Communication", "Turn real projects into reusable professional stories.", "LOCKED", "0 / 4 milestones"],
  ["04", "Cross-functional Discussion", "Clarify, disagree, and negotiate in live discussions.", "LOCKED", "0 / 5 milestones"],
  ["05", "Advanced Product Communication", "Defend decisions under unprepared follow-up questions.", "LOCKED", "0 / 4 milestones"],
];

const skills = [
  ["Vocabulary", 64, "Can use with preparation"],
  ["Sentence Patterns", 52, "Can use with preparation"],
  ["Product Explanation", 46, "Can understand"],
  ["Data Explanation", 38, "Can understand"],
  ["Trade-off Discussion", 28, "Learning"],
  ["Technical Communication", 24, "Learning"],
];

function Ring({ value, label }: { value: number; label: string }) {
  return (
    <div className="ring-wrap">
      <div className="ring" style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}>
        <div><strong>{value}%</strong><span>{label}</span></div>
      </div>
    </div>
  );
}

export default function LearningApp() {
  const [view, setView] = useState<View>("home");
  const [libraryTab, setLibraryTab] = useState<LibraryTab>("patterns");
  const [query, setQuery] = useState("");
  const [captureOpen, setCaptureOpen] = useState(false);
  const [capture, setCapture] = useState("");
  const [captured, setCaptured] = useState(false);
  const [timer, setTimer] = useState(60);
  const [running, setRunning] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(0);

  useEffect(() => {
    if (!running || timer === 0) return;
    const id = window.setInterval(() => setTimer((v) => v - 1), 1000);
    return () => window.clearInterval(id);
  }, [running, timer]);

  useEffect(() => {
    if (timer === 0) setRunning(false);
  }, [timer]);

  const filteredPatterns = useMemo(() => patterns.filter((p) =>
    `${p.intent} ${p.pattern} ${p.context}`.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  function navigate(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitCapture() {
    if (!capture.trim()) return;
    setCaptured(true);
    window.setTimeout(() => {
      setCapture("");
      setCaptured(false);
      setCaptureOpen(false);
    }, 1400);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("home")} aria-label="Go home">
          <span className="brand-mark">PD</span>
          <span><strong>Product Design</strong><small>English System</small></span>
        </button>

        <nav aria-label="Main navigation">
          {nav.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => navigate(item.id)}>
              <span className="nav-icon">{icons[item.id]}</span>{item.label}
              {item.id === "speaking" && <span className="count">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="phase-mini">
            <div className="eyebrow">CURRENT PHASE</div>
            <strong>01 · Foundation</strong>
            <div className="mini-progress"><span /></div>
            <small>3 of 5 milestones</small>
          </div>
          <button className="capture-button" onClick={() => setCaptureOpen(true)}><span>＋</span> Fast capture</button>
          <div className="profile"><span>YP</span><div><strong>Ya-Ping</strong><small>Senior Product Designer</small></div><b>•••</b></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{nav.find(n => n.id === view)?.label}</strong></div>
          <div className="top-actions">
            <label className="global-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your learning system" /><kbd>⌘ K</kbd></label>
            <button className="icon-button" aria-label="Notifications">○<i /></button>
          </div>
        </header>

        {view === "home" && <Home navigate={navigate} openCapture={() => setCaptureOpen(true)} />}
        {view === "roadmap" && <Roadmap />}
        {view === "library" && <Library tab={libraryTab} setTab={setLibraryTab} patterns={filteredPatterns} selected={selectedPattern} setSelected={setSelectedPattern} />}
        {view === "speaking" && <Speaking timer={timer} running={running} setRunning={setRunning} reset={() => { setTimer(60); setRunning(false); }} />}
        {view === "progress" && <Progress />}
      </section>

      {captureOpen && (
        <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setCaptureOpen(false)}>
          <section className="capture-modal" role="dialog" aria-modal="true" aria-labelledby="capture-title">
            <button className="modal-close" onClick={() => setCaptureOpen(false)}>×</button>
            <div className="eyebrow">FROM REAL WORK</div>
            <h2 id="capture-title">What couldn’t you say today?</h2>
            <p>Capture it now. Structure and practice it later.</p>
            <div className="capture-types"><button className="chosen">Couldn’t say</button><button>New word</button><button>Work situation</button></div>
            <textarea autoFocus value={capture} onChange={(e) => setCapture(e.target.value)} placeholder="例如：沒有可靠的 baseline，不能判斷新版造成流量下降。" />
            <div className="capture-context"><span>Context</span><button>Data-driven Media Product⌄</button></div>
            <div className="modal-footer"><small>You can add details later.</small><button className="primary" onClick={submitCapture}>{captured ? "✓ Saved to inbox" : "Save capture →"}</button></div>
          </section>
        </div>
      )}
    </main>
  );
}

function Home({ navigate, openCapture }: { navigate: (v: View) => void; openCapture: () => void }) {
  return <div className="page home-page">
    <div className="welcome-row">
      <div><div className="eyebrow">SUNDAY, AUGUST 30</div><h1>Good afternoon, Ya-Ping.</h1><p>Here’s the most valuable thing to practice next.</p></div>
      <button className="ghost-button" onClick={openCapture}>＋ Capture from work</button>
    </div>

    <section className="next-task">
      <div className="task-accent" />
      <div className="task-main">
        <div className="task-label"><span>▶</span> NEXT BEST TASK <em>12 MIN</em></div>
        <h2>Explain why a reliable baseline matters</h2>
        <p>Practice connecting evidence to a product decision without overstating certainty.</p>
        <div className="context-chips"><span>Data explanation</span><span>Speaking · Level 2</span><span>3 related patterns</span></div>
        <div className="why"><b>Why this task?</b> This supports your current milestone and targets your weakest skill: evidence communication.</div>
      </div>
      <div className="task-side">
        <Ring value={62} label="READY" />
        <button className="primary" onClick={() => navigate("speaking")}>Start practice <span>→</span></button>
        <button className="text-button">View learning objects</button>
      </div>
    </section>

    <div className="home-grid">
      <section className="panel this-week">
        <div className="panel-head"><div><div className="eyebrow">YOUR FOCUS</div><h3>This week</h3></div><span>3 of 5 complete</span></div>
        <div className="week-progress"><span /></div>
        {[
          ["done", "Review 6 evidence patterns", "Pattern · 8 min"],
          ["done", "Use ‘reliable baseline’ in context", "Vocabulary · 5 min"],
          ["current", "Explain why a baseline matters", "Speaking · 12 min"],
          ["", "Compare canary and full rollout", "Speaking · 15 min"],
          ["", "Review uncertainty language", "Grammar · 8 min"],
        ].map((t, i) => <div className={`week-task ${t[0]}`} key={i}><span className="check">{t[0] === "done" ? "✓" : i + 1}</span><div><strong>{t[1]}</strong><small>{t[2]}</small></div>{t[0] === "current" && <b>UP NEXT</b>}</div>)}
      </section>

      <section className="panel milestone">
        <div className="panel-head"><div><div className="eyebrow">CURRENT MILESTONE</div><h3>Make evidence clear</h3></div><button onClick={() => navigate("roadmap")}>↗</button></div>
        <p>Explain why a reliable baseline matters and answer two follow-up questions.</p>
        <div className="milestone-visual"><strong>3</strong><span>/ 5</span><small>REQUIREMENTS MET</small></div>
        <ul><li className="met">Use 6 core data terms</li><li className="met">Use 3 evidence patterns</li><li>Speak for 3 minutes</li><li>Answer 2 follow-ups</li></ul>
      </section>
    </div>

    <section className="learning-now">
      <div className="section-head"><div><div className="eyebrow">ACTIVE LEARNING</div><h3>Continue learning</h3></div><button onClick={() => navigate("library")}>View library →</button></div>
      <div className="learning-cards">
        <article className="learning-card mint"><span className="card-type">PATTERN</span><div className="card-icon">“</div><h4>We don’t have enough evidence to conclude that ___ caused ___.</h4><p>Express uncertainty</p><footer><span className="level-dot"><i /><i /><i /><i /></span><b>Use with preparation</b></footer></article>
        <article className="learning-card blue"><span className="card-type">VOCABULARY</span><div className="word"><h4>reliable baseline</h4><small>/rɪˈlaɪəbəl ˈbeɪslaɪn/</small></div><p>A stable reference point used to compare product performance.</p><footer><span>Data / Analytics</span><b>Review today</b></footer></article>
        <article className="learning-card amber"><span className="card-type">GRAMMAR</span><div className="card-icon">≈</div><h4>Hedging for uncertainty</h4><p>Communicate carefully when evidence is incomplete.</p><footer><span>4 related patterns</span><b>Learning</b></footer></article>
      </div>
    </section>

    <section className="bottom-strip">
      <div><span className="pulse">!</span><p><strong>3 items are due for review</strong><small>Practice production, not just recognition.</small></p><button>Review now →</button></div>
      <div><span className="weak">↘</span><p><strong>Current weakness</strong><small>Trade-off discussion · Learning</small></p><button onClick={() => navigate("library")}>Practice →</button></div>
    </section>
  </div>;
}

function Roadmap() {
  return <div className="page"><div className="page-title"><div><div className="eyebrow">PROGRESSIVE LEARNING</div><h1>Your roadmap</h1><p>Build from clear explanations to real-time professional discussion.</p></div><div className="phase-score"><b>Phase 01</b><span>60% complete</span></div></div>
    <section className="roadmap-list">
      {phases.map((p, i) => <article className={`phase-row ${i === 0 ? "phase-active" : ""}`} key={p[0]}>
        <div className="phase-number">{p[0]}</div><div className="phase-copy"><span className="phase-state">{p[3]}</span><h2>{p[1]}</h2><p>{p[2]}</p><small>{p[4]}</small></div>
        <div className="phase-line"><span style={{ width: i === 0 ? "60%" : "0%" }} /></div><button>{i < 2 ? "View phase →" : "○"}</button>
      </article>)}
    </section>
    <section className="definition"><div className="eyebrow">PHASE 01 · DEFINITION OF DONE</div><h3>Explain familiar Product Design work clearly for 3–5 minutes.</h3><div><span>✓ Use core Product Design vocabulary in context</span><span>✓ Structure an explanation with reusable patterns</span><span>○ Answer two prepared follow-up questions</span></div></section>
  </div>;
}

function Library({ tab, setTab, patterns: shown, selected, setSelected }: { tab: LibraryTab; setTab: (t: LibraryTab) => void; patterns: typeof patterns; selected: number; setSelected: (n: number) => void }) {
  return <div className="page"><div className="page-title"><div><div className="eyebrow">REUSABLE LANGUAGE</div><h1>Learning library</h1><p>Language objects connected to real Product Design situations.</p></div><div className="library-total"><b>34</b><span>active objects</span></div></div>
    <div className="tabs"><button className={tab === "patterns" ? "active" : ""} onClick={() => setTab("patterns")}>Sentence patterns <span>12</span></button><button className={tab === "vocabulary" ? "active" : ""} onClick={() => setTab("vocabulary")}>Vocabulary <span>16</span></button><button className={tab === "grammar" ? "active" : ""} onClick={() => setTab("grammar")}>Grammar <span>6</span></button></div>
    {tab === "patterns" && <div className="library-layout"><div className="object-list">{shown.map((p, i) => <button className={selected === i ? "selected" : ""} key={p.pattern} onClick={() => setSelected(i)}><span className={`object-dot ${p.tone}`} /><div><small>{p.intent}</small><strong>{p.pattern}</strong><em>{p.context}</em></div><b>→</b></button>)}</div>{shown.length > 0 && <PatternDetail pattern={shown[Math.min(selected, shown.length - 1)]} />}</div>}
    {tab === "vocabulary" && <div className="vocab-grid">{vocabulary.map(v => <article key={v[0]}><span>{v[3]}</span><h3>{v[0]}</h3><h4>{v[1]}</h4><p>{v[2]}</p><button>Open relationships →</button></article>)}</div>}
    {tab === "grammar" && <div className="grammar-list">{grammar.map((g, i) => <article key={g[0]}><div className="grammar-num">0{i + 1}</div><div><span>{g[1]}</span><h3>{g[0]}</h3><p>{g[2]}</p><blockquote>{g[3]}</blockquote></div></article>)}</div>}
  </div>;
}

function PatternDetail({ pattern }: { pattern: typeof patterns[number] }) {
  return <article className="pattern-detail"><div className="detail-top"><span className={`object-dot ${pattern.tone}`} /><div><small>{pattern.intent}</small><h2>{pattern.pattern}</h2></div></div><div className="meaning">{pattern.meaning}</div><div className="detail-section"><label>WORK EXAMPLE</label><p>{pattern.example}</p></div><div className="slot-row"><span>___</span><p>Replace the slots with the evidence and outcome in your own case.</p></div><div className="detail-section"><label>RELATED LEARNING</label><div className="related-chips"><span>reliable baseline</span><span>cause & effect</span><span>Evidence communication</span></div></div><div className="mastery-row"><span>MASTERY</span><b>{pattern.mastery}</b></div><button className="primary wide">Practice this pattern →</button></article>;
}

function Speaking({ timer, running, setRunning, reset }: { timer: number; running: boolean; setRunning: (v: boolean) => void; reset: () => void }) {
  const min = Math.floor(timer / 60).toString().padStart(2, "0");
  const sec = (timer % 60).toString().padStart(2, "0");
  return <div className="page"><div className="page-title"><div><div className="eyebrow">SPEAK TO LEARN</div><h1>Speaking practice</h1><p>Turn prepared language into independent professional communication.</p></div><span className="level-badge">LEVEL 2 · 1–3 MIN</span></div>
    <section className="speaking-stage"><div className="speaking-context"><span>DATA-DRIVEN PRODUCT DESIGN</span><h2>Explain why a reliable baseline matters.</h2><p>Your PM asks whether the redesign caused a traffic decline. Explain why the current data is not enough to support that conclusion.</p></div>
      <div className="speaking-grid"><div className="prep"><div className="eyebrow">KEY POINTS</div><ul><li>Define what a reliable baseline gives you.</li><li>Separate correlation from causality.</li><li>Explain what evidence you still need.</li><li>Recommend a practical next step.</li></ul><div className="eyebrow">USEFUL PATTERNS</div><button>We don’t have enough evidence to conclude that...</button><button>Before we attribute this change to...</button><button>The most practical next step is to...</button></div>
        <div className="recorder"><div className={`timer-ring ${running ? "running" : ""}`}><div><strong>{min}:{sec}</strong><span>{running ? "SPEAKING" : timer === 0 ? "COMPLETE" : "READY"}</span></div></div><button className="record-button" onClick={() => timer === 0 ? reset() : setRunning(!running)}><span>{timer === 0 ? "↻" : running ? "Ⅱ" : "▶"}</span>{timer === 0 ? "Try again" : running ? "Pause" : "Start 60 sec"}</button><small>Your recording stays on this device.</small></div></div>
      <div className="after-speaking"><div><span>1</span><p><strong>Speak without reading</strong><small>Use the prompts only when you get stuck.</small></p></div><div><span>2</span><p><strong>Notice the gap</strong><small>Write down missing words or patterns.</small></p></div><div><span>3</span><p><strong>Retry with one improvement</strong><small>Focus on clarity, not perfection.</small></p></div></div>
    </section>
  </div>;
}

function Progress() {
  return <div className="page"><div className="page-title"><div><div className="eyebrow">ABILITY, NOT ACTIVITY</div><h1>Skill progress</h1><p>Track what you can understand, prepare, and use independently.</p></div><div className="evidence-count"><b>18</b><span>practice attempts</span></div></div>
    <div className="progress-summary"><Ring value={46} label="OVERALL" /><div><div className="eyebrow">CURRENT ABILITY</div><h2>Can use with preparation</h2><p>You can explain familiar topics when you prepare key language first. The next transition is using patterns independently in follow-up questions.</p><div className="mastery-scale"><span className="passed">Understand</span><span className="passed">Prepare</span><span className="current">Independent</span><span>Automatic</span></div></div></div>
    <section className="skill-table"><div className="table-head"><h3>Core skills</h3><span>Based on recent evidence</span></div>{skills.map((s) => <div className="skill-row" key={s[0]}><strong>{s[0]}</strong><div className="skill-bar"><span style={{ width: `${s[1]}%` }} /></div><b>{s[1]}%</b><em>{s[2]}</em><button>→</button></div>)}</section>
    <div className="evidence-note"><span>◎</span><div><strong>How progress works</strong><p>Mastery increases when you produce language in speaking or discussion—not when you simply view an item.</p></div></div>
  </div>;
}
