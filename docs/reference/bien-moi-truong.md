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
| `ANALYTIX_ADMIN_PASSWORD` | `admin` — đổi ngay lần đăng nhập đầu | ✅ | — | ✅ | — | ✅ |
| `ANALYTIX_PORT` | `8088` | ✅ | — | ✅ | ✅ | ✅ |
| `ANALYTIX_NAME` | `analytix` | `--docker` `--offline` | ✅ | — | — | — |
| `ANALYTIX_VOLUME` | `analytix-data` | `--docker` `--offline` | ✅ | — | — | — |
| `ANALYTIX_BIND` | `127.0.0.1` | `--docker` `--offline` | — | — | ✅ | — |
| `ANALYTIX_SECRET_KEY` | *sinh ngẫu nhiên lần chạy đầu* | — | — | — | — | ✅ |
| `ANALYTIX_FRAME_ANCESTORS` | *không đặt* — mọi origin khác bị chặn nhúng | — | — | — | ✅ | ✅ |
| `PYTHON` | `python3` — **bỏ qua khi bộ cài có `python/`** | ✅ | — | ✅ | — | — |

Sáu chỗ hay nhầm:

- **`ANALYTIX_BIND` có hai nghĩa khác nhau, tuỳ script nào đọc nó.** `cai.sh` ở
  đường `--docker` và `--offline` đọc nó để quyết **cổng Docker mở trên giao diện
  mạng nào** của máy chủ — `-p "$BIND:$PORT:8088"`. `khoi-dong.sh` đọc nó để quyết
  **địa chỉ Flask nghe** — `superset run -h "$BIND"`. Cả hai mặc định `127.0.0.1`.
  Riêng `cai-tren-may.sh` thì **không đọc giá trị**: nó chỉ ghi nguyên chuỗi
  `${ANALYTIX_BIND:-127.0.0.1}` vào `khoi-dong.sh` lúc sinh script, nên đặt biến
  lúc chạy `./cai-tren-may.sh` là không có gì xảy ra. Đi qua `./cai.sh --may` thì
  có tác dụng, vì script đó `exec` sang `khoi-dong.sh` ở bước cuối và biến được kế
  thừa qua môi trường — nhưng là có tác dụng ở nghĩa *Flask nghe ở đâu*, không
  phải ở nghĩa ánh xạ cổng Docker.
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

Không đặt thì mật khẩu là **`admin`** — tài khoản mặc định là `admin` / `admin`,
và người dùng tự đổi ở lần đăng nhập đầu. `cai-tren-may.sh` in:

```
[analytix] administrator: admin / admin
[analytix] CHANGE IT at first login: Settings -> Info -> Reset my password.
[analytix] Until you do, the start script refuses to listen outside 127.0.0.1.
```

`entrypoint.sh` trong container in hai dòng đầu, không có dòng thứ ba — chốt đó
nằm ở `khoi-dong.sh`, mà container không dùng script này. `cai.sh` ở đường
`--docker` và `--offline` in lại bằng tiếng Việt ở cuối:

```
[analytix] tài khoản quản trị:          admin / admin
[analytix] ĐỔI MẬT KHẨU ngay lần đăng nhập đầu: Settings → Info → Reset my password.
```

Đặt biến thì bộ cài dùng đúng giá trị đó và **không in mật khẩu ra**; `cai.sh`
chuyển nó sang container bằng `-e`. Khi đó, và cả khi tài khoản đã có từ lần cài
trước, `cai.sh` in:

```
[analytix] tài khoản quản trị:          admin
[analytix] mật khẩu:                    cái bạn đặt, hoặc cái đã đặt từ lần cài trước
```

Tài khoản đã tồn tại thì **không** tạo lại và biến bị bỏ qua —
`administrator admin already exists; not recreating it` ở bản cài tay,
`administrator admin already exists` trong container. Đổi mật khẩu của tài khoản
đã có thì dùng `reset-password`, không phải đặt lại biến này.

