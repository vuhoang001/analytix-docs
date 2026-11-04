---
title: Biến môi trường
sidebar_position: 1
last_update:
  date: "2026-11-04"
  author: vuhoang001
---

# Biến môi trường

Các biến điều khiển bộ cài, script khởi động và container.

Giá trị mặc định dưới đây **đọc trực tiếp từ `bo-cai/cai.sh`,
`bo-cai/go-cai.sh`, `bo-cai/cai-tren-may.sh`, `bo-cai/entrypoint.sh`,
`bo-cai/Dockerfile` và `theme/workspace_x_theme.py`** của bộ cài, không lấy theo
tài liệu.

## Dùng ở đâu

Cột cho biết biến có tác dụng ở đường nào — đây là chỗ hay nhầm nhất. Ô ghi tên
flag nghĩa là biến chỉ có tác dụng ở đường đó của `./cai.sh`.

| Biến | Mặc định | `cai.sh` | `go-cai.sh` | `cai-tren-may.sh` | `khoi-dong.sh` | Container |
|:---|:---|:--:|:--:|:--:|:--:|:--:|
| `ANALYTIX_HOME` | `$HOME/analytix` · container: `/app/analytix` | `--may` | ✅ | ✅ | — | ✅ |
| `ANALYTIX_ADMIN_USER` | `admin` | — | — | ✅ | — | ✅ |
| `ANALYTIX_ADMIN_PASSWORD` | *sinh ngẫu nhiên, in một lần* | ✅ | — | ✅ | — | ✅ |
| `ANALYTIX_PORT` | `8088` | ✅ | — | ✅ | ✅ | ✅ |
| `ANALYTIX_NAME` | `analytix` | `--docker` `--offline` | ✅ | — | — | — |
| `ANALYTIX_VOLUME` | `analytix-data` | `--docker` `--offline` | ✅ | — | — | — |
| `ANALYTIX_BIND` | `127.0.0.1` | — | — | — | ✅ | — |
| `ANALYTIX_SECRET_KEY` | *sinh ngẫu nhiên lần chạy đầu* | — | — | — | — | ✅ |
| `ANALYTIX_FRAME_ANCESTORS` | *không đặt* — mọi origin khác bị chặn nhúng | — | — | — | ✅ | ✅ |
| `PYTHON` | `python3` — **bỏ qua khi bộ cài có `python/`** | ✅ | — | ✅ | — | — |

Sáu chỗ hay nhầm:

- **`ANALYTIX_BIND` không có tác dụng lúc cài.** Chỉ `khoi-dong.sh` đọc nó. Đặt lúc
  chạy `./cai-tren-may.sh` là không có gì xảy ra — script đó chỉ ghi
  `${ANALYTIX_BIND:-127.0.0.1}` vào `khoi-dong.sh` chứ không đọc giá trị. Đi qua
  `./cai.sh --may` thì có tác dụng, vì script đó `exec` sang `khoi-dong.sh` ở
  bước cuối.
- **`ANALYTIX_SECRET_KEY` chỉ có ở đường container.** Bản cài tay luôn tự sinh
  khoá và không nhận biến này.
- **`PYTHON` chỉ có ở bản cài tay, và bộ cài đầy đủ bỏ qua nó.** Container đã
  ghim Python 3.12. Bộ cài có thư mục `python/` thì cả `cai.sh` lẫn
  `cai-tren-may.sh` dùng `python/bin/python3` và **không đọc tới `PYTHON`** —
  xem mục chi tiết bên dưới. Chỉ ở bộ cài thường `cai.sh` mới đọc nó, và cũng
  chỉ để dò xem máy có trình thông dịch hợp lệ không, tức để quyết đường `--may`
  có đi được hay không.
