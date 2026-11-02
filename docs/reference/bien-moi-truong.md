---
title: Biến môi trường
sidebar_position: 1
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Biến môi trường

Các biến điều khiển bộ cài, script khởi động và container.

Giá trị mặc định dưới đây **đọc trực tiếp từ `ship/install.sh`,
`ship/entrypoint.sh` và `ship/Dockerfile`** của bộ cài, không lấy theo tài liệu.

## Dùng ở đâu

Cột cho biết biến có tác dụng ở đường nào — đây là chỗ hay nhầm nhất.

| Biến | Mặc định | `install.sh` | `start.sh` | Container |
|:---|:---|:--:|:--:|:--:|
| `ANALYTIX_HOME` | `$HOME/analytix` · container: `/app/analytix` | ✅ | — | ✅ |
| `ANALYTIX_ADMIN_USER` | `admin` | ✅ | — | ✅ |
| `ANALYTIX_ADMIN_PASSWORD` | *sinh ngẫu nhiên, in một lần* | ✅ | — | ✅ |
| `ANALYTIX_PORT` | `8088` | ✅ | ✅ | ✅ |
| `ANALYTIX_BIND` | `127.0.0.1` | — | ✅ | — |
| `ANALYTIX_SECRET_KEY` | *sinh ngẫu nhiên lần chạy đầu* | — | — | ✅ |
| `PYTHON` | `python3` | ✅ | — | — |

:::caution[Ba chỗ hay nhầm]
**`ANALYTIX_BIND` không có tác dụng lúc cài.** Chỉ `start.sh` đọc nó. Đặt lúc
chạy `./install.sh` là không có gì xảy ra.

**`ANALYTIX_SECRET_KEY` chỉ có ở đường container.** Bản cài tay luôn tự sinh khoá
và không nhận biến này.

**`PYTHON` chỉ có ở bản cài tay.** Container đã ghim Python 3.12.
:::

## Chi tiết từng biến

### `ANALYTIX_HOME`

Nơi chứa mọi thứ của bản cài:

| Đường dẫn | Là gì |
|:---|:---|
| `venv/` | môi trường ảo Python |
| `superset_config.py` | cấu hình, quyền **600**, chứa khoá bí mật |
| `workspace_x_theme.py` | theme — cấu hình `exec()` tệp này |
| `superset.db` | database metadata (SQLite) |
| `start.sh` | script khởi động (chỉ bản cài tay) |

Trong container, đây là đường dẫn phải gắn volume vào để dữ liệu sống qua lần
chạy sau.

### `ANALYTIX_ADMIN_USER`

Tên đăng nhập của tài khoản quản trị đầu tiên. Bộ cài cũng đặt:

- Họ tên: `Admin AnalytiX`
- Email: `<tên-đăng-nhập>@localhost`

Tài khoản đã tồn tại thì **không** tạo lại và **không** in mật khẩu mới.

### `ANALYTIX_ADMIN_PASSWORD`

Không đặt thì bộ cài sinh một mật khẩu ngẫu nhiên và **in ra một lần duy nhất**:

```
[analytix] administrator admin password: <chuỗi>
[analytix] this is printed once and is written to no file. Save it now.
```

:::danger[Không có mật khẩu mặc định]
Đây là chủ ý của sản phẩm. Không có `admin/admin`.

Mất mật khẩu thì đặt lại:
```bash
~/analytix/venv/bin/superset fab reset-password --username admin
```
:::

Đặt tay thì nó nằm trong lịch sử shell và trong danh sách tiến trình lúc chạy.

### `ANALYTIX_PORT`

Cổng ứng dụng nghe. Mặc định `8088`.

:::danger[Đổi cổng làm healthcheck của container báo sai]
Healthcheck trong ảnh **ghim cứng** `http://127.0.0.1:8088/health`. Đổi
`ANALYTIX_PORT` thì ứng dụng chạy đúng nhưng Docker báo `unhealthy` mãi.

Đổi cổng phía ngoài bằng ánh xạ, đừng đổi cổng bên trong:
```bash
docker run -p 9000:8088 ...        # đúng
```
:::

### `ANALYTIX_BIND`

Chỉ `start.sh` đọc. Mặc định `127.0.0.1` — chỉ chính máy đó vào được.

```bash
ANALYTIX_BIND=0.0.0.0 ~/analytix/start.sh
```

**Đổi mật khẩu quản trị trước khi mở ra mạng**, và đọc
[Vì sao bản cài chưa sẵn sàng cho môi trường thật](../explanation/chua-san-sang-cho-production.md).

Container luôn nghe `0.0.0.0` bên trong — đó là điều kiện để `-p` hoạt động, và
biên bảo mật là ranh giới container.

### `ANALYTIX_SECRET_KEY`

Chỉ ở đường container. Không đặt thì entrypoint sinh một khoá ở **lần chạy đầu**
và ghi vào `superset_config.py`. Lần chạy sau, nếu cấu hình đã tồn tại thì khối
đó bị bỏ qua — khoá cũ được giữ.

:::danger[Mất khoá là hỏng session và dashboard đã nhúng]
Khoá ký session và ký vé khách dùng cho nhúng. Container không gắn volume thì
mỗi lần `docker rm` là mất khoá.

Sao lưu `superset_config.py` cùng với `superset.db`.
:::

### `PYTHON`

Trình thông dịch bộ cài dùng để dựng venv. Mặc định `python3`.

Chỉ nhận **3.10, 3.11, 3.12**. Bản khác thì bộ cài dừng:

```
python 3.13 is not supported; the pinned set is proven on 3.10 and 3.12
```

```bash
PYTHON=/usr/bin/python3.12 ./install.sh
```

## Biến bộ cài KHÔNG đọc

Để tránh mất thời gian: không có biến nào để chọn database metadata, bật Redis,
bật HTTPS, hay chọn web server. Những thứ đó sửa trong `superset_config.py` sau
khi cài, hoặc dựng thêm ở ngoài.

## Liên quan

- [Cài thực trên máy](../how-to/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-bang-docker.md)
- [Yêu cầu hệ thống](./yeu-cau-he-thong.md)
- [Cấu hình MCP](./mcp-cau-hinh.md) — các biến `MCP_*`, đặt trong `superset_config.py`
