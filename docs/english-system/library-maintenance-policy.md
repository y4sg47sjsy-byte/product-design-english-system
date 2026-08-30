# Product Design English System — Library Maintenance Policy

Status: Active  
Owner: Product Design English System  
Applies to: Vocabulary, Sentence Patterns, Grammar Topics, Speaking Tasks, Skills, Examples, Mastery, Progress, and Relationships

## 1. Core policy

The Library is maintained with an **append-first** approach. New specifications define minimum coverage, not an allowlist of permitted content.

- Never rebuild the Library by replacing existing content wholesale.
- Preserve user-authored vocabulary, patterns, examples, progress, mastery, and relationships.
- Content absent from a newer specification remains valid unless explicitly reviewed.
- Deletion always requires owner approval.
- Prefer a small, reusable professional expression over several low-value synonyms.

## 2. Change workflow

Before adding content:

1. Search normalized English text, aliases, and close semantic matches.
2. Check whether an existing object can be extended with a context, example, or relationship.
3. Add a new object only when it represents a distinct reusable concept or communication intent.
4. Assign a stable ID, domain, category or intent, source status, and skill relationship.
5. Run Library validation and record the change in the changelog.

## 3. Duplicate handling

Duplicates are not deleted immediately.

- `merge_candidate`: two objects may represent the same learning object; choose a canonical object after review.
- `deprecated`: keep the old object and its history, but direct new relationships to the canonical object.
- `alias`: retain a useful alternate label that resolves to the canonical object.
- `distinct`: keep both when professional meaning or communication intent differs.

Normalization for duplicate checks is case-insensitive and ignores surrounding whitespace and typographic apostrophe differences. Similar wording alone is not sufficient for automatic merging.

## 4. Required object quality

### Vocabulary

Must include a stable ID, term, Chinese meaning, clear English definition, domain, category, and related skill. Prefer professional chunks such as `technical constraint` or `decision rationale` over isolated generic words.

### Sentence pattern

Must include intent, reusable pattern, Chinese meaning, a Product Design work example, domain, mastery state, and related skill. Slots use `___` consistently.

### Grammar topic

Must be organized by professional communication use, not textbook chapter sequence. Include a concise explanation, Product Design example, related pattern IDs, and related skill.

### Speaking task

Must include a realistic context, difficulty, target duration, key points, required or useful learning objects, target skill, and definition of done.

## 5. Preservation and migration

- Stable IDs do not change after publication.
- Moving content into a new file or schema is allowed only if the original meaning and user state remain intact.
- Mastery and progress fields are never reset during content migrations.
- Relationship changes are additive unless a relationship is proven incorrect.
- Schema migrations must provide defaults for older objects rather than dropping them.

## 6. Validation gates

Every P0 change must verify:

- Minimum object counts
- Unique stable IDs
- No exact duplicate normalized terms or patterns
- All required fields are populated
- All relationship targets exist
- All nine P0 domains have vocabulary and pattern coverage
- Exactly twelve or more work-oriented grammar topics
- Twenty or more speaking tasks
- Existing protected seed objects remain present

## 7. Deletion protocol

No content deletion is authorized by this policy. A deletion proposal must list:

- Object ID and current relationships
- Reason deletion is preferable to aliasing or deprecation
- Impact on examples, progress, mastery, and practice history
- Migration or recovery plan

Deletion proceeds only after explicit owner approval.
