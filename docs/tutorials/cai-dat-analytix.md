---
title: Cài AnalytiX lần đầu
sidebar_position: 1
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Cài AnalytiX lần đầu

Bài này đưa bạn từ chỗ chưa có gì tới một AnalytiX đang chạy, đăng nhập được,
và có một biểu đồ thật. Khoảng 20 phút, phần lớn là chờ tải.

Dành cho người chưa từng cài AnalytiX. Cần có trước: **Docker**, và bản đóng gói
`analytix-<bản>.tar.gz` (hoặc thư mục bundle đã giải nén).

Bài này đi **đường Docker** vì nó ít thứ phải chuẩn bị nhất. Muốn cài thẳng lên
máy thì xem [Cài thực trên máy](../how-to/cai-dat-tren-may.md).

## Kết quả cuối cùng

| Kiểm cái gì | Giá trị đúng |
|:---|:---|
| Mở `http://127.0.0.1:8088` | Trang đăng nhập AnalytiX |
| Góc trên trái | Logo và chữ **AnalytiX** |
| `docker ps` | trạng thái `healthy` |
| Đăng nhập | vào được bằng tài khoản `admin` |
| Có một biểu đồ | đọc từ tệp SQLite bạn tự tạo |

## Bước 1 — Giải nén bản đóng gói

```bash
tar xzf analytix-<bản>.tar.gz
cd analytix-<bản>
ls
```

**Tự kiểm tra:** thấy `install.sh`, `Dockerfile`, `entrypoint.sh`,
`workspace_x_theme.py`, `requirements/`, `superset-core/`, và một tệp
`apache_superset-<bản>-py3-none-any.whl`.

Thiếu bất kỳ thứ nào thì bản đóng gói không đầy đủ — bộ cài sẽ dừng và nói rõ
thiếu gì, nhưng biết trước thì đỡ mất thời gian.

## Bước 2 — Dựng ảnh container

```bash
docker build -t analytix:thu-nghiem -f Dockerfile .
```

Lần đầu mất vài phút: nó tải Python 3.12, rồi cài **156 gói đã ghim phiên bản**,
rồi cài wheel của AnalytiX.

**Tự kiểm tra:** `docker images analytix` thấy ảnh vừa dựng, kích thước
khoảng **1,6 GB**.

:::note[Vì sao nó lớn]
Phần lớn là bộ thư viện Python đã ghim phiên bản cộng với giao diện web đã biên
dịch. Ảnh dựng một stage nên các lớp trung gian vẫn nằm trong đó.
:::

## Bước 3 — Chạy lần đầu

Gắn một volume để dữ liệu sống qua lần chạy sau:

```bash
docker run -d --name analytix \
  -p 8088:8088 \
  -v analytix-data:/app/analytix \
  analytix:thu-nghiem
```

Xem nó khởi động:

```bash
docker logs -f analytix
```

Lần chạy đầu nó tự làm bốn việc: sinh khoá bí mật, tạo cơ sở dữ liệu metadata,
tạo tài khoản quản trị, nạp vai trò và quyền.

:::danger[Mật khẩu chỉ in MỘT LẦN]
Trong log sẽ có một dòng dạng:

```
[analytix] administrator admin password: <chuỗi-ngẫu-nhiên>
```

**Lưu nó ngay.** Nó không được ghi vào tệp nào, và lần chạy sau sẽ không in lại
vì tài khoản đã tồn tại. Mất thì phải đặt lại mật khẩu bằng dòng lệnh.

Muốn tự chọn mật khẩu thì thêm `-e ANALYTIX_ADMIN_PASSWORD=...` vào lệnh `docker
run` ở trên — nhưng khi đó nó nằm trong lịch sử shell của bạn.
:::

**Tự kiểm tra:** `docker ps` thấy cột trạng thái là `healthy` (chờ tới khoảng
90 giây — container có khoảng thời gian khởi động trước khi bắt đầu kiểm).

## Bước 4 — Đăng nhập

Mở `http://127.0.0.1:8088`, đăng nhập bằng `admin` và mật khẩu ở bước 3.

