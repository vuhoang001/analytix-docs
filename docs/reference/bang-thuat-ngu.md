---
title: Bảng thuật ngữ
sidebar_position: 3
last_update:
  date: "2026-11-04"
  author: vuhoang001
---

# Bảng thuật ngữ

Thuật ngữ gặp trong giao diện AnalytiX và trong tài liệu này.

## Trong giao diện

| Thuật ngữ | Giải thích |
|---|---|
| **Kết nối** (Database connection) | Khai báo một database để AnalytiX đọc: địa chỉ, tài khoản, quyền |
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
| **MCP** (Model Context Protocol) | Giao thức để trợ lý AI gọi được công cụ của một hệ thống khác. Trong AnalytiX, nó chạy như một dịch vụ riêng cạnh AnalytiX. Xem [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md) |
| **Công cụ** (Tool, trong MCP) | Một thao tác mà trợ lý AI gọi được — ví dụ `generate_chart` tạo biểu đồ. Xem [Công cụ MCP](./mcp-cong-cu.md) |
| **Chế độ dev** (MCP) | Cấu hình MCP **không kiểm token**, chạy dưới một tài khoản cố định. Chỉ an toàn khi dịch vụ nghe trên `127.0.0.1` |
| **JWT** | Chứng từ có chữ ký, dùng xác thực MCP khi mở ra ngoài localhost. Xem [Đổi xác thực MCP sang JWT](../how-to/mcp/mcp-doi-sang-jwt.md) |
| **DML** | Nhóm câu lệnh SQL thay đổi dữ liệu (`INSERT`, `UPDATE`, `DELETE`, `CREATE`…). Tắt quyền DML trên khai báo kết nối là chốt chặn ghi |
| **RLS** (Row Level Security) | Luật lọc dữ liệu theo dòng, gắn với vai trò người dùng. MCP **không** đi vòng qua luật này |

## Trong bộ cài

| Thuật ngữ | Giải thích |
|---|---|
| **Bộ cài** (bundle) | Thư mục `analytix-<bản>/` giải nén từ bản đóng gói. Đủ 11 mục: wheel, `requirements/`, `superset-core/`, `workspace_x_theme.py`, `cai.sh`, `go-cai.sh`, `cai-tren-may.sh`, `entrypoint.sh`, `Dockerfile`, `PHIEN-BAN`, `README.md` |
| **Đường cài** | Một trong ba cách `./cai.sh` dựng bản chạy: `--docker` dựng ảnh từ wheel, `--may` cài vào một môi trường ảo Python, `--offline` nạp ảnh đã lưu sẵn. Không có flag thì script tự chọn theo thứ tự offline → docker → máy |
| **Bản offline** | Thư mục phát hành `analytix-<bản>-khong-can-mang/`, chỉ gồm ảnh đã lưu `analytix-<bản>-anh.tar.gz`, `cai.sh`, `go-cai.sh`, `PHIEN-BAN`, `SHA256SUMS`, `README.md`. Máy đích chỉ cần Docker |
| **PHIEN-BAN** | Tệp trong bộ cài giữ hai số: `ANALYTIX_VERSION` (phiên bản sản phẩm, ví dụ `1.0`) và `FOXAI_VERSION` (phiên bản kỹ thuật của wheel). `cai.sh` đọc nó để suy ra thẻ tag của ảnh |
| **Ảnh** (image) | Ảnh Docker `analytix:<bản>`, dựng bởi `--docker` hoặc nạp bởi `--offline` |
| **Container** | Tiến trình chạy từ ảnh đó, mặc định tên `analytix` — đổi bằng `ANALYTIX_NAME` |
| **Volume** | Vùng lưu dữ liệu của Docker, mặc định `analytix-data`, gắn vào `/app/analytix` trong container. `go-cai.sh` chỉ xoá nó khi có `--ca-du-lieu` |
| **Môi trường ảo** (venv) | Thư mục `~/analytix/venv` của đường `--may` — cả bản cài nằm trong thư mục người dùng, không cần `sudo` |
| **Bộ pin** (pinned set) | 156 gói ghim sẵn trong `requirements/base.txt`. Cài danh sách này trước, rồi mới cài wheel với `--no-deps` |