- **`ANALYTIX_HOME` chỉ có ở `--may`.** Hai đường container bỏ qua nó: chỗ ở bên
  trong ảnh đã ghim `/app/analytix`, phía ngoài thì dữ liệu nằm trong
  `ANALYTIX_VOLUME`. **`go-cai.sh` cũng đọc nó** — đó là thư mục nó tìm để dọn.
- **`ANALYTIX_NAME` và `ANALYTIX_VOLUME` dùng cho cả `--docker` và `--offline`**
  (hai đường đó chạy chung một đoạn dựng container), **và cả `go-cai.sh`** — nó
  lấy hai biến này ra để biết container và volume nào là của mình. Gọi
  `docker run` tay thì đặt `--name` và `-v` trực tiếp, hai biến này không đọc tới.
- **`ANALYTIX_ADMIN_USER` không đi qua `cai.sh`.** Script không hề đọc biến này,
  nên nó không được chuyển sang container ở `--docker` hay `--offline`. Cần tên
  quản trị khác thì gọi `docker run -e ANALYTIX_ADMIN_USER=...` tay, hoặc dùng
  `./cai.sh --may` (biến được kế thừa qua môi trường sang `cai-tren-may.sh`).
  `ANALYTIX_ADMIN_PASSWORD` thì khác: `cai.sh` chuyển nó sang container bằng
  `-e` nếu được đặt.

## Flag của hai lệnh

Để tra cứu nhanh — hướng dẫn dùng nằm ở các trang How-to.

`./cai.sh`:

| Flag | Làm gì |
|:---|:---|
| *không flag* | tự dò, theo thứ tự `--offline` → `--docker` → `--may` |
| `--docker` | dựng ảnh từ wheel rồi chạy container |
| `--may` | cài thực vào một môi trường ảo Python |
| `--offline` | nạp ảnh đã lưu sẵn rồi chạy container |
| `--giup` | in hướng dẫn (`-h`, `--help` cũng được) |

`./go-cai.sh` — một lệnh gỡ được cả ba đường, **không có flag chọn đường**:

| Flag | Làm gì |
|:---|:---|
| *không flag* | gỡ, **giữ** dữ liệu |
| `--ca-du-lieu` | gỡ, xoá luôn volume và cả thư mục `ANALYTIX_HOME` |
| `-y` | không hỏi lại (`--dong-y` cũng được) |
| `--giup` | in hướng dẫn (`-h`, `--help` cũng được) |

Không có `-y` mà cũng không có bàn phím thì `go-cai.sh` **dừng**, không xoá gì.

## Chi tiết từng biến

### `ANALYTIX_HOME`

Nơi chứa mọi thứ của bản cài:

| Đường dẫn | Là gì |
|:---|:---|
| `venv/` | môi trường ảo Python |
| `python/` | cây CPython 3.12.16, ~113 MB — **chỉ khi cài từ bộ cài đầy đủ** |
| `superset_config.py` | cấu hình, quyền **600**, chứa khoá bí mật |
| `workspace_x_theme.py` | theme — cấu hình `exec()` tệp này |
| `superset.db` | database metadata (SQLite) |
| `khoi-dong.sh` | script khởi động (chỉ bản cài tay) |

`python/` là bản chép từ thư mục `python/` của bộ cài, không phải liên kết. Chép
là cố ý: một venv ghi lại đường dẫn trình thông dịch đã tạo ra nó và nạp thư
viện chuẩn từ đó, nên venv dựng thẳng từ thư mục bộ cài sẽ chết khi thư mục đó
bị đổi tên hay xoá. Chép xong thì xoá bộ cài đi bản cài vẫn chạy.

Trong container, đây là đường dẫn phải gắn volume vào để dữ liệu sống qua lần
chạy sau.

`go-cai.sh` đọc biến này để biết dọn thư mục nào. Mặc định nó xoá `venv/`,
`python/` và `khoi-dong.sh`, giữ `superset.db` cùng `superset_config.py`;
`--ca-du-lieu` xoá cả thư mục. `python/` nằm ở phía bị xoá vì nó là phần chương
trình, không phải dữ liệu.