**Tự kiểm tra:** góc trên trái là logo và chữ **AnalytiX** — không phải
"Superset". Nếu thấy "Superset" thì theme chưa được nạp.

## Bước 5 — Tạo một tệp dữ liệu để thử

AnalytiX cài xong **chỉ query được SQLite**. Tạo một tệp nhỏ ngay trong
container:

```bash
docker exec -i analytix python - <<'PY'
import sqlite3
c = sqlite3.connect('/app/analytix/thu.db')
c.execute("create table if not exists ban_hang (thang text, khu_vuc text, doanh_thu integer)")
c.execute("delete from ban_hang")
c.executemany("insert into ban_hang values (?,?,?)", [
    ('2026-01','Bắc',120),('2026-01','Nam',95),
    ('2026-02','Bắc',140),('2026-02','Nam',88),
    ('2026-03','Bắc',175),('2026-03','Nam',130),
])
c.commit()
print('so dong:', c.execute('select count(*) from ban_hang').fetchone()[0])
PY
```

**Tự kiểm tra:** in ra `so dong: 6`.

## Bước 6 — Khai báo kết nối dữ liệu

Trong AnalytiX: **Settings → Database Connections → + Database**, chọn
**SQLite**, điền chuỗi kết nối:

```
sqlite:////app/analytix/thu.db
```

:::caution[Bốn dấu gạch chéo]
`sqlite:////` — ba dấu của giao thức cộng một dấu mở đầu đường dẫn tuyệt đối.
Ba dấu là đường dẫn tương đối và sẽ không tìm thấy tệp.
:::

Bật **Expose in SQL Lab**, và **để nguyên** *Allow DML* ở trạng thái tắt.

**Tự kiểm tra:** bấm **Test Connection** ra thông báo thành công.

## Bước 7 — Tạo dataset

**Datasets → + Dataset**, chọn kết nối vừa tạo, schema `main`, bảng
`ban_hang`. Lưu.

**Tự kiểm tra:** dataset hiện trong danh sách với 3 cột.

## Bước 8 — Dựng biểu đồ

**Charts → + Chart**, chọn dataset `ban_hang`, kiểu **Bar Chart**:

- Trục X: `thang`
- Phép đo: `SUM(doanh_thu)`
- Tách chuỗi: `khu_vuc`

Bấm **Create chart**, rồi **Save** với tên "Doanh thu theo tháng".

**Tự kiểm tra:** 3 cột tháng, mỗi cột tách hai màu theo khu vực. Tổng tháng 3 là
**305** (175 + 130), và tháng 3 cao nhất.

## Tự kiểm — bảng tổng hợp

| Kiểm cái gì | Giá trị đúng |
|:---|:---|
| `docker ps` trạng thái | `healthy` |
| Thương hiệu góc trên trái | AnalytiX |
| Số dòng trong `ban_hang` | 6 |
| Tổng doanh thu tháng 3 | 305 |
| Tháng cao nhất | 2026-03 |

Khớp hết là bạn đã đi qua đủ bốn lớp: kết nối → dataset → biểu đồ, và hiểu vì
sao thứ tự đó không nhảy cóc được.

## Dọn dẹp

```bash
docker rm -f analytix
docker volume rm analytix-data      # xoá CẢ database metadata
docker rmi analytix:thu-nghiem
```

Giữ volume lại nếu còn muốn làm tiếp — nó chứa cả khoá bí mật và tài khoản của
bạn.

## Bước tiếp theo

- [Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md) — **gần như
  chắc chắn bạn cần việc này**, vì dữ liệu thật không nằm trong SQLite
- [Vì sao bản cài chưa sẵn sàng cho môi trường thật](../explanation/chua-san-sang-cho-production.md) — đọc trước khi cho người khác dùng
- [Cài thực trên máy](../how-to/cai-dat-tren-may.md) — nếu không muốn dùng Docker
- [Bật dịch vụ MCP](../how-to/bat-mcp.md) — hỏi bằng lời, nó tự dựng biểu đồ
