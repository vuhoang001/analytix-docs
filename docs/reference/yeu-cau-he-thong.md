---
title: Yêu cầu hệ thống
sidebar_position: 2
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Yêu cầu hệ thống

Những gì máy đích phải có để cài được AnalytiX.

## Bắt buộc

| | Cài thực trên máy | Docker |
|:---|:---|:---|
| **Python** | **3.10, 3.11 hoặc 3.12** — bộ cài từ chối bản khác | không cần |
| Tạo venv | `python3-venv` (Debian/Ubuntu) | không cần |
| Docker | không cần | có |
| Shell | `bash` + coreutils, `sed`, `awk`, `install` | không cần |
| **Mạng ra PyPI** | **có** | **có, lúc dựng ảnh** |
| Quyền `root` | **không cần** | cần quyền chạy Docker |
| Đĩa trống | ~2 GB (venv + gói) | ~1,6 GB cho ảnh |

:::danger Bắt buộc có mạng ra PyPI
Bản đóng gói mang theo **danh sách** 156 gói đã ghim, **không** mang theo chính
các gói đó. Máy không ra được PyPI thì cả hai đường cài đều dừng giữa đường.

Môi trường không có mạng thì phải dựng kho gói nội bộ trước — xem
[Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md), mục cuối.
:::

Bộ pin được **chứng minh trên 3.10 và 3.12**. 3.11 được bộ cài cho qua nhưng
không nằm trong mốc đã kiểm.

## Không cần

Danh sách này cũng quan trọng không kém — nhiều người chuẩn bị thừa:

| Không cần | Vì sao |
|:---|:---|
| PostgreSQL / MySQL cho metadata | Dùng SQLite, tạo tại chỗ |
| Redis | Mặc định không đệm gì |
| Tiến trình chạy việc nền / hàng đợi | Bộ cài không dựng |
| Node.js / npm | Chỉ cần để *build* wheel, không cần để cài |
| Trình biên dịch, header `-dev` | Mọi gói đã ghim đều cài từ bản biên dịch sẵn trên 3.12 |
| nginx / chứng chỉ TLS | Bộ cài không dựng — nhưng **cần** nếu dùng thật |
| `sudo` | Bản cài tay nằm hoàn toàn trong thư mục người dùng |

Những thứ ở hai dòng cuối không cần để *cài*, nhưng cần để *dùng thật* — xem
[Vì sao bản cài chưa sẵn sàng cho môi trường thật](../explanation/chua-san-sang-cho-production.md).

## Nguồn dữ liệu query được ngay

| Nguồn | Trạng thái |
|:---|:---|
| SQLite (tệp `.db`) | ✅ dùng được ngay |
| Shillelagh (`shillelagh://`) | ⚠️ bản rút gọn |
| PostgreSQL, MySQL, Trino, ClickHouse, SQL Server, Oracle, DuckDB, BigQuery, Snowflake, … | ❌ phải cài driver |

:::danger Chỉ SQLite có sẵn
Bộ 156 gói đã ghim **không chứa driver database nào** ngoài SQLite. Đây là điều
người cài sẽ đụng ngay sau khi đăng nhập lần đầu.

[Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
:::

## Cổng

| Cổng | Dùng cho | Đổi bằng |
|:---|:---|:---|
| `8088` | Web AnalytiX | `ANALYTIX_PORT`, hoặc ánh xạ Docker |
| `5008` | Dịch vụ MCP, **nếu** bạn bật | `MCP_SERVICE_PORT` |

Container: giữ cổng bên trong là `8088` và chỉ đổi phần ánh xạ — healthcheck
ghim cứng `8088`.

## Hệ điều hành

Bộ cài tay là script `bash`, chạy trên Linux và macOS. Đã kiểm trên
**Ubuntu 22.04**. Ảnh container dựa trên `python:3.12-slim` (Debian).

Windows: dùng đường Docker, hoặc WSL2.

## Dung lượng theo thời gian

Thứ lớn dần là `superset.db` — AnalytiX ghi nhật ký truy vấn và trạng thái bộ lọc
vào đó liên tục. Trên một bản dùng nhiều, bảng nhật ký có thể chiếm phần lớn tệp.

Chưa có mốc đo cho bản cài độc lập. Nên **theo dõi kích thước `superset.db`** và
dọn bảng nhật ký khi cần.

## Liên quan

- [Cài thực trên máy](../how-to/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-bang-docker.md)
- [Biến môi trường](./bien-moi-truong.md)
- [Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
