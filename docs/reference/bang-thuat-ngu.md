---
title: Bảng thuật ngữ
sidebar_position: 3
---

# Bảng thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| **Nguồn** (Source) | Nơi dữ liệu đến từ: một tệp hoặc một cơ sở dữ liệu |
| **Kết nối** (Connection) | Luồng chuyển dữ liệu từ nguồn vào kho |
| **Lần chạy** (Run) | Một lượt thực hiện kết nối nạp liệu |
| **Snapshot** | Chế độ nạp đọc lại toàn bộ và ghi đè |
| **CDC** | Chế độ nạp chỉ lấy phần thay đổi |
| **Namespace** | Nhóm chứa bảng trong kho, ví dụ `uploads` |
| **Lớp** (Layer) | Mức độ xử lý dữ liệu: `raw` (thô) → `bronze` (làm sạch bước đầu) → `silver` (tính toán/gộp) → `gold` (kết quả cuối, sẵn sàng báo cáo). Xem [Kiến trúc dữ liệu](../explanation/analytix-la-gi.md) |
| **Lake** | Kho dữ liệu tập trung |
| **Object** | Một đơn vị lưu trữ trong kho — một tệp hoặc một bảng |
| **Trình tạo** (Studio) | Công cụ kéo-thả để dựng quy trình xử lý dữ liệu |
| **Luồng xử lí** (Pipeline) | Một quy trình xử lý dữ liệu đã được dựng và/hoặc triển khai |
| **DAG** | Sơ đồ các bước xử lý theo thứ tự, không quay vòng — tên kỹ thuật của một luồng xử lý đã triển khai |
| **Biên dịch** (Compile) | Bước kiểm tra một luồng xử lý có hợp lệ trước khi triển khai |
| **Triển khai** (Deploy) | Bước đưa một luồng xử lý vào chạy thật, theo lịch |
| **Máy điều khiển** (Control node) | Máy chủ chính điều phối toàn hệ thống |
| **Máy chạy việc** (Worker node) | Máy chủ thực thi các tác vụ của luồng xử lý |
| **Dataset** | Khai báo: lấy dữ liệu từ đâu để dựng biểu đồ |
| **Dataset ảo** (Virtual) | Dataset dựa trên câu truy vấn SQL, không sao chép dữ liệu — tự cập nhật khi dữ liệu gốc đổi |
| **Chart** | Một biểu đồ |
| **Dashboard** | Một trang gồm nhiều biểu đồ |
| **Published / Draft** | Trạng thái dashboard: đã xuất bản (ai cũng xem được) / bản nháp (chỉ người tạo thấy) |
| **SQL Lab** | Công cụ viết và chạy truy vấn SQL |
| **Embed / Nhúng** | Đặt dashboard vào trang web khác |
| **iframe** | Thẻ HTML dùng để nhúng một trang vào trang khác |
| **UUID (nhúng)** | Mã định danh duy nhất của dashboard khi bật chế độ nhúng |
| **Vé khách** (Guest token) | Chứng từ có hạn, cấp quyền xem một dashboard đã nhúng mà không cần tài khoản AnalytiX. Xem [Vì sao nhúng cần vé khách](../explanation/vi-sao-nhung-can-ve-khach.md) |
| **Quản lý báo cáo** | Tính năng ghim một bảng/dashboard thành lối tắt có tên và icon riêng trên menu |
| **Preflight** | Bước kiểm tra chỉ đọc trước khi cài đặt — không thay đổi gì trên máy |
| **Answers file** (`answers.json`) | Tệp khai báo cấu hình cài đặt: chế độ single/multi-node, danh sách máy, thông tin lưu trữ |
| **MCP** (Model Context Protocol) | Giao thức để trợ lý AI gọi được công cụ của một hệ thống khác. Trong AnalytiX, nó chạy như một dịch vụ riêng cạnh AnalytiX. Xem [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md) |
| **Công cụ** (Tool, trong MCP) | Một thao tác mà trợ lý AI gọi được — ví dụ `generate_chart` tạo biểu đồ. Xem [Công cụ MCP](./mcp-cong-cu.md) |
| **Chế độ dev** (MCP) | Cấu hình MCP **không kiểm token**, chạy dưới một tài khoản cố định. Chỉ an toàn khi dịch vụ nghe trên `127.0.0.1` |
| **JWT** | Chứng từ có chữ ký, dùng xác thực MCP khi mở ra ngoài localhost. Xem [Đổi xác thực MCP sang JWT](../how-to/mcp-doi-sang-jwt.md) |
| **DML** | Nhóm câu lệnh SQL thay đổi dữ liệu (`INSERT`, `UPDATE`, `DELETE`, `CREATE`…). Tắt quyền DML trên khai báo kết nối là chốt chặn ghi |
| **RLS** (Row Level Security) | Luật lọc dữ liệu theo dòng, gắn với vai trò người dùng. MCP **không** đi vòng qua luật này |
