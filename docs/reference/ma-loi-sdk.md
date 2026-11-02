---
title: Mã lỗi khi nhúng qua SDK
sidebar_position: 7
---

# Mã lỗi khi nhúng qua SDK

Gặp sự cố khi nhúng bằng SDK + vé khách, đối chiếu bảng này trước.

| Thấy gì | Nghĩa là | Ai sửa |
|:----------------------------------------|:----------------------------------|:---------|
| `/embedded/<uuid>` trả **404** | UUID chưa đăng ký, hoặc đã bị gỡ | Phía quản trị AnalytiX |
| `/embedded/<uuid>` trả **403** | Có đăng ký, nhưng origin gọi tới không nằm trong danh sách tên miền được phép | Khai lại danh sách tên miền được phép |
| Khung hiện JSON `403 Forbidden` | Vé hợp lệ nhưng sai origin — lỗi hay gặp nhất là nhầm `localhost` với `127.0.0.1`, hai origin này **khác nhau hoàn toàn** với trình duyệt | Phía tích hợp (đối tác) |
| `400 The CSRF token is missing.` | Bỏ bước lấy CSRF khi xin vé | Phía tích hợp (đối tác) |
| `400 The CSRF session token is missing.` | Lấy CSRF bằng session khác với lúc gọi xin vé — ba lệnh xin vé phải dùng **chung một session** | Phía tích hợp (đối tác) |
| `400 EmbeddedDashboard not found.` | UUID không còn tồn tại | Cần đăng ký nhúng lại |
| `401 Not authorized` | Sai tài khoản hoặc mật khẩu của dịch vụ cấp vé | Phía tích hợp (đối tác) |
| Lỗi **CORS** trong console trình duyệt | Gọi thẳng sang AnalytiX từ trình duyệt thay vì gọi qua backend của chính mình | Phía tích hợp (đối tác) — xem [Vì sao nhúng cần vé khách](../explanation/vi-sao-nhung-can-ve-khach.md) |
| Khung trắng, không báo lỗi | SDK chưa gắn được; mở DevTools xem hàm xin vé (`fetchGuestToken`) trả về gì | Phía tích hợp (đối tác) |

:::tip
Mở thẳng `/embedded/<uuid>` bằng trình duyệt hay `curl` **không phải** phép
thử hợp lệ. Kết quả `200` chỉ là vỏ HTML rỗng — dashboard chỉ nạp sau khi
nhận vé qua `postMessage`, việc mà chỉ SDK làm được.
:::
