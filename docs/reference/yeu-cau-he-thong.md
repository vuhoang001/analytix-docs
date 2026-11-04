---
title: Yêu cầu hệ thống
sidebar_position: 2
last_update:
  date: "2026-11-04"
  author: vuhoang001
---

# Yêu cầu hệ thống

Những gì máy đích phải có để cài được AnalytiX.

## Ba kiểu bản phát hành

Yêu cầu phụ thuộc vào **kiểu bản phát hành người cài đang cầm**, không chỉ vào
máy. Tên thư mục cho biết đang cầm kiểu nào.

| Kiểu | Thư mục | `./cai.sh` không flag đi đường nào |
|:---|:---|:---|
| Đầy đủ | `analytix-<bản>-day-du/` | `--may`, bằng cây Python đi kèm bộ cài |
| Thường | `analytix-<bản>/` | `--docker` nếu máy có Docker, không thì `--may` |
| Offline | `analytix-<bản>-khong-can-mang/` | `--offline` |

Thiếu thứ cần cho mọi đường thì `./cai.sh` dừng và in từng đường kèm lý do không
đi được.

## Bắt buộc

| | Đầy đủ | Thường — trên máy | Thường — Docker | Offline |
|:---|:---|:---|:---|:---|
| **Python trên máy** | **không cần** | **3.10, 3.11 hoặc 3.12** — bộ cài từ chối bản khác | không cần | không cần |
| Tạo venv | không cần — cây Python đi kèm đã mang sẵn `venv` | `python3-venv` (Debian/Ubuntu) | không cần | không cần |
| Docker | không cần | không cần | có | có |
| Shell | `bash` + coreutils, `sed`, `awk`, `install` | `bash` + coreutils, `sed`, `awk`, `install` | không cần | không cần |
| **Mạng ra PyPI** | **không cần** | **có** | **có, lúc dựng ảnh** | **không cần** |
| Quyền `root` | **không cần** | **không cần** | cần quyền chạy Docker | cần quyền chạy Docker |
| Kiến trúc CPU | **phải khớp máy đóng gói** | bất kỳ | bất kỳ | phải khớp máy dựng ảnh (hiện là x86_64) |
| Đĩa trống | ~274 MB tarball, ~354 MB sau giải nén, cộng ~2 GB cho bản cài — trong đó 113 MB là cây Python chép vào `$ANALYTIX_HOME` | ~105 MB tarball + ~2 GB (venv + gói) | ~1,6 GB cho ảnh | ~433 MB cho tệp + ~1,6 GB sau khi nạp |

Bản đầy đủ mang sẵn Python 3.12.16 và cả 158 wheel, nên nó là kiểu duy nhất cài
được vào một máy **vừa không có Python vừa không có Docker vừa không có mạng**.

Bản offline đã được kiểm bằng `docker run --network none`: container vẫn
`healthy`.

Bộ pin được **chứng minh trên 3.10 và 3.12**. 3.11 được bộ cài cho qua nhưng
không nằm trong mốc đã kiểm. Bản đầy đủ chỉ chạy trên 3.12.16 — nó không dùng
Python nào khác.

:::danger[Bản thường bắt buộc có mạng ra PyPI]
Bộ cài thường mang theo **danh sách** 156 gói đã ghim, **không** mang theo chính
các gói đó. Máy không ra được PyPI thì cả `--may` lẫn `--docker` đều dừng giữa
đường.

Máy đích không có mạng thì chọn theo chỗ đó có Docker hay không:

- **Không có Docker** → bản đầy đủ. Nó mang luôn Python và 158 wheel, pip cài với
  `--no-index` nên không bao giờ chạm PyPI.
- **Có Docker** → bản offline, một ảnh đã dựng sẵn khoảng 433 MB. Thư mục đó mang
  chính `./cai.sh`; thấy tệp ảnh bên cạnh thì nó tự đi đường `--offline`, tức là
  `docker load` rồi chạy container.

Xem [Cài trên máy không có internet](../how-to/cai-tren-may-khong-co-mang.md).
:::

## Giới hạn của bản đầy đủ

