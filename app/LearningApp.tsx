"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { appendedGrammar, appendedPatterns, appendedVocabulary, speakingTasks } from "./data/p0-library";

type View = "home" | "roadmap" | "library" | "speaking" | "progress";
type LibraryTab = "patterns" | "vocabulary" | "grammar";

let speechStartTimer: number | undefined;

function prepareSpeechText(text: string) {
  return text
    .replaceAll("___", "blank")
    .replaceAll("CTR", "C T R")
    .replaceAll("GA4", "G A 4")
    .replaceAll(" / ", " or ")
    .replaceAll("/", " or ")
    .replace(/[()]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function speakEnglish(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (speechStartTimer) window.clearTimeout(speechStartTimer);
  window.speechSynthesis.cancel();
  speechStartTimer = window.setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(prepareSpeechText(text));
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const googleUSVoice = voices.find(v => v.name.toLowerCase() === "google us english")
      ?? voices.find(v => v.name.toLowerCase().includes("google us english"));
    const fallbackEnglishVoice = voices.find(v => v.lang === "en-US")
      ?? voices.find(v => v.lang.startsWith("en"));
    utterance.voice = googleUSVoice ?? fallbackEnglishVoice ?? null;
    window.speechSynthesis.speak(utterance);
    speechStartTimer = undefined;
  }, 180);
}

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

