# Hybrid Decomposer

> Load khi QA chọn chiến lược Hybrid.
> Tối ưu cho: feature lớn/phức hợp có nhiều loại rủi ro đan xen (core business + CRUD + reporting).

## Bước 1 — Lập Bản nháp Phân rã Hỗn hợp

Chia tính năng thành 3 nhóm Functional Modules. Mọi cột "Rủi ro" PHẢI map từ [MASTER CONTEXT].

**BẮT BUỘC phân loại rõ 3 nhóm — không gộp chung:**

| Module_ID | Tên Module / Khối chức năng | Loại | Trách nhiệm chính | Rủi ro gắn liền |
|---|---|---|---|---|
| MOD_CORE_01 | [VD: Issue Credits to Client] | **Core Function** | [Core business value] | [Risk từ Master Context] |
| MOD_CORE_02 | [VD: Process Subscription Payment] | **Core Function** | [Core business value] | [Risk] |
| MOD_SUP_01 | [VD: Search & Filter Clients] | **Support Function** | [Helper cho core functions] | [Risk: performance] |
| MOD_SUP_02 | [VD: Permission Settings] | **Support Function** | [Config, access control] | [Risk: misconfiguration] |
| MOD_RPT_01 | [VD: Export Billing Report] | **Report/Export** | [Data output, analytics] | [Risk: data accuracy, PII] |

**3 nhóm Functional Modules:**
- **Core Function:** Luồng nghiệp vụ tạo ra business value trực tiếp (credit issuance, payment processing, session booking)
- **Support Function:** Tools phụ trợ (search, filter, config, settings, permissions, notifications)
- **Report/Export:** Đầu ra dữ liệu (reports, exports, logs, analytics dashboards)

*Note: Support và Report functions thường bị bỏ sót trong test planning — chú ý kỹ hai nhóm này.*

> **[DỪNG LẠI — GATE 2b]:** Trình bày bản nháp. Chờ QA verify đã bao quát toàn bộ, đặc biệt Support và Report modules. KHÔNG đóng gói khi chưa có xác nhận.

## Bước 2 — Đóng gói sau khi QA approve

```markdown
### [DANH SÁCH MODULE]
[Bảng Khối chức năng cuối cùng]
```

Sau đó tiếp tục với Module Risk Register. Note: Core modules thường HIGH risk; Report modules check data accuracy + PII.
