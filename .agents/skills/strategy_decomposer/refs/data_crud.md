# Data CRUD Decomposer

> Load khi QA chọn chiến lược Data CRUD.
> Tối ưu cho: CMS, Admin Portal, state management, permission/RBAC — rủi ro toàn vẹn dữ liệu.

## Bước 1 — Lập Bản nháp Phân rã CRUD

Phân tích tính năng theo các thực thể dữ liệu bị tác động. Mọi cột "Rủi ro" PHẢI map từ [MASTER CONTEXT].

| Module_ID | Tên Module (Hành động) | Entity | Mức độ ảnh hưởng | Rủi ro gắn liền |
|---|---|---|---|---|
| MOD_C_01 | [VD: Create subscription] | Subscription | **Create** | [Risk: duplicate record, wrong plan assigned] |
| MOD_R_01 | [VD: View billing history] | Invoice | **Read** | [Risk: wrong data shown, PII exposure] |
| MOD_U_01 | [VD: Update plan] | Subscription | **Update** | [Risk: wrong proration, state corruption] |
| MOD_D_01 | [VD: Cancel subscription] | Subscription | **Soft Delete** | [Risk: credits not revoked on cancel] |

**Mức độ ảnh hưởng (phân loại rõ ràng):**
- **Read:** Chỉ xem — rủi ro thấp hơn nhưng cần check data accuracy và PII exposure
- **Create:** Tạo mới — rủi ro duplicate, wrong defaults, constraint violations
- **Update:** Sửa đổi — rủi ro state corruption, missing cascade effects
- **Soft Delete:** Xóa mềm (mark deleted, giữ data) — kiểm tra recover và historical data
- **Hard Delete:** Xóa cứng (data mất vĩnh viễn) — PHẢI phân biệt với Soft Delete

> **[DỪNG LẠI — GATE 2b]:** Trình bày bản nháp. Chờ QA verify đúng entity và mức độ ảnh hưởng. KHÔNG đóng gói khi chưa có xác nhận.

## Bước 2 — Đóng gói sau khi QA approve

```markdown
### [DANH SÁCH MODULE]
[Bảng phân rã CRUD cuối cùng]
```

Sau đó tiếp tục với Module Risk Register. Note: Update + Delete modules → thường Overall Risk cao hơn.