Hai chốt an toàn trong `go-cai.sh`: biến phải là **đường dẫn tuyệt đối**, và nó
**từ chối** xoá khi giá trị là `/` hoặc đúng bằng `$HOME`. Thư mục chỉ được coi
là bản cài AnalytiX khi có `venv/bin/superset` hoặc `superset_config.py`.

### `ANALYTIX_ADMIN_USER`

Tên đăng nhập của tài khoản quản trị đầu tiên. Bộ cài cũng đặt:

- Họ tên: `Admin AnalytiX`
- Email: `<tên-đăng-nhập>@localhost`

Tài khoản đã tồn tại thì **không** tạo lại và **không** in mật khẩu mới.

### `ANALYTIX_NAME`

Tên container mà `./cai.sh` tạo ra ở `--docker` và `--offline`. Mặc định
`analytix`. `go-cai.sh` cũng tìm container theo tên này.

Đổi nó khi muốn chạy nhiều bản cạnh nhau — nhớ đổi cả `ANALYTIX_PORT` và
`ANALYTIX_VOLUME`, nếu không hai bản sẽ giành cổng và dùng chung dữ liệu.

```bash
ANALYTIX_NAME=ax-thu ANALYTIX_PORT=9000 ANALYTIX_VOLUME=ax-thu-data ./cai.sh
```

Container trùng tên đã tồn tại thì `cai.sh` **khởi động lại cái cũ** chứ không
tạo mới — kể cả khi bạn đặt `ANALYTIX_PORT` khác, vì ánh xạ cổng được đóng cứng
lúc tạo container. Đổi cổng thật thì phải xoá rồi tạo lại.

### `ANALYTIX_VOLUME`

Tên volume Docker giữ dữ liệu, gắn vào `/app/analytix`. Mặc định `analytix-data`.

Dữ liệu **không** nằm trong container: xoá container không mất gì, xoá volume là
mất cả khoá bí mật, tài khoản, dataset và biểu đồ.

`go-cai.sh` đọc biến này nhưng mặc định **không** xoá volume — chỉ
`./go-cai.sh --ca-du-lieu` xoá.

### `ANALYTIX_ADMIN_PASSWORD`

Không đặt thì bộ cài sinh một mật khẩu ngẫu nhiên và **in ra một lần duy nhất**:

```
[analytix] administrator admin password: <chuỗi>
[analytix] this is printed once and is written to no file. Save it now.
```

**Không có mật khẩu mặc định.** Đây là chủ ý của sản phẩm. Không có
`admin/admin`.

Mất mật khẩu thì đặt lại:
```bash
~/analytix/venv/bin/superset fab reset-password --username admin
```

Đặt tay thì nó nằm trong lịch sử shell và trong danh sách tiến trình lúc chạy.

### `ANALYTIX_PORT`

Cổng ứng dụng nghe. Mặc định `8088`.

Trong `khoi-dong.sh`, giá trị dự phòng không phải `8088` mà là **cổng lúc cài** —
`cai-tren-may.sh` ghi cứng nó vào script khi sinh ra. Cài bằng
`ANALYTIX_PORT=9000` thì `khoi-dong.sh` không có biến cũng nghe 9000.

**Đổi cổng làm healthcheck của container báo sai.** Healthcheck trong ảnh **ghim
cứng** `http://127.0.0.1:8088/health`. Đổi `ANALYTIX_PORT` thì ứng dụng chạy đúng
nhưng Docker báo `unhealthy` mãi.

Đổi cổng phía ngoài bằng ánh xạ, đừng đổi cổng bên trong:
```bash
docker run -p 9000:8088 ...        # đúng
```

### `ANALYTIX_BIND`

Chỉ `khoi-dong.sh` đọc. Mặc định `127.0.0.1` — chỉ chính máy đó vào được.