const existingPatterns = [
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

const existingVocabulary = [
  { term:"active user", zh:"活躍使用者", definition:"A user who engages with a site or app during a specified period.", tool:"GA4", category:"Users" },
  { term:"new user", zh:"新使用者", definition:"A user who interacts with the site or app for the first time.", tool:"GA4", category:"Users" },
  { term:"session", zh:"工作階段", definition:"A period during which a user interacts with a website or app.", tool:"GA4", category:"Traffic" },
  { term:"engaged session", zh:"參與工作階段", definition:"A session lasting over 10 seconds, containing a key event, or having at least two page or screen views.", tool:"GA4", category:"Engagement" },
  { term:"engagement rate", zh:"參與率", definition:"The percentage of sessions that qualify as engaged sessions.", tool:"GA4", category:"Engagement" },
  { term:"bounce rate", zh:"跳出率", definition:"The percentage of sessions that were not engaged sessions.", tool:"GA4", category:"Engagement" },
  { term:"event", zh:"事件", definition:"A measured interaction or occurrence, such as a page load, link click, or purchase.", tool:"GA4", category:"Events" },
  { term:"event parameter", zh:"事件參數", definition:"Additional data that provides context and details about an event.", tool:"GA4", category:"Events" },
  { term:"key event", zh:"重要事件", definition:"An event marked as especially important to the success of the business.", tool:"GA4", category:"Events" },
  { term:"dimension", zh:"維度", definition:"An attribute used to describe, segment, and organize analytics data.", tool:"GA4", category:"Data model" },
  { term:"metric", zh:"指標", definition:"A quantitative measurement used to evaluate activity or performance.", tool:"GA4", category:"Data model" },
  { term:"source / medium", zh:"來源／媒介", definition:"The origin of traffic and the method through which users arrived.", tool:"GA4", category:"Acquisition" },
  { term:"impression", zh:"曝光", definition:"An instance when a link to the site is shown in a Google service.", tool:"Search Console", category:"Performance" },
  { term:"click", zh:"點擊", definition:"An instance when a user clicks a link from Google to the site.", tool:"Search Console", category:"Performance" },
  { term:"click-through rate (CTR)", zh:"點閱率", definition:"Clicks divided by impressions, expressed as a percentage.", tool:"Search Console", category:"Performance" },
  { term:"average position", zh:"平均排名", definition:"The average position of the topmost result from the site in Search results.", tool:"Search Console", category:"Performance" },
  { term:"search query", zh:"搜尋查詢", definition:"The words a user typed or spoke when searching on Google.", tool:"Search Console", category:"Search demand" },
  { term:"search appearance", zh:"搜尋結果呈現形式", definition:"The visual or result type through which a page appears in Google Search.", tool:"Search Console", category:"Search demand" },
  { term:"indexing", zh:"建立索引", definition:"The process of analyzing and storing a page so it may appear in search results.", tool:"Search Console", category:"Indexing" },
  { term:"crawl", zh:"檢索／爬取", definition:"The process by which Google discovers and fetches pages from the web.", tool:"Search Console", category:"Indexing" },
  { term:"sitemap", zh:"網站地圖", definition:"A file that tells search engines about pages and files on a site.", tool:"Search Console", category:"Indexing" },
  { term:"baseline", zh:"基準線", definition:"A reference point used to compare later performance or change.", tool:"Data Analysis", category:"Measurement" },
  { term:"benchmark", zh:"比較基準", definition:"A standard or external reference used to evaluate performance.", tool:"Data Analysis", category:"Measurement" },
  { term:"trend", zh:"趨勢", definition:"The general direction in which a metric changes over time.", tool:"Data Analysis", category:"Trend" },
  { term:"fluctuation", zh:"波動", definition:"A short-term rise or fall in a value around its typical level.", tool:"Data Analysis", category:"Trend" },
  { term:"anomaly", zh:"異常現象", definition:"A data point or pattern that differs noticeably from what is expected.", tool:"Data Analysis", category:"Data quality" },
  { term:"outlier", zh:"離群值", definition:"An observation that is unusually far from the other values in a dataset.", tool:"Data Analysis", category:"Data quality" },
  { term:"data discrepancy", zh:"資料差異", definition:"An unexpected difference between values from two reports, sources, or methods.", tool:"Data Analysis", category:"Data quality" },
  { term:"segment", zh:"資料區隔／客群", definition:"A subset of users or data grouped by shared characteristics or behavior.", tool:"Data Analysis", category:"Segmentation" },
  { term:"cohort", zh:"同類群組", definition:"A group of users who share a defining event or time period.", tool:"Data Analysis", category:"Segmentation" },
  { term:"funnel", zh:"漏斗", definition:"A sequence of steps used to analyze progression toward a target action.", tool:"Data Analysis", category:"Behavior" },
  { term:"drop-off rate", zh:"流失率", definition:"The percentage of users who leave before completing the next step in a flow.", tool:"Data Analysis", category:"Behavior" },
  { term:"conversion rate", zh:"轉換率", definition:"The percentage of users who complete a defined target action.", tool:"Data Analysis", category:"Outcome" },
  { term:"retention rate", zh:"留存率", definition:"The percentage of users who return or remain active after a given period.", tool:"Data Analysis", category:"Outcome" },
  { term:"hypothesis", zh:"假設", definition:"A testable explanation or prediction about user behavior or product performance.", tool:"Data Analysis", category:"Experiment" },
  { term:"control group", zh:"控制組", definition:"The group that does not receive the tested change and provides a comparison point.", tool:"Data Analysis", category:"Experiment" },
  { term:"variant", zh:"實驗版本", definition:"A version of a product experience tested against another version.", tool:"Data Analysis", category:"Experiment" },
  { term:"sample size", zh:"樣本數", definition:"The number of observations or participants included in an analysis.", tool:"Data Analysis", category:"Statistics" },
  { term:"statistical significance", zh:"統計顯著性", definition:"Evidence that an observed difference is unlikely to be explained by random variation alone.", tool:"Data Analysis", category:"Statistics" },
  { term:"correlation", zh:"相關性", definition:"A relationship in which two variables change together without necessarily proving cause.", tool:"Data Analysis", category:"Causality" },
  { term:"causation", zh:"因果關係", definition:"A relationship in which a change in one factor produces a change in another.", tool:"Data Analysis", category:"Causality" },
  { term:"confounding variable", zh:"混淆變數", definition:"An outside factor that may influence both the assumed cause and the observed result.", tool:"Data Analysis", category:"Causality" },
];

const existingGrammar = [
  ["Express uncertainty", "Hedging", "Use careful language when evidence is limited.", "The decline may be related to the rollout, but we cannot confirm causality yet."],
  ["Explain causality", "Cause & effect", "Separate correlation from a supported causal claim.", "The new flow reduced one step, which led to a higher completion rate."],
  ["State a hypothesis", "Conditional", "Describe what you expect under a testable condition.", "If we simplify the permission setup, new admins may complete onboarding faster."],
  ["Describe constraints", "Concession & contrast", "Acknowledge a limitation before presenting the decision.", "Although the flexible model covers more cases, it is harder to maintain."],
];

const patterns = [
  ...existingPatterns.map((pattern, index) => ({
    ...pattern,
    id:`p-existing-${String(index + 1).padStart(3,"0")}`,
    domain:pattern.context,
    skillId:["skill-evidence","skill-tradeoff","skill-technical","skill-decision-defense"][index],
    sourceStatus:"existing" as const,
  })),
  ...appendedPatterns,
];

const vocabulary = [
  ...existingVocabulary.map((item, index) => ({
    ...item,
    id:`v-existing-${String(index + 1).padStart(3,"0")}`,
    domain:item.tool === "GA4" || item.tool === "Search Console" || item.tool === "Data Analysis" ? "Data / Analytics" : item.tool,
    skillId:"skill-data-explanation",
    sourceStatus:"existing" as const,
  })),
  ...appendedVocabulary,
];

const grammar = [
  ...existingGrammar,
  ...appendedGrammar.map(item => [item.title,item.label,item.use,item.example]),
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
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [vocabTool, setVocabTool] = useState("All");
  const [selectedSpeakingTask, setSelectedSpeakingTask] = useState(0);
  const [commonIds, setCommonIds] = useState<string[]>([]);
  const [commonOnly, setCommonOnly] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [readinessChecks, setReadinessChecks] = useState<string[]>([]);

  useEffect(() => {
    if (!running || timer === 0) return;
    const id = window.setInterval(() => setTimer((v) => v - 1), 1000);
    return () => window.clearInterval(id);
  }, [running, timer]);

  useEffect(() => {
    if (timer === 0) setRunning(false);
  }, [timer]);

  useEffect(() => {
    const saved = window.localStorage.getItem("pdes-common-library-ids");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCommonIds(parsed.filter((id): id is string => typeof id === "string"));
      } catch { /* keep an empty set */ }
    }
  }, []);

  useEffect(() => {
    const readList = (key: string) => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
      } catch { return []; }
    };
    setMasteredIds(readList("pdes-mastered-library-ids"));
    setCompletedTaskIds(readList("pdes-completed-speaking-task-ids"));
    setReadinessChecks(readList("pdes-p0-readiness-checks"));
  }, []);

  function toggleStored(id: string, values: string[], setValues: (next: string[]) => void, key: string) {
    const next = values.includes(id) ? values.filter(item => item !== id) : [...values, id];
    setValues(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  }

  function toggleCommon(id: string) {
    setCommonIds(current => {
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      window.localStorage.setItem("pdes-common-library-ids", JSON.stringify(next));
      return next;
    });
  }

  const filteredPatterns = useMemo(() => patterns.filter((p) =>
    `${p.intent} ${p.pattern} ${p.context}`.toLowerCase().includes(query.toLowerCase()) && (!commonOnly || commonIds.includes(p.id))
  ), [query, commonOnly, commonIds]);

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
        {view === "library" && <Library tab={libraryTab} setTab={setLibraryTab} patterns={filteredPatterns} selected={selectedPattern} setSelected={setSelectedPattern} vocabTool={vocabTool} setVocabTool={setVocabTool} query={query} commonIds={commonIds} commonOnly={commonOnly} setCommonOnly={setCommonOnly} toggleCommon={toggleCommon} masteredIds={masteredIds} toggleMastered={(id) => toggleStored(id, masteredIds, setMasteredIds, "pdes-mastered-library-ids")} />}
        {view === "speaking" && <Speaking taskIndex={selectedSpeakingTask} setTaskIndex={(index) => { setSelectedSpeakingTask(index); setTimer(60); setRunning(false); }} timer={timer} running={running} setRunning={setRunning} reset={() => { setTimer(60); setRunning(false); }} completedTaskIds={completedTaskIds} toggleCompleted={(id) => toggleStored(id, completedTaskIds, setCompletedTaskIds, "pdes-completed-speaking-task-ids")} />}
        {view === "progress" && <Progress masteredIds={masteredIds} completedTaskIds={completedTaskIds} readinessChecks={readinessChecks} toggleReadiness={(id) => toggleStored(id, readinessChecks, setReadinessChecks, "pdes-p0-readiness-checks")} navigate={navigate} />}
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

function Library({ tab, setTab, patterns: shown, selected, setSelected, vocabTool, setVocabTool, query, commonIds, commonOnly, setCommonOnly, toggleCommon, masteredIds, toggleMastered }: { tab: LibraryTab; setTab: (t: LibraryTab) => void; patterns: typeof patterns; selected: number | null; setSelected: (n: number | null) => void; vocabTool: string; setVocabTool: (v: string) => void; query: string; commonIds:string[]; commonOnly:boolean; setCommonOnly:(v:boolean)=>void; toggleCommon:(id:string)=>void; masteredIds:string[]; toggleMastered:(id:string)=>void }) {
  const [visibleLimit, setVisibleLimit] = useState(24);
  const visibleVocabulary = vocabulary.filter(v => (vocabTool === "All" || v.tool === vocabTool) && `${v.term} ${v.zh} ${v.category}`.toLowerCase().includes(query.toLowerCase()) && (!commonOnly || commonIds.includes(v.id)));
  const displayedVocabulary = visibleVocabulary.slice(0, visibleLimit);
  const sources = ["All", ...Array.from(new Set(vocabulary.map(v => v.tool)))];
  const visibleGrammar = grammar.filter(g => !commonOnly || commonIds.includes(`grammar:${g[0]}`));
  useEffect(() => setVisibleLimit(24), [vocabTool, query, commonOnly]);
  return <div className="page"><div className="page-title"><div><div className="eyebrow">REUSABLE LANGUAGE</div><h1>Learning library</h1><p>Language objects connected to real Product Design situations.</p></div><div className="library-overview"><div className="library-total"><b>{vocabulary.length + patterns.length + grammar.length}</b><span>active objects</span></div><button className={commonOnly ? "common-filter active" : "common-filter"} onClick={() => setCommonOnly(!commonOnly)}>★ 常用 <em>{commonIds.length}</em></button></div></div>
    <div className="tabs"><button className={tab === "patterns" ? "active" : ""} onClick={() => setTab("patterns")}>Sentence patterns <span>{patterns.length}</span></button><button className={tab === "vocabulary" ? "active" : ""} onClick={() => setTab("vocabulary")}>Vocabulary <span>{vocabulary.length}</span></button><button className={tab === "grammar" ? "active" : ""} onClick={() => setTab("grammar")}>Grammar <span>{grammar.length}</span></button></div>
    {tab === "patterns" && (shown.length > 0 ? <div className="library-layout"><div className="object-list">{shown.map((p, i) => <Fragment key={p.id}><button className={selected === i ? "selected" : ""} onClick={() => setSelected(selected === i ? null : i)} aria-expanded={selected === i}><span className={`object-dot ${p.tone}`} /><div><small>{p.intent}</small><strong>{p.pattern}</strong><em>{p.context}{commonIds.includes(p.id) ? " · ★ 常用" : ""}{masteredIds.includes(p.id) ? " · ✓ 已熟練" : ""}</em></div><b>{selected === i ? "−" : "+"}</b></button>{selected === i && <PatternDetail className="mobile-pattern-detail" pattern={p} isCommon={commonIds.includes(p.id)} toggleCommon={toggleCommon} isMastered={masteredIds.includes(p.id)} toggleMastered={toggleMastered} />}</Fragment>)}</div><PatternDetail className="desktop-pattern-detail" pattern={shown[Math.min(selected ?? 0, shown.length - 1)]} isCommon={commonIds.includes(shown[Math.min(selected ?? 0, shown.length - 1)].id)} toggleCommon={toggleCommon} isMastered={masteredIds.includes(shown[Math.min(selected ?? 0, shown.length - 1)].id)} toggleMastered={toggleMastered} /></div> : <LibraryEmpty commonOnly={commonOnly} />)}
    {tab === "vocabulary" && <><div className="vocab-toolbar"><div><span className="toolbar-label">SOURCE / DOMAIN</span>{sources.map(tool => <button key={tool} className={vocabTool === tool ? "active" : ""} onClick={() => setVocabTool(tool)}>{tool}{tool !== "All" && <em>{vocabulary.filter(v => v.tool === tool).length}</em>}</button>)}</div><span className="result-count">Showing {displayedVocabulary.length} of {visibleVocabulary.length}</span></div>{displayedVocabulary.length > 0 ? <div className="vocab-grid">{displayedVocabulary.map(v => <article key={v.id}><div className="vocab-labels"><span className={v.tool === "GA4" ? "tool-ga" : v.tool === "Search Console" ? "tool-gsc" : "tool-data"}>{v.tool}</span><span>{v.category}</span><button className={commonIds.includes(v.id) ? "common-toggle active" : "common-toggle"} onClick={() => toggleCommon(v.id)} aria-label={`${commonIds.includes(v.id) ? "Remove" : "Add"} ${v.term} ${commonIds.includes(v.id) ? "from" : "to"} common`}>★ 常用</button><button className={masteredIds.includes(v.id) ? "mastered-mini active" : "mastered-mini"} onClick={() => toggleMastered(v.id)}>{masteredIds.includes(v.id) ? "✓ 熟練" : "標記熟練"}</button></div><div className="vocab-title"><h3>{v.term}</h3><button className="speak-button" onClick={() => speakEnglish(v.term)} aria-label={`Read ${v.term} aloud`} title="Read word aloud">▶</button></div><h4>{v.zh}</h4><p>{v.definition}</p><div className="vocab-actions"><button className="listen-definition" onClick={() => speakEnglish(`${v.term}. ${v.definition}`)}>◖)) Listen to definition</button><button>Open relationships →</button></div></article>)}</div> : <LibraryEmpty commonOnly={commonOnly} />}{displayedVocabulary.length < visibleVocabulary.length && <button className="load-more" onClick={() => setVisibleLimit(limit => limit + 24)}>Load 24 more <span>{visibleVocabulary.length - displayedVocabulary.length} remaining</span></button>}</>}
    {tab === "grammar" && (visibleGrammar.length > 0 ? <div className="grammar-list">{visibleGrammar.map((g, i) => { const grammarId = `grammar:${g[0]}`; return <article key={g[0]}><div className="grammar-num">{String(i + 1).padStart(2,"0")}</div><div><div className="grammar-label-row"><span>{g[1]}</span><div className="grammar-tools"><button className={commonIds.includes(grammarId) ? "common-toggle active" : "common-toggle"} onClick={() => toggleCommon(grammarId)}>★ 常用</button><button className={masteredIds.includes(grammarId) ? "mastered-mini active" : "mastered-mini"} onClick={() => toggleMastered(grammarId)}>{masteredIds.includes(grammarId) ? "✓ 已熟練" : "標記熟練"}</button><button className="inline-listen" onClick={() => speakEnglish(`${g[1]}. ${g[0]}. ${g[2]}`)}>◖)) Listen to explanation</button></div></div><h3>{g[0]}</h3><p>{g[2]}</p><div className="grammar-example"><blockquote>{g[3]}</blockquote><button className="speak-button" onClick={() => speakEnglish(g[3])} aria-label={`Read grammar example ${i + 1} aloud`} title="Read example aloud">▶</button></div></div></article>})}</div> : <LibraryEmpty commonOnly={commonOnly} />)}
  </div>;
}

