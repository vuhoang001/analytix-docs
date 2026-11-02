---
title: Cài thực trên máy
sidebar_position: 2
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Cài thực trên máy

Cài AnalytiX vào một môi trường ảo Python trên chính máy đó, không qua Docker.

Dành cho người quản trị. Cần có trước:

- **Python 3.10, 3.11 hoặc 3.12** — bộ cài từ chối mọi bản khác
- Khả năng tạo venv (`python3-venv` trên Debian/Ubuntu)
- **Mạng ra được PyPI** — bản đóng gói mang theo *danh sách* 156 gói đã ghim, không mang theo chính các gói đó
- Bản đóng gói `analytix-<bản>` đã giải nén

Không cần `sudo`: mọi thứ nằm trong thư mục của bạn.

## Các bước

```bash
cd analytix-<bản>
./install.sh
```

Chỉ vậy. Bộ cài tự làm năm việc: kiểm bản đóng gói đủ chưa, dựng venv và cài
theo đúng thứ tự, viết cấu hình, tạo database và tài khoản quản trị, rồi viết
một script khởi động.

Chạy xong:

```bash
~/analytix/start.sh
```

Mở `http://127.0.0.1:8088`.

## Chọn chỗ cài và tài khoản

Đặt biến **trước** khi chạy:

```bash
ANALYTIX_HOME=/opt/analytix \
ANALYTIX_ADMIN_USER=quantri \
ANALYTIX_PORT=9000 \
PYTHON=python3.12 \
./install.sh
```

| Biến | Mặc định |
|:---|:---|
| `ANALYTIX_HOME` | `$HOME/analytix` |
| `ANALYTIX_ADMIN_USER` | `admin` |
| `ANALYTIX_ADMIN_PASSWORD` | *sinh ngẫu nhiên, in một lần* |
| `ANALYTIX_PORT` | `8088` |
| `PYTHON` | `python3` |

`ANALYTIX_BIND` **không** dùng lúc cài — nó chỉ được `start.sh` đọc, xem phần
dưới. Bảng đầy đủ: [Biến môi trường](../reference/bien-moi-truong.md).

:::danger[Mật khẩu in một lần, không ghi vào tệp nào]
Dòng cuối của bộ cài:

```
[analytix] administrator admin password: <chuỗi>
[analytix] this is printed once and is written to no file. Save it now.
```

Lưu ngay. Mất thì đặt lại bằng:

```bash
~/analytix/venv/bin/superset fab reset-password --username admin
```

Không có tài khoản mặc định nào — đây là chủ ý của sản phẩm, không phải thiếu sót.
:::

## Cài vào đâu

| Đường dẫn | Là gì |
|:---|:---|
| `$ANALYTIX_HOME/venv/` | môi trường ảo Python |
| `$ANALYTIX_HOME/superset_config.py` | cấu hình, **quyền 600**, chứa khoá bí mật |
| `$ANALYTIX_HOME/workspace_x_theme.py` | theme — cấu hình `exec()` tệp này |
| `$ANALYTIX_HOME/superset.db` | database metadata (SQLite) |
| `$ANALYTIX_HOME/start.sh` | script khởi động |

:::note[Theme là tệp thứ hai, không nằm trong wheel]
`superset_config.py` có dòng `exec(open(.../workspace_x_theme.py).read())`. Nghĩa
là **xoá tệp theme là mất thương hiệu** và AnalytiX trở lại thành Superset. Hai
tệp phải đi cùng nhau.
:::

## Cho máy khác truy cập

`start.sh` mặc định nghe `127.0.0.1` — chỉ chính máy đó vào được. Mở ra mạng:

```bash
ANALYTIX_BIND=0.0.0.0 ~/analytix/start.sh
```

:::danger[Đổi mật khẩu quản trị TRƯỚC khi mở ra mạng]
Và biết rằng bạn đang mở một web server dành cho phát triển, không có HTTPS. Xem
[Vì sao bản cài chưa sẵn sàng cho môi trường thật](../explanation/chua-san-sang-cho-production.md).
:::

## Kiểm tra là đã đúng

Bộ cài tự in ba dòng xác nhận trong lúc chạy:

```
[analytix] bundle OK, version <bản>
[analytix] config loads: AnalytiX ['en', 'vi']
[analytix] installed AnalytiX <bản> in <thư-mục>
```

Dòng giữa là dòng quan trọng — nó chứng minh theme nạp được và tên sản phẩm đúng.

Rồi tự kiểm:

```bash
~/analytix/start.sh &
curl -fsS http://127.0.0.1:8088/health          # mong: OK
```

## Cài lại lần nữa thì sao

Chạy `./install.sh` lần hai là **an toàn**:

- venv có rồi thì dùng lại, không dựng lại
- `superset_config.py` có rồi thì **giữ nguyên** — khoá bí mật không bị sinh lại
- tài khoản quản trị có rồi thì không tạo lại, không in mật khẩu mới
- `db upgrade` chạy lại, và nó vốn an toàn khi chạy nhiều lần

Nên nâng cấp lên bản mới chính là: giải nén bundle mới, chạy lại `./install.sh`
với cùng `ANALYTIX_HOME`.

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|:---|:---|:---|
| `python3 not found; set PYTHON to a 3.10, 3.11 or 3.12 interpreter` | Không có `python3` trong `PATH` | `PYTHON=/usr/bin/python3.12 ./install.sh` |
| `python 3.13 is not supported` | Bản Python ngoài khoảng được kiểm | Dùng 3.10, 3.11 hoặc 3.12. Bộ pin chỉ được chứng minh trên 3.10 và 3.12 |
| `no apache_superset-*.whl beside this script` | Chạy không đúng thư mục, hoặc bundle thiếu | `cd` vào thư mục bundle rồi chạy `./install.sh` |
| `cachelib is X but the pin is Y; the resolver overrode a pin` | Thứ tự cài bị phá | Đừng cài tiếp. Đóng gói lại — sai thứ tự làm `superset fab create-admin` hỏng về sau |
| Dừng ở bước cài gói, lỗi mạng | Không ra được PyPI | Bundle **không** mang theo gói. Cần mạng, hoặc dựng một kho gói nội bộ |
| `AssertionError` ở bước `config loads` | Theme không nạp được, hoặc tên/ngôn ngữ sai | Kiểm `workspace_x_theme.py` có trong bundle và đọc được |
| Nối database bên ngoài báo thiếu driver | Chỉ SQLite có sẵn | [Thêm driver cho nguồn dữ liệu](./them-driver-du-lieu.md) |
| Mất mật khẩu quản trị | Nó chỉ in một lần | `~/analytix/venv/bin/superset fab reset-password --username admin` |

## Những gì bộ cài KHÔNG tạo

Không có unit `systemd`, không nginx, không HTTPS, không Redis, không tiến trình
chạy việc nền, không tệp `.env`. Chỉ có `start.sh`.

Muốn nó tự chạy lại sau khi khởi động máy thì phải tự viết unit `systemd` gọi
`start.sh`.

## Liên quan

- [Cài bằng Docker](./cai-dat-bang-docker.md) — không cần Python trên máy đích
- [Thêm driver cho nguồn dữ liệu](./them-driver-du-lieu.md)
- [Đóng gói bản phát hành](./dong-goi-ban-phat-hanh.md)
- [Biến môi trường](../reference/bien-moi-truong.md)
- [Yêu cầu hệ thống](../reference/yeu-cau-he-thong.md)