:::warning[`admin/admin` là thông tin đăng nhập ai cũng đoán được]
Đổi nó ngay lần đăng nhập đầu. Chừng nào chưa đổi, `khoi-dong.sh` **từ chối** nghe
ra ngoài loopback — xem [`ANALYTIX_BIND`](#analytix_bind). Chốt đó không có ở
đường container: biên bảo mật ở đó là ánh xạ cổng, mặc định chỉ mở trên
`127.0.0.1`.
:::

Đổi mật khẩu, hoặc mất mật khẩu đã đặt tay:
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

Hai script đọc biến này, và **nghĩa của nó khác nhau ở hai chỗ**. Mặc định cả hai
là `127.0.0.1` — chỉ chính máy đó vào được.

| Script | Nó quyết định gì | Dòng mã |
|:---|:---|:---|
| `cai.sh` — `--docker`, `--offline` | giao diện mạng của **máy chủ** mà cổng Docker mở lên | `docker run -p "$BIND:$PORT:8088"` |
| `khoi-dong.sh` — bản cài tay | địa chỉ **Flask** nghe trong tiến trình | `superset run -h "$BIND"` |

`cai-tren-may.sh` không đọc giá trị, chỉ ghi `${ANALYTIX_BIND:-127.0.0.1}` vào
`khoi-dong.sh` khi sinh script đó.

#### Ở `cai.sh`: cổng Docker mở trên giao diện nào

```bash
ANALYTIX_BIND=0.0.0.0 ./cai.sh          # mở ra mọi giao diện mạng
```

Để mặc định thì cổng chỉ mở trên máy đó, và `cai.sh` in:

```
[analytix] cổng chỉ mở trên máy này. Mở ra mạng:  ANALYTIX_BIND=0.0.0.0 ./cai.sh
```

Đặt khác `127.0.0.1` thì nó in cảnh báo thay cho dòng trên:

```
[analytix] CẢNH BÁO: cổng đang mở trên 0.0.0.0 — đổi mật khẩu quản trị trước khi rời máy.
```

Ánh xạ cổng được đóng cứng lúc **tạo** container. Container đã tồn tại thì
`cai.sh` khởi động lại cái cũ, và đổi biến này không có tác dụng gì — phải xoá
rồi tạo lại.

Bên trong container thì Flask luôn nghe `0.0.0.0`, không đọc `ANALYTIX_BIND` —
đó là điều kiện để `-p` hoạt động, và biên bảo mật là ánh xạ cổng cùng ranh giới
container.

#### Ở `khoi-dong.sh`: Flask nghe ở đâu

```bash
ANALYTIX_BIND=0.0.0.0 ~/analytix/khoi-dong.sh
```

:::danger[Chốt: mật khẩu còn là `admin` thì không ra khỏi loopback được]
`ANALYTIX_BIND` khác `127.0.0.1` và khác `localhost` thì `khoi-dong.sh` đọc hash
mật khẩu của `admin` trong `superset.db` và so với đúng chuỗi `admin`. Còn khớp
thì nó dừng, chưa khởi động gì:

```
[analytix] LỖI: mật khẩu quản trị vẫn là 'admin'.
[analytix] Từ chối nghe trên 0.0.0.0. Đổi mật khẩu rồi chạy lại:
[analytix]   Settings -> Info -> Reset my password
[analytix] hoặc: ~/analytix/venv/bin/superset fab reset-password --username admin
```

Đổi mật khẩu xong là chốt tự mở. Nó **chỉ** kiểm đúng một chuỗi đó và không chặn
gì khác — mật khẩu yếu kiểu `123456` thì nó cho qua.
:::

Đọc thêm [Vì sao bản cài chưa sẵn sàng cho môi trường
thật](../explanation/chua-san-sang-cho-production.md) trước khi mở ra mạng.

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

Xem [Nhúng dashboard bằng iframe đơn giản](../how-to/nhung-bao-cao/nhung-iframe-don-gian.md).

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

- [Cài thực trên máy](../how-to/cai-dat-van-hanh/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-van-hanh/cai-dat-bang-docker.md)
- [Yêu cầu hệ thống](./yeu-cau-he-thong.md)
- [Cấu hình MCP](./mcp-cau-hinh.md) — các biến `MCP_*`, đặt trong `superset_config.py`
