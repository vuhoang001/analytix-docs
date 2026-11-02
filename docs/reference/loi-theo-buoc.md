---
title: Lỗi theo bước
sidebar_position: 8
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Lỗi theo bước

Tra thông báo lỗi gặp khi làm [Từ database tới biểu đồ](../tutorials/tu-database-toi-bieu-do.md).
Bảng đầu tra nhanh theo số bước; bốn bảng sau đầy đủ hơn, chia theo lớp.

## Tra nhanh theo bước

| Bước | Thông báo | Sửa |
|---|---|---|
| 3 | `Could not connect to database` | `Host` phải là `127.0.0.1` |
| 3 | `Please re-enter the password` mà mật khẩu đúng | Thiếu driver Postgres — xem Ghi chú bên dưới |
| 3 | Nút *Connect* mờ | Bấm `Tab` để rời ô cuối |
| 5 | Panel trái không thấy schema | Đổi database sang `Demo Postgres` |
| 6 | `relation "chi_tieu" does not exist` | Viết đủ `mart.chi_tieu` |
| 6 | Ra 262 dòng thay vì 131 | Thiếu `WHERE cap = 'xa'` |
| 9 | `DB engine Error` trống | Bộ lọc lưu khi chưa chọn giá trị |
| 12 | Bảng ra một dòng | Chuyển *Query mode* sang *Raw records* |
| 14 | Bộ lọc không tác động | Biểu đồ đọc dataset khác |

## Lớp Database — Bước 1 đến 4

| Thông báo | Nguyên nhân | Sửa |
|---|---|---|
| `Could not connect to database` | Sai `Host`. Điền địa chỉ LAN thay vì `127.0.0.1` | Sửa `Host` thành `127.0.0.1` |
| `password authentication failed` | Sai mật khẩu, hoặc sai tên tài khoản | Đối chiếu lại với từ điển dữ liệu |
| `database "demo" does not exist` | Gõ nhầm tên database | Kiểm lại tên, phân biệt chữ hoa chữ thường |
| Nút `Connect` không sáng | Con trỏ còn nằm trong ô cuối | Bấm `Tab` hoặc click ra chỗ trống |
| Kết nối xong nhưng SQL Lab không thấy | Ô *Expose database in SQL Lab* bị tắt | Mở lại kết nối, vào tab Advanced, bật nó lên |



## Lớp Dataset — Bước 5 đến 7

| Hiện tượng | Nguyên nhân | Sửa |
|---|---|---|
| Panel trái không thấy schema nào | SQL Lab đang trỏ database khác | Bấm ô chọn database, đổi sang `Demo Postgres` |
| `relation "chi_tieu" does not exist` | Thiếu tên schema | Viết đủ `mart.chi_tieu` |
| Số dòng ra 262 thay vì 131 | Thiếu `WHERE cap = 'xa'` | Thêm điều kiện lọc cấp |
| `permission denied for schema` | Nối bằng tài khoản khác `analytix_ro` | Kiểm lại Username ở Phần 1 |
| Nút Save dataset mờ | Chưa chạy truy vấn lần nào | Bấm Run trước |



## Lớp Chart — Bước 8 đến 12

| Hiện tượng | Nguyên nhân | Sửa |
|---|---|---|
| `DB engine Error` không nói gì thêm | Bộ lọc được lưu khi chưa chọn giá trị | Xoá bộ lọc, làm lại, kiểm có giá trị trước khi bấm Save |
| Big Number ra số lạ | Bộ lọc chưa thu về một dòng | Xem `N rows` ở góc phải; phải là `1 row` |
| Biểu đồ cột chỉ có một cột | Quên khai X-axis | Thả một cột vào ô X-axis |
| Bảng ra đúng một dòng | Query mode đang là *Aggregate* | Chuyển sang *Raw records* |
| Tổng cột chồng lớn hơn số thật | Dùng ba cột chồng lấn nhau | Dùng `co_sach` + `xac_minh` + `chua_co` |
| Nút *Create chart* mờ | Thiếu một ô bắt buộc, có dấu chấm than đỏ | Tìm ô có dấu chấm than trong panel giữa |



## Lớp Dashboard — Bước 13 đến 15

| Hiện tượng | Nguyên nhân | Sửa |
|---|---|---|
| Bộ lọc không tác động lên một biểu đồ | Biểu đồ đó đọc dataset khác | Kiểm tab *Scoping*, hoặc khai thêm bộ lọc cho dataset kia |
| Ô lọc không có lựa chọn nào | Cột khai sai, hoặc dataset rỗng | Kiểm lại ô *Column* |
| Bảng bị cắt mất dòng cuối | Ô quá thấp | Vào *Edit dashboard*, kéo cạnh dưới ô xuống |
| Người khác không thấy trang | Vẫn ở trạng thái *Draft* | Bấm chữ *Draft* để chuyển sang *Published* |
| Người khác mở được trang nhưng biểu đồ lỗi | Họ không có quyền trên dataset | Nhờ quản trị cấp quyền đọc dataset |



## Ghi chú

**Lỗi mật khẩu giả.** Bản cài mặc định không mang driver Postgres. Thiếu nó thì
nút **Connect** quay một lúc rồi báo `Please re-enter the password` — một thông
báo sai hướng hoàn toàn. Nguyên nhân thật nằm trong log của container:

```
psycopg2.OperationalError: ... fe_sendauth: no password supplied
ModuleNotFoundError: No module named 'psycopg2'
```

Cài `psycopg2-binary` rồi khởi động lại — xem
[Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md).

**Bấm Connect một lần, chờ.** Bấm lần thứ hai khi lần đầu còn đang kiểm tham số
thì cú bấm đầu bị bỏ. Nút sáng lại mới là lúc nó rảnh.

**Hai điều tài liệu cũ nói mà bản 6.1.0 không còn đúng.** Bước 2 từng có ba ô
loại database (PostgreSQL, Presto, SQLite) — bản này hai ô, vì không kèm driver
Presto. Bước 9 từng tạo được dashboard mới bằng cách gõ tên chưa có vào ô *Add to
dashboard* — giờ nó trả `No data`, dashboard phải có sẵn.

## Liên quan

- [Từ database tới biểu đồ](../tutorials/tu-database-toi-bieu-do.md)
- [Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
- [Yêu cầu hệ thống](./yeu-cau-he-thong.md)