function LibraryEmpty({ commonOnly }: { commonOnly: boolean }) {
  return <div className="library-empty"><span>☆</span><h3>{commonOnly ? "尚未標記常用內容" : "找不到符合的內容"}</h3><p>{commonOnly ? "點選單字、句型或文法旁的「★ 常用」，即可建立自己的優先學習清單。" : "請調整搜尋字詞或分類篩選。"}</p></div>;
}

function PatternDetail({ pattern, isCommon, toggleCommon, isMastered, toggleMastered, className = "" }: { pattern: typeof patterns[number]; isCommon:boolean; toggleCommon:(id:string)=>void; isMastered:boolean; toggleMastered:(id:string)=>void; className?:string }) {
  return <article className={`pattern-detail ${className}`}><div className="detail-top"><span className={`object-dot ${pattern.tone}`} /><div><div className="detail-intent-row"><small>{pattern.intent}</small><button className={isCommon ? "common-toggle active" : "common-toggle"} onClick={() => toggleCommon(pattern.id)}>★ 常用</button></div><h2>{pattern.pattern}</h2><button className="inline-listen" onClick={() => speakEnglish(pattern.pattern)}>◖)) Listen to pattern</button></div></div><div className="meaning">{pattern.meaning}</div><div className="detail-section"><div className="detail-label-row"><label>WORK EXAMPLE</label><button className="inline-listen" onClick={() => speakEnglish(pattern.example)}>◖)) Listen</button></div><p>{pattern.example}</p></div><div className="slot-row"><span>___</span><p>Replace the slots with the evidence and outcome in your own case.</p></div><div className="detail-section"><label>RELATED LEARNING</label><div className="related-chips"><span>reliable baseline</span><span>cause & effect</span><span>Evidence communication</span></div></div><div className="mastery-row"><span>MASTERY</span><b>{isMastered ? "已熟練" : pattern.mastery}</b></div><button className={isMastered ? "mastered-button active" : "mastered-button"} onClick={() => toggleMastered(pattern.id)}>{isMastered ? "✓ 已熟練，可獨立使用" : "標記為已熟練"}</button><button className="primary wide">Practice this pattern →</button></article>;
}

