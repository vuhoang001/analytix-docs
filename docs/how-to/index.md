---
title: Làm một việc cụ thể
last_update:
  date: "2026-11-04"
  author: vuhoang001
---

# Làm một việc cụ thể

Bạn đã cài xong và đang cần làm xong **một** việc. Trang này là bảng tra: tìm
dòng mô tả đúng việc bạn đang làm, rồi đi theo link.

Chưa cài gì thì bắt đầu ở [Bắt đầu nhanh](../tutorials/cai-dat-analytix.md). Muốn
đi hết một lượt từ database tới trang báo cáo thì đọc
[Từ database tới biểu đồ](../tutorials/tu-database-toi-bieu-do.md) — bài đó dạy,
các trang dưới đây chỉ làm.

## Tôi muốn…

### Dựng báo cáo

| Tôi muốn… | Trang |
|:---|:---|
| cho AnalytiX đọc được database của tôi | [Nối vào một database](./dung-bao-cao/noi-vao-mot-database.md) |
| khai "lấy dữ liệu từ đâu" để biểu đồ dùng | [Tạo dataset](./dung-bao-cao/tao-dataset.md) |
| **vẽ một biểu đồ** | [Tạo biểu đồ](./dung-bao-cao/tao-bieu-do.md) |
| hiện một con số to thay vì biểu đồ | [Tạo biểu đồ](./dung-bao-cao/tao-bieu-do.md) — phần Big Number |
| hiện bảng số liệu thô, không tính toán | [Tạo biểu đồ](./dung-bao-cao/tao-bieu-do.md) — phần Table |
| xếp nhiều biểu đồ lên một trang | [Xếp biểu đồ thành dashboard](./dung-bao-cao/xep-bieu-do-thanh-dashboard.md) |
| một ô lọc tác động lên cả trang | [Thêm bộ lọc dùng chung](./dung-bao-cao/them-bo-loc-dung-chung.md) |
| cho đồng nghiệp xem trang của tôi | [Đặt quyền và chia sẻ dashboard](./dung-bao-cao/dat-quyen-va-chia-se-dashboard.md) |
| tính toán trên cột lưu dạng chữ mà không ra số `0` | [Viết SQL an toàn với cột dạng chữ](./dung-bao-cao/viet-sql-an-toan.md) |
| một bố cục riêng, không theo biểu đồ có sẵn | [Dựng dashboard theo phong cách tuỳ chỉnh](./dung-bao-cao/dung-dashboard-html-trong-sql.md) |

### Nhúng vào hệ thống khác

| Tôi muốn… | Trang |
|:---|:---|
| **đưa dashboard lên một trang web khác** | [Nhúng bằng iframe đơn giản](./nhung-bao-cao/nhung-iframe-don-gian.md) |
| nhúng cho người xem **không có tài khoản**, phân quyền từng người | [Nhúng qua SDK cho đối tác ngoài](./nhung-bao-cao/nhung-qua-sdk.md) |
| tra tham số của thẻ `iframe` | [Tham số iframe](../reference/tham-so-iframe.md) |

### Dựng biểu đồ bằng trợ lý AI

| Tôi muốn… | Trang |
|:---|:---|
| mô tả bằng lời thay vì bấm chuột | [Bật dịch vụ MCP](./tro-ly-ai/bat-mcp.md) |
| mở dịch vụ MCP ra ngoài máy của tôi | [Đổi xác thực MCP sang JWT](./tro-ly-ai/mcp-doi-sang-jwt.md) |
| xem trợ lý gọi được những gì | [Công cụ MCP](../reference/mcp-cong-cu.md) |

### Cài đặt và vận hành

| Tôi muốn… | Trang |
|:---|:---|
| cài lên một máy có Docker | [Cài bằng Docker](./cai-dat-van-hanh/cai-dat-bang-docker.md) |
| cài mà không dùng Docker | [Cài thực trên máy](./cai-dat-van-hanh/cai-dat-tren-may.md) |
| cài lên máy **không có internet** | [Cài trên máy không có internet](./cai-dat-van-hanh/cai-tren-may-khong-co-mang.md) |
| nối vào PostgreSQL, MySQL, Trino… | [Thêm driver cho nguồn dữ liệu](./cai-dat-van-hanh/them-driver-du-lieu.md) |
| tạo bản đóng gói để giao cho người khác | [Đóng gói bản phát hành](./cai-dat-van-hanh/dong-goi-ban-phat-hanh.md) |

## Đang gặp lỗi

Có thông báo lỗi cụ thể thì tra thẳng, đừng đọc lại trang hướng dẫn:

| Lỗi ở đâu | Tra ở |
|:---|:---|
| lúc dựng báo cáo trên giao diện | [Lỗi theo bước](../reference/loi-theo-buoc.md) |
| lúc nhúng bằng SDK | [Mã lỗi khi nhúng qua SDK](../reference/ma-loi-sdk.md) |
| lúc cài — dòng bắt đầu bằng `[analytix] LỖI:` | mục *Lỗi hay gặp* của trang cài tương ứng |
