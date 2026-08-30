import { appendedGrammar, appendedPatterns, appendedVocabulary, relationships, skills, speakingTasks } from "../app/data/p0-library.ts";

const existingVocabularyTerms = [
  "active user","new user","session","engaged session","engagement rate","bounce rate","event","event parameter","key event","dimension","metric","source / medium","impression","click","click-through rate (CTR)","average position","search query","search appearance","indexing","crawl","sitemap","baseline","benchmark","trend","fluctuation","anomaly","outlier","data discrepancy","segment","cohort","funnel","drop-off rate","conversion rate","retention rate","hypothesis","control group","variant","sample size","statistical significance","correlation","causation","confounding variable",
];

const existingPatternTexts = [
  "We don’t have enough evidence to conclude that ___ caused ___.",
  "We considered ___, but decided to prioritize ___ because ___.",
  "Given ___, the most practical option was to ___.",
  "What evidence do we have that ___?",
];

const domains = ["Product / UX","Research","Data / Analytics","Experiment / Validation","Complex System / BPM","Design System","Engineering Collaboration","AI Product / Workflow","Professional Communication"];
const normalize = value => value.toLowerCase().replaceAll("’","'").replace(/\s+/g," ").trim();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const unique = (items, label) => {
  const seen = new Set();
  for (const item of items) {
    const key = normalize(item);
    assert(!seen.has(key), `Duplicate ${label}: ${item}`);
    seen.add(key);
  }
};

const allVocabularyTerms = [...existingVocabularyTerms, ...appendedVocabulary.map(v => v.term)];
const allPatternTexts = [...existingPatternTexts, ...appendedPatterns.map(p => p.pattern)];
assert(allVocabularyTerms.length >= 150 && allVocabularyTerms.length <= 200, `Vocabulary count out of P0 range: ${allVocabularyTerms.length}`);
assert(allPatternTexts.length >= 80 && allPatternTexts.length <= 100, `Pattern count out of P0 range: ${allPatternTexts.length}`);
assert(appendedGrammar.length + 4 >= 12, `Grammar count below P0: ${appendedGrammar.length + 4}`);
assert(speakingTasks.length >= 20, `Speaking task count below P0: ${speakingTasks.length}`);
unique(allVocabularyTerms,"vocabulary term");
unique(allPatternTexts,"sentence pattern");
unique(appendedVocabulary.map(v => v.id),"vocabulary ID");
unique(appendedPatterns.map(p => p.id),"pattern ID");
unique(speakingTasks.map(s => s.id),"speaking task ID");

for (const domain of domains) {
  assert(appendedVocabulary.some(v => v.domain === domain), `Missing vocabulary coverage: ${domain}`);
  assert(appendedPatterns.some(p => p.domain === domain), `Missing pattern coverage: ${domain}`);
  assert(speakingTasks.some(s => s.domain === domain), `Missing speaking coverage: ${domain}`);
}

const validIds = new Set([
  ...skills.map(s => s.id),
  ...appendedVocabulary.map(v => v.id),
  ...appendedPatterns.map(p => p.id),
  ...appendedGrammar.map(g => g.id),
  ...speakingTasks.map(s => s.id),
  ...Array.from({length:42},(_,i) => `v-existing-${String(i + 1).padStart(3,"0")}`),
  ...Array.from({length:4},(_,i) => `p-existing-${String(i + 1).padStart(3,"0")}`),
  ...Array.from({length:4},(_,i) => `g-existing-${String(i + 1).padStart(3,"0")}`),
]);
for (const relation of relationships) {
  assert(validIds.has(relation.from), `Relationship source does not exist: ${relation.from}`);
  assert(validIds.has(relation.to), `Relationship target does not exist: ${relation.to}`);
}

for (const item of appendedVocabulary) assert(item.term && item.zh && item.definition && item.category && item.skillId,"Incomplete vocabulary object");
for (const item of appendedPatterns) assert(item.intent && item.pattern && item.meaning && item.example && item.skillId,"Incomplete pattern object");
for (const item of speakingTasks) assert(item.keyPoints.length >= 3 && item.vocabularyIds.length && item.patternIds.length && item.definitionOfDone,"Incomplete speaking task");

console.log(JSON.stringify({
  vocabulary:allVocabularyTerms.length,
  patterns:allPatternTexts.length,
  grammar:appendedGrammar.length + 4,
  speakingTasks:speakingTasks.length,
  skills:skills.length,
  relationships:relationships.length,
  domains:domains.length,
  duplicateCandidates:0,
}, null, 2));