function Speaking({ taskIndex, setTaskIndex, timer, running, setRunning, reset, completedTaskIds, toggleCompleted }: { taskIndex:number; setTaskIndex:(v:number)=>void; timer: number; running: boolean; setRunning: (v: boolean) => void; reset: () => void; completedTaskIds:string[]; toggleCompleted:(id:string)=>void }) {
  const task = speakingTasks[taskIndex];
  const min = Math.floor(timer / 60).toString().padStart(2, "0");
  const sec = (timer % 60).toString().padStart(2, "0");
  return <div className="page"><div className="page-title"><div><div className="eyebrow">SPEAK TO LEARN</div><h1>Speaking practice</h1><p>Turn prepared language into independent professional communication.</p></div><span className="level-badge">LEVEL {task.level} · {task.target.toUpperCase()}</span></div>
    <label className="task-picker"><span>Choose a P0 speaking task</span><select value={taskIndex} onChange={e => setTaskIndex(Number(e.target.value))}>{speakingTasks.map((item,index) => <option key={item.id} value={index}>{String(index + 1).padStart(2,"0")} · {item.topic}</option>)}</select></label>
    <section className="speaking-stage"><div className="speaking-context"><span>{task.domain.toUpperCase()}</span><h2>{task.topic}</h2><p>{task.context}</p></div>
      <div className="speaking-grid"><div className="prep"><div className="eyebrow">KEY POINTS</div><ul>{task.keyPoints.map(point => <li key={point}>{point}</li>)}</ul><div className="eyebrow">DEFINITION OF DONE</div><button>{task.definitionOfDone}</button><div className="eyebrow speaking-related-label">RELATED OBJECTS</div><p className="speaking-related">{task.vocabularyIds.length} vocabulary · {task.patternIds.length} patterns · 1 grammar topic</p></div>
        <div className="recorder"><div className={`timer-ring ${running ? "running" : ""}`}><div><strong>{min}:{sec}</strong><span>{running ? "SPEAKING" : timer === 0 ? "COMPLETE" : "READY"}</span></div></div><button className="record-button" onClick={() => timer === 0 ? reset() : setRunning(!running)}><span>{timer === 0 ? "↻" : running ? "Ⅱ" : "▶"}</span>{timer === 0 ? "Try again" : running ? "Pause" : "Start 60 sec"}</button><small>Your recording stays on this device.</small></div></div>
      <div className="after-speaking"><div><span>1</span><p><strong>Speak without reading</strong><small>Use the prompts only when you get stuck.</small></p></div><div><span>2</span><p><strong>Notice the gap</strong><small>Write down missing words or patterns.</small></p></div><div><span>3</span><p><strong>Retry with one improvement</strong><small>Focus on clarity, not perfection.</small></p></div></div><button className={completedTaskIds.includes(task.id) ? "task-complete active" : "task-complete"} onClick={() => toggleCompleted(task.id)}>{completedTaskIds.includes(task.id) ? "✓ 已完成這項口說任務" : "完成練習後標記此任務"}</button>
    </section>
  </div>;
}

