# Quality Gates & Finalization

> Luôn load khi qa_testcase_generator khởi động.
> Gate 5 inline checklist + Pre-finalization checklist + 9 Quality Patterns.

---

## Gate 5 — Inline (per AC, TRƯỚC khi sang AC tiếp theo)

Đây là chốt chặn quan trọng nhất. Không batch check ở cuối — check NGAY sau khi viết xong ACs.

```
[AC-ID] Gate 5:
✓/✗ Floor met — wrote [actual N], DR Floor = [N from adaptive_reading.md Q-Floor]
✓/✗ Design supplement items covered (Q10 findings) — hoặc "n/a"
✓/✗ API status codes covered (Q11) — hoặc "n/a"
✓/✗ All Condition Matrix branches covered — hoặc "n/a — no conditions"
✓/✗ Dependency Map CoveredBy filled for this AC's rows
✓/✗ RTM: AC marked ✓ Covered
Status: ✓ PASS | ✗ FIX FIRST: [describe what's missing]
```

**Nếu floor shortfall:** Fix ngay với full context của AC trong head. Đừng defer — shortfall phát hiện sau 50+ TCs rất khó fix với đúng context.

---

## Pre-finalization Checklist (run sau khi ALL modules hoàn tất)

### Context completeness
- [ ] Feature Purpose Statement, Business Flow List, Actor Map đều present
- [ ] Ambiguity List, Assumptions List, Interpretations đều produced
- [ ] AC Type Classification Matrix produced TRƯỚC Deep Reading

### Deep Reading completeness
- [ ] Mọi AC có DR block với appropriate Q depth (7Q/10Q/12Q theo risk)
- [ ] Mọi DR block có Gate5: [✓] passed
- [ ] Q-Floor: mọi AC có A/B/C breakdown, không phải estimate

### Coverage
- [ ] Row count per AC ≥ Q-Floor
- [ ] Mọi module với Risk ≥ MEDIUM có ≥1 SCEN TC
- [ ] Mọi Q10 design items có TC hoặc explicit exclusion note
- [ ] Mọi Q11 API status codes với distinct behavior có ≥1 TC
- [ ] RTM: zero "Uncovered" rows
- [ ] Dependency Map: zero empty CoveredBy rows (hoặc "No standalone case — reason")

### Row quality
- [ ] Mọi title starts "Verify" hoặc "Check that"
- [ ] Mọi step: 1 physical action, no "and"
- [ ] Test Data: concrete values hoặc DataID, không có bare placeholders khi source defines field
- [ ] Expected: observable, không có "works correctly" / "as per design"
- [ ] Note column: compact format với category + scenario type + AC ref

### Artifact completeness
- [ ] Capability Map: present cho ACs với ≥4 sub-bullets hoặc interactive controls
- [ ] Outcome Ledger: present cho multi-effect success paths
- [ ] Condition Matrix: present cho conditional ACs
- [ ] Variant Matrix: present cho repeated-row ACs
- [ ] Impact Sweep: present cho state-changing ACs
- [ ] Test Data Reference: present nếu có Shared/Stateful/Destructive/Boundary fixtures

---

## 9 Multi-run Quality Patterns

Scan sau khi viết TCs. Confirm không pattern nào xảy ra.

**Pattern 1 — Design image late discovery**
Symptom: TCs được viết cho AC, sau đó design image reveal 15 additional combinations.
Root cause: Phase 0 skipped hoặc incomplete.
Prevention: Gate 0 — mọi image đọc TRƯỚC khi xử lý spec text.
Recovery: Re-open AC DR, add Q10 findings, re-run Gate 5.

**Pattern 2 — Floor shortfall accumulation**
Symptom: Sau 200+ TCs, Gate 5 check báo 4 ACs below floor.
Root cause: Gate 5 treated như batch check ở cuối thay vì inline per-AC.
Prevention: Chạy Gate 5 NGAY sau mỗi AC, mark [✓] trước khi sang AC tiếp.
Recovery: Viết bổ sung với DR block của AC mở để có context đúng.

**Pattern 3 — "Same as AC X" under-expansion**
Symptom: AC13 says "notification behavior same as AC10" → AC13 chỉ có 3 TCs thay vì 12.
Root cause: Reuse reference treated as merge, không expand đủ effects.
Prevention: Khi Q8 references AC khác → mở AC đó's Q6 list và verify mọi effects đều covered.
Recovery: Add missing TCs, update CoveredBy trong Dependency Map.

**Pattern 4 — Sub-section AC headline collapse**
Symptom: AC với 2 sub-sections và 19 fields chỉ produce 1 TC.
Root cause: Đọc headline thay vì expand sub-sections trong Step 0.
Prevention: Step 0 structural expansion TRƯỚC Q1. Structural item count phải non-trivial cho complex ACs.
Recovery: Redo Step 0, recalculate Q-Floor, write missing TCs.

**Pattern 5 — Dependency Map rows unverified**
Symptom: 30-row Dependency Map, sau khi viết TCs có 8 rows vẫn empty CoveredBy.
Root cause: CoveredBy column không được track trong quá trình viết.
Prevention: Fill CoveredBy NGAY KHI viết TC cho dependency relationship đó.
Recovery: Với mỗi empty row: quyết định standalone TC cần không hoặc precondition note đủ.

**Pattern 6 — Changelog version drift**
Symptom: TCs assert behavior từ spec version cũ (VD: "Forfeited" thay vì "Voided").
Root cause: Changelog không được đọc trước khi catalog ACs.
Prevention: Đọc changelog TRƯỚC trong Phase 1. Note overriding version per modified AC.
Recovery: Search mọi TCs cho deprecated terminology, update expected results.

**Pattern 7 — Vague concurrency TCs**
Symptom: Race condition TC với Expected: "modal closes" — không assert data state.
Root cause: Concurrency TCs viết cuối cùng với reduced context.
Prevention: Mỗi concurrency TC Expected PHẢI assert: (1) UI state VÀ (2) data state.
Recovery: Add data-state assertion cho mọi concurrency TC.

**Pattern 8 — Missing business context**
Symptom: TCs technically correct per AC text nhưng không có SCEN TC cho critical flows.
Root cause: Phase 0.5 skipped. AI test ACs như isolated rules, không anchor vào business flows.
Prevention: Business Flow List với consequence-if-fail TRƯỚC Phase 1. Mọi HIGH/MEDIUM module có SCEN TC.
Recovery: Viết Business Flow List retrospectively. Viết SCEN TCs cho modules thiếu.

**Pattern 9 — Assumption silent propagation**
Symptom: AI assumed "admin" = Org Admin xuyên suốt, viết 20 TCs. Spec thực ra có 2 admin types.
Root cause: Step 0-pre skipped. Ambiguity không được surface. Assumption silently made.
Prevention: Ambiguity List + Explicit Assumptions TRƯỚC Deep Reading. Mọi assumption tagged trong Note column.
Recovery: Re-read Ambiguity List, identify TCs depend on incorrect assumption, rewrite/split affected TCs.

---

## When Gate Cannot Fully Pass

Nếu spec genuinely incomplete (không phải reading error):
1. Document gap trong Missing Information
2. Add affected cases vào Not-Testable-Yet Items với specific description
3. Mark gate: **conditionally passed** — gap vẫn phải visible và tracked
4. Add question vào Clarification Questions trong Final Summary

Conditional pass ≠ bypass. Pipeline có thể proceed nhưng gap phải được tracking.