**Bản đầy đủ khoá vào kiến trúc CPU của máy đóng gói.** Cây Python đi kèm là một
bản dựng sẵn cho đúng một kiến trúc, và các wheel nhị phân trong `kho-banh/`
cũng vậy. Đóng gói trên `x86_64` thì chỉ cài được lên `x86_64`.

`bo-cai/PYTHON-GHIM` ghim mã băm cho cả `x86_64` và `aarch64`, nên muốn có bản
cho máy arm thì đóng gói lại trên một máy arm. Không có cách đóng gói chéo kiến
trúc.

## Mạng

Mạng chỉ cần lúc cài, **không cần lúc chạy**. Cài xong thì AnalytiX **không gọi
ra ngoài internet**. Giao diện gốc của Superset nhúng một pixel đo đạc gửi về
`apachesuperset.gateway.scarf.sh` mỗi lần tải trang; bản này chặn nó bằng
Content-Security-Policy, nên request không rời khỏi máy. Kiểm được bằng header:

```bash
curl -sD - -o /dev/null http://127.0.0.1:8088/login/ | grep -i img-src
```

Không thấy chữ `scarf` nào là đúng. Console trình duyệt in một dòng vi phạm CSP
mỗi lần tải trang — đó là dấu hiệu chặn thành công, không phải lỗi.

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
| SQLite (tệp `.db`) | ✅ dùng được ngay — nhờ bản này tắt một chốt, xem Ghi chú |
| Shillelagh (`shillelagh://`) | ⚠️ bản rút gọn |
| PostgreSQL, MySQL, Trino, ClickHouse, SQL Server, Oracle, DuckDB, BigQuery, Snowflake, … | ❌ phải cài driver |

:::danger[Chỉ SQLite có sẵn]
Bộ 156 gói đã ghim **không chứa driver database nào** ngoài SQLite. Đây là điều
người cài sẽ đụng ngay sau khi đăng nhập lần đầu.

[Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
:::

:::danger[Vì sao SQLite dùng được: một chốt đã bị tắt]
Superset gốc đặt `PREVENT_UNSAFE_DB_CONNECTIONS = True`, nên một URI `sqlite://`
bị từ chối với *"cannot be used as a data source for security reasons"*.

Bản này tắt nó trong `theme/workspace_x_theme.py`. Không tắt thì sản phẩm **không
nối được nguồn nào**: không driver nào khác, mà SQLite thì bị chặn.

**Chốt đó chặn cái gì:** URI SQLite là một đường dẫn trên đĩa máy chủ, nên người
tạo được kết nối database có thể trỏ SQL Lab vào bất kỳ tệp nào tiến trình đọc
được. Tạo kết nối là quyền quản trị, nên phạm vi là *một quản trị viên đọc tệp
dưới tài khoản chạy AnalytiX* — không phải người đọc ẩn danh.

**Cài driver thật xong thì bật lại:** xoá dòng đó khỏi theme, khi SQLite không
còn là đường vào duy nhất.
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

Bản đầy đủ là ngoại lệ: **chỉ Linux**. Cây Python đi kèm là bản
`<kiến-trúc>-unknown-linux-gnu` của python-build-standalone, không chạy trên
macOS. Trên macOS thì dùng bản thường hoặc đường Docker.

Windows: dùng đường Docker, hoặc WSL2.

## Dung lượng theo thời gian

Thứ lớn dần là `superset.db` — AnalytiX ghi nhật ký truy vấn và trạng thái bộ lọc
vào đó liên tục. Trên một bản dùng nhiều, bảng nhật ký có thể chiếm phần lớn tệp.

Chưa có mốc đo cho bản cài độc lập. Nên **theo dõi kích thước `superset.db`** và
dọn bảng nhật ký khi cần.

## Liên quan

- [Cài thực trên máy](../how-to/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-bang-docker.md)
- [Đóng gói bản phát hành](../how-to/dong-goi-ban-phat-hanh.md) — dựng ra ba kiểu ở đầu trang
- [Biến môi trường](./bien-moi-truong.md)
- [Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