function Progress({ masteredIds, completedTaskIds, readinessChecks, toggleReadiness, navigate }: { masteredIds:string[]; completedTaskIds:string[]; readinessChecks:string[]; toggleReadiness:(id:string)=>void; navigate:(view:View)=>void }) {
  const vocabularyCount = masteredIds.filter(id => id.startsWith("v-")).length;
  const patternCount = masteredIds.filter(id => id.startsWith("p-")).length;
  const grammarCount = masteredIds.filter(id => id.startsWith("grammar:")).length;
  const gates = [
    { id:"vocabulary", label:"熟練 40 個核心單字", value:vocabularyCount, target:40, action:() => navigate("library") },
    { id:"patterns", label:"熟練 15 個可重用句型", value:patternCount, target:15, action:() => navigate("library") },
    { id:"grammar", label:"熟練 6 個工作導向文法", value:grammarCount, target:6, action:() => navigate("library") },
    { id:"speaking", label:"完成 8 個 Speaking Tasks", value:completedTaskIds.length, target:8, action:() => navigate("speaking") },
  ];
  const manualChecks = [
    { id:"three-minute", label:"不逐句讀稿，連續說明熟悉工作 3–5 分鐘" },
    { id:"follow-ups", label:"能回答至少 2 個事先準備的追問" },
  ];
  const allReady = gates.every(gate => gate.value >= gate.target) && manualChecks.every(item => readinessChecks.includes(item.id));
  const overall = Math.round(([...gates.map(g => Math.min(g.value / g.target, 1)), ...manualChecks.map(item => readinessChecks.includes(item.id) ? 1 : 0)].reduce((a,b) => a + b, 0) / 6) * 100);
  return <div className="page"><div className="page-title"><div><div className="eyebrow">P0 LEARNING PATH</div><h1>學習進度與晉級檢核</h1><p>用實際輸出能力判斷何時進入下一階段，而不是只計算瀏覽量。</p></div><div className="evidence-count"><b>{completedTaskIds.length}</b><span>speaking tasks</span></div></div>
    <div className="progress-summary"><Ring value={overall} label="P0 READY" /><div><div className="eyebrow">CURRENT STAGE</div><h2>{allReady ? "P0 已完成，可以進入 P1" : "P0 核心能力建立中"}</h2><p>{allReady ? "你已達成內容熟練與口說輸出的最低門檻。下一階段會練習跨情境說明、即時追問與專業討論。" : "先建立一組能獨立使用的核心語言，再透過 Speaking Tasks 證明自己能在工作情境輸出。"}</p><div className="mastery-scale"><span className="passed">選擇常用</span><span className={masteredIds.length ? "passed" : "current"}>標記熟練</span><span className={completedTaskIds.length ? "passed" : "current"}>口說輸出</span><span className={allReady ? "passed" : "current"}>P1 Ready</span></div></div></div>
    <section className="readiness-card"><div className="table-head"><div><div className="eyebrow">DEFINITION OF DONE</div><h3>P0 晉級條件</h3></div><span>{gates.filter(g => g.value >= g.target).length + manualChecks.filter(item => readinessChecks.includes(item.id)).length} / 6 完成</span></div><div className="gate-list">{gates.map(gate => <button key={gate.id} onClick={gate.action} className={gate.value >= gate.target ? "done" : ""}><span>{gate.value >= gate.target ? "✓" : "○"}</span><strong>{gate.label}</strong><em>{Math.min(gate.value, gate.target)} / {gate.target}</em><b>前往練習 →</b></button>)}{manualChecks.map(item => <button key={item.id} onClick={() => toggleReadiness(item.id)} className={readinessChecks.includes(item.id) ? "done" : ""}><span>{readinessChecks.includes(item.id) ? "✓" : "○"}</span><strong>{item.label}</strong><em>自我檢核</em><b>{readinessChecks.includes(item.id) ? "取消" : "確認完成"}</b></button>)}</div></section>
    <div className={allReady ? "next-stage ready" : "next-stage"}><div><div className="eyebrow">NEXT · P1</div><h3>Professional Product Communication</h3><p>比較方案、解釋證據與取捨，並處理未準備的追問。</p></div><button disabled={!allReady}>{allReady ? "進入下一階段 →" : `尚有 ${6 - gates.filter(g => g.value >= g.target).length - manualChecks.filter(item => readinessChecks.includes(item.id)).length} 項未完成`}</button></div>
    <div className="evidence-note"><span>◎</span><div><strong>熟練代表什麼？</strong><p>只有當你能不看答案，用該單字、句型或文法說出自己的工作案例時，才標記「已熟練」。所有進度只儲存在這個瀏覽器。</p></div></div>
  </div>;
}
