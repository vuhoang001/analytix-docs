---
title: Đóng gói bản phát hành
sidebar_position: 5
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Đóng gói bản phát hành

Tạo bản đóng gói `analytix-<bản>.tar.gz` để giao cho người khác cài.

Dành cho người bảo trì AnalytiX. Cần có trước: mã nguồn AnalytiX, và một tệp
wheel `apache_superset-<bản>-py3-none-any.whl` đã build.

Trang này **không** nói cách build wheel — đó là việc khác, cần Node.js và một
máy build riêng.

## Các bước

```bash
ship/make_bundle.sh <đường-dẫn-tới-wheel> [thư-mục-đích]
```

Thư mục đích mặc định `/var/tmp/analytix-ship`. Kết quả:

```
<đích>/analytix-<bản>/          thư mục bundle
<đích>/analytix-<bản>.tar.gz    bản nén, khoảng 105 MB
```

## Bản đóng gói chứa gì

| Trong bundle | Lấy từ |
|:---|:---|
| `apache_superset-<bản>-py3-none-any.whl` | tham số bạn truyền vào |
| `requirements/base.txt` | `src/requirements/base.txt`, hoặc `ship/vendor/requirements/base.txt` |
| `superset-core/` | `src/superset-core`, hoặc `ship/vendor/superset-core` (cả cây) |
| `workspace_x_theme.py` | `theme/workspace_x_theme.py` |
| `install.sh` | `ship/install.sh` |
| `entrypoint.sh` | `ship/entrypoint.sh` |
| `Dockerfile` | `ship/Dockerfile` |
| `README.md` | sinh tự động |

**Không** có trong bundle: `patches/`, `translations/` (đã biên dịch vào wheel),
`gates/`, `tools/`.

:::note[Hai mảnh đó lấy ở đâu ra]
Repo sản phẩm không chứa `src/` (320 MB mã nguồn Superset), nên nó giữ sẵn bản
sao 540 KB ở `ship/vendor/`. Script tự chọn: có `src/` thì cắt từ cây nguồn vừa
build, không thì dùng `ship/vendor/`. Dòng nó in ra cho biết đã chọn đường nào.

`ship/vendor/CUT-FROM` ghi version của wheel mà bản sao đó được cắt ra cùng. Đưa
wheel khác thế hệ vào thì script dừng — xem bảng Lỗi hay gặp.
:::

:::note[Bundle vừa là bộ cài vừa là build context]
`Dockerfile` `COPY` wheel, `requirements/`, `superset-core/`,
`workspace_x_theme.py` và `entrypoint.sh` từ **chính thư mục bundle**. Nên cùng
một thư mục dùng được cho cả hai đường cài, và chúng **không thể lệch nhau**.

Đó là lý do `docker build` phải chạy từ trong thư mục bundle.
:::

## Kiểm tra là đã đúng

Script tự in đường dẫn bundle, đường dẫn tarball kèm kích thước, và danh sách
nội dung. Rồi tự kiểm:

```bash
cd /var/tmp/analytix-ship/analytix-<bản>
ls apache_superset-*.whl requirements/base.txt superset-core workspace_x_theme.py \
   install.sh entrypoint.sh Dockerfile README.md
```

Đủ 8 mục là bundle hoàn chỉnh.

Kiểm thật thì giải nén tarball ra một thư mục khác và chạy `./install.sh` với
`ANALYTIX_HOME` tạm — bộ cài tự khẳng định theme nạp được và tên sản phẩm đúng.

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|:---|:---|:---|
| `src/ has uncommitted changes` | `src/` còn thay đổi chưa commit | Commit trước. Đây là **chủ ý**: wheel mang mã băm git của nguồn, nên nguồn phải ở trạng thái xác định được |
| Báo tên wheel không hợp lệ | Tên không khớp `apache_superset-*-py3-none-any.whl` | Truyền đúng tệp wheel, không truyền thư mục |
| Thiếu tham số wheel | Gọi script không có đối số | `ship/make_bundle.sh <đường-dẫn-wheel>` |
| `ship/vendor/ was cut from X but the wheel is Y` | Wheel khác thế hệ với bản sao trong `ship/vendor/` | Làm mới `ship/vendor/` theo `ship/vendor/README.md`, rồi sửa `CUT-FROM` |
| `ship/vendor/requirements/base.txt is missing` | Không có `src/` mà `ship/vendor/` cũng thiếu | Lấy lại hai mảnh đó — `ship/vendor/README.md` ghi cách |
| Bundle cài được nhưng mất thương hiệu | `workspace_x_theme.py` không được chép vào | Kiểm `theme/workspace_x_theme.py` có trong mã nguồn |

:::caution[Vì sao nó từ chối `src/` bẩn]
Wheel mang theo mã băm git của nguồn đã build ra nó. `src/` còn thay đổi chưa
commit thì mã băm đó mô tả một trạng thái không ai lấy lại được — và khi khách
báo lỗi, bạn không dựng lại được đúng bản họ đang chạy.

Đây là chốt đáng giữ, đừng tìm cách đi vòng.
:::

## Giao cho người khác

Gửi tarball kèm hai câu:

```bash
tar xzf analytix-<bản>.tar.gz && cd analytix-<bản>

# cài thẳng lên máy — cần Python 3.10/3.11/3.12
./install.sh

# hoặc dựng container — không cần Python
docker build -t analytix:<bản> -f Dockerfile .
docker run -p 8088:8088 analytix:<bản>
```

Bundle có sẵn `README.md` sinh tự động, nói đúng hai đường trên cộng với lý do
thứ tự cài đặt quan trọng.

Nhắc người nhận hai điều `README.md` trong bundle **không** nói:

1. **Mật khẩu quản trị in một lần.** Không lưu là phải đặt lại.
2. **Chỉ query được SQLite.** Dữ liệu thật ở Postgres/MySQL/Trino thì phải
   [cài driver](./them-driver-du-lieu.md).

:::danger[Cả hai đường trên đều cần mạng ra PyPI]
Bundle mang theo **danh sách** 156 gói đã ghim, không mang theo chính các gói đó.
`install.sh` và `docker build` đều phân giải danh sách ấy với PyPI, nên máy đích
không ra được internet là cả hai dừng giữa chừng.

Máy đích không có mạng thì cắt thêm một bước nữa:

```bash
ship/make_image_release.sh /var/tmp/analytix-ship/analytix-<bản>
```

Ra `analytix-<bản>-offline/` khoảng 433 MB — ảnh đã dựng sẵn, người nhận chỉ
`./chay.sh`. Xem [Cài trên máy không có
internet](./cai-tren-may-khong-co-mang.md).
:::

## Liên quan

- [Cài trên máy không có internet](./cai-tren-may-khong-co-mang.md)
- [Cài thực trên máy](./cai-dat-tren-may.md)
- [Cài bằng Docker](./cai-dat-bang-docker.md)
- [Thêm driver cho nguồn dữ liệu](./them-driver-du-lieu.md)
- [AnalytiX là gì](../explanation/analytix-la-gi.md)
