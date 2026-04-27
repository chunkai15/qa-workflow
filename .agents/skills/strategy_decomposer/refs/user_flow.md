# User Flow Decomposer

> Load khi QA chọn chiến lược User Flow.
> Tối ưu cho: luồng tuần tự dài, onboarding, checkout, booking — rủi ro gãy luồng (blocker).

## Bước 1 — Lập Bản nháp Phân rã Luồng

Cắt nhỏ tính năng thành các bước thực hiện tuần tự. Mọi cột "Rủi ro" PHẢI map từ [MASTER CONTEXT].

| Module_ID | Tên Bước / Hành động | Loại Bước | Mục tiêu | Rủi ro & Tác động |
|---|---|---|---|---|
| STEP_01 | [VD: Khởi tạo session] | Pre-condition (Entry) | [Load thông tin, tạo state] | [Risk] → **Block luồng** |
| STEP_02 | [VD: Điền thông tin payment] | Main Action | [Thu thập input hợp lệ] | [Risk] → **Lỗi UI only** |
| STEP_03 | [VD: Xác nhận thanh toán] | Main Action | [Process payment] | [Risk] → **Block luồng** |
| STEP_04 | [VD: Hiển thị confirmation] | Post-condition (Result) | [Lưu DB, hiển thị receipt] | [Risk] → **Lỗi UI only** |

**Loại bước:**
- **Pre-condition (Entry):** Setup state, authentication, load data — phải hoàn thành để vào luồng
- **Main Action:** Core user interactions — nếu fail có thể block hoặc chỉ gây lỗi UI
- **Post-condition (Result):** After-effects — confirmation, notification, state update

**Phân loại tác động (BẮT BUỘC cho mỗi bước):**
- **Block luồng:** Fail step này → user không thể tiếp tục → Priority HIGH
- **Lỗi UI only:** Fail step này → gây khó chịu nhưng user vẫn tiếp tục được → Priority MEDIUM/LOW

> **[DỪNG LẠI — GATE 2b]:** Trình bày bản nháp. Chờ QA review, đặc biệt mức độ "Block luồng". KHÔNG đóng gói cho đến khi có xác nhận.

## Bước 2 — Đóng gói sau khi QA approve

```markdown
### [DANH SÁCH MODULE]
[Bảng Luồng các bước cuối cùng]
```

Sau đó tiếp tục với Module Risk Register trong SKILL.md chính. Note: Block-luồng steps → Overall Risk cao hơn.
