# Architecture Layers Decomposer

> Load khi QA chọn chiến lược Architecture Layers.
> Tối ưu cho: hệ thống thiên về backend nặng, rủi ro ở API, microservices, integration points.

## Bước 1 — Lập Bản nháp Phân rã Kiến trúc

Phân rã tính năng thành 3 nhóm layers kỹ thuật. Mọi cột "Rủi ro gắn liền" PHẢI được ánh xạ từ Risk Identification trong [MASTER CONTEXT].

| Module_ID | Tên Module / Component | Layer (UI/Logic/Data) | Trách nhiệm chính | Rủi ro gắn liền |
|---|---|---|---|---|
| MOD_UI_01 | [VD: Form Submit Payment] | Presentation (UI) | [Mô tả] | [Risk từ Master Context] |
| MOD_BIZ_01 | [VD: Payment Validation Service] | Business Logic | [Mô tả] | [Risk từ Master Context] |
| MOD_DAT_01 | [VD: Transaction DB Write] | Integration/Data | [Mô tả] | [Risk từ Master Context] |

**Layer definitions:**
- **Presentation (UI):** Form inputs, button states, validation messages, display logic
- **Business Logic:** Rules engine, calculations, state machine, permission checks, API orchestration
- **Integration/Data:** Database operations, third-party API calls, webhooks, caching, async jobs

> **[DỪNG LẠI — GATE 2b]:** Trình bày bản nháp. Chờ QA review và phê duyệt hoặc chỉnh sửa. KHÔNG đóng gói cho đến khi có xác nhận.

## Bước 2 — Đóng gói sau khi QA approve

Sau khi QA xác nhận "Chốt", đóng gói bảng đã chốt:

```markdown
### [DANH SÁCH MODULE]
[Bảng Module cuối cùng]
```

Sau đó tiếp tục với Module Risk Register trong SKILL.md chính.
