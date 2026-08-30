# Product Design English System — P0 Core Library Specification

Status: Implemented baseline  
Purpose: Define minimum professional communication coverage for the P0 Library.

## 1. P0 outcome

Enable a Product Designer to explain familiar work clearly and professionally, including the problem, evidence, assumptions, decision, alternatives, trade-offs, constraints, validation, outcome, and reflection.

P0 prioritizes language that is clear, professional, natural, reusable, and connected to real work. It excludes test-oriented, academic, and low-context vocabulary.

## 2. Minimum coverage

| Object | P0 requirement | Implemented target |
|---|---:|---:|
| Core Vocabulary | 150–200 | 186 |
| Sentence Patterns | 80–100 | 100 |
| Grammar Topics | 12 | 12 |
| Speaking Tasks | 20 | 24 |
| Skills | Related across all object types | 15 |

P0 is a minimum coverage specification, not a Library allowlist. Existing and future valid objects may exceed these counts.

## 3. Required domains

1. Product / UX
2. Research
3. Data / Analytics
4. Experiment / Validation
5. Complex System / BPM
6. Design System
7. Engineering Collaboration
8. AI Product / Workflow
9. Professional Communication

Each domain requires vocabulary, reusable patterns, at least one speaking application, and a skill relationship.

## 4. Vocabulary coverage model

Vocabulary favors reusable professional chunks. Each object includes:

- Stable ID
- English term
- Chinese meaning
- Plain professional definition
- Domain and category
- Source status (`existing` or `p0_append`)
- Related skill ID

Existing GA4, Search Console, and Data Analysis terms remain in their original source grouping and map into the Data / Analytics domain.

## 5. Sentence pattern intent model

Patterns cover these communication intents:

- Describe a problem or current behavior
- Explain context and scope
- Present evidence and research findings
- State or test a hypothesis
- Explain a decision and rationale
- Compare alternatives and trade-offs
- Explain technical or operational constraints
- Express uncertainty and limitations
- Challenge assumptions and disagree professionally
- Ask for clarification
- Prioritize and negotiate scope
- Collaborate with engineering
- Summarize decisions and next steps
- Present outcomes, failures, and learning
- Discuss AI behavior and human oversight

## 6. Work-oriented grammar topics

1. Present simple for current product behavior
2. Past simple for completed project decisions
3. Present perfect for accumulated observations
4. Conditionals for hypotheses and scenarios
5. Passive voice for system behavior and process
6. Hedging for uncertainty
7. Comparative structures for solution comparison
8. Cause-and-effect structures
9. Modal verbs for recommendations and obligation
10. Concession and contrast for constraints
11. Relative clauses for precise definitions
12. Sequencing and signposting for structured explanation

## 7. Speaking task requirements

The twenty P0 tasks span 30–60 seconds, 1–3 minutes, 3–5 minutes, and introductory interactive discussion. Every task references:

- One domain and primary skill
- Required vocabulary IDs
- Useful pattern IDs
- One grammar topic
- Key points and definition of done

## 8. Relationship rules

Relationships are machine-readable and validated:

- Vocabulary → Skill
- Pattern → Skill
- Grammar → Skill
- Speaking Task → Skill
- Speaking Task → Vocabulary
- Speaking Task → Pattern
- Speaking Task → Grammar
- Pattern → Vocabulary where a core term is required by the example

The UI may show only a subset of relationships, but the data layer remains the source of truth.

## 9. Existing Library gap analysis

Baseline inspected before P0 append:

| Area | Existing | Gap to minimum | Action |
|---|---:|---:|---|
| Vocabulary | 42 | 108 | Append domain coverage; preserve all 42 |
| Sentence Patterns | 4 | 76 | Append reusable intent coverage; preserve mastery |
| Grammar Topics | 4 | 8 | Append missing work-oriented topics |
| Speaking Tasks | 1 | 19 | Append cross-domain tasks |
| Relationships | UI-only examples | Structured layer missing | Add validated relationship records |

Notable coverage gaps were Product / UX, Research, Complex System / BPM, Design System, Engineering Collaboration, AI Product / Workflow, and Professional Communication. Existing Data / Analytics coverage was retained and extended rather than rebuilt.

## 10. Definition of done

P0 is complete when count ranges and domain coverage pass automated validation, existing protected content remains present, the production build succeeds, and the changelog records additions and duplicate candidates. Counts may exceed a stated minimum when the additional content remains core, reusable, and validated.