```bash
ANALYTIX_BIND=0.0.0.0 ~/analytix/khoi-dong.sh
```

**Đổi mật khẩu quản trị trước khi mở ra mạng**, và đọc
[Vì sao bản cài chưa sẵn sàng cho môi trường thật](../explanation/chua-san-sang-cho-production.md).

Container luôn nghe `0.0.0.0` bên trong — đó là điều kiện để `-p` hoạt động, và
biên bảo mật là ranh giới container.

### `ANALYTIX_FRAME_ANCESTORS`

Danh sách origin được phép nhúng AnalytiX vào `iframe`, cách nhau bằng dấu cách.
Không đặt thì AnalytiX gửi `X-Frame-Options: SAMEORIGIN` và không trang khác
origin nào nhúng được.

```bash
ANALYTIX_FRAME_ANCESTORS="https://cong-thong-tin.noi-bo https://intranet.vi-du"
```

Đặt rồi thì `X-Frame-Options` bị bỏ và CSP mang
`frame-ancestors 'self' <các origin bạn khai>`.

:::danger[Đừng khai `*`]
Cho bất kỳ trang nào nhúng AnalytiX vào khung ẩn là mở đường clickjacking.
Liệt kê đúng origin bạn kiểm soát.
:::

Xem [Nhúng dashboard bằng iframe đơn giản](../how-to/nhung-iframe-don-gian.md).

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

**Bộ cài đầy đủ bỏ qua biến này.** Có `python/bin/python3` trong thư mục bộ cài
thì cả hai script dùng cây Python đó, bất kể `PYTHON` đặt gì:

| Script | Khi bộ cài có `python/` | Khi không có |
|:---|:---|:---|
| `cai-tren-may.sh` | chép `python/` vào `$ANALYTIX_HOME/python/` rồi dựng venv từ bản chép; in `python 3.12.16 from the bundle` | đọc `PYTHON`, kiểm phiên bản, in `python <bản> from the machine` |
| `cai.sh` | coi đường `--may` là đi được, lý do `bộ cài mang sẵn Python` | đọc `PYTHON` để dò xem máy có trình thông dịch hợp lệ không |

Bộ cài thường thì biến có tác dụng, và chỉ nhận **3.10, 3.11, 3.12**. Bản khác
thì bộ cài dừng:

```
python 3.13 is not supported; the pinned set is proven on 3.10 and 3.12
```

```bash
PYTHON=/usr/bin/python3.12 ./cai.sh --may
PYTHON=/usr/bin/python3.12 ./cai-tren-may.sh
```

Không có `python3` trong `PATH` và cũng không có `python/` thì
`cai-tren-may.sh` dừng:

```
python3 not found; set PYTHON to a 3.10, 3.11 or 3.12 interpreter
```

Gõ rõ `./cai.sh --may` mà không có trình thông dịch hợp lệ thì `cai.sh` dừng
trước cả khi dựng venv:

```
không có Python 3.10/3.11/3.12. Đặt PYTHON=<đường-dẫn>.
```

Câu `Hoặc dùng ./cai.sh --docker.` chỉ được nối thêm vào cuối khi thư mục đó
thật sự đủ nguyên liệu cho đường Docker — thư mục không có wheel thì không có
câu đó, vì nó sẽ dẫn vào đường chết.

## Biến bộ cài KHÔNG đọc

Để tránh mất thời gian: không có biến nào để chọn database metadata, bật Redis,
bật HTTPS, hay chọn web server. Những thứ đó sửa trong `superset_config.py` sau
khi cài, hoặc dựng thêm ở ngoài.

## Liên quan

- [Cài thực trên máy](../how-to/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-bang-docker.md)
- [Yêu cầu hệ thống](./yeu-cau-he-thong.md)
- [Cấu hình MCP](./mcp-cau-hinh.md) — các biến `MCP_*`, đặt trong `superset_config.py`
