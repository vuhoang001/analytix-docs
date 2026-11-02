---
title: Cài trên máy không có internet
sidebar_position: 3
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Cài trên máy không có internet

Trang này cài AnalytiX lên máy **không ra được internet**: mạng nội bộ kín, phòng
máy cách ly, hoặc chỉ đơn giản là chỗ không tin được đường ra ngoài. Dùng bản
phát hành dạng **ảnh Docker đã dựng sẵn** — máy đích không cần Python, không cần
PyPI, không cần registry nào.

Đừng dùng cách này khi máy đích có mạng bình thường: [Cài bằng
Docker](./cai-dat-bang-docker.md) và [Cài trên máy](./cai-dat-tren-may.md) cho
tệp nhỏ hơn nhiều.

Dành cho người triển khai. Cần có trước: máy đích đã cài Docker và tài khoản bạn
dùng chạy được `docker`; một thư mục phát hành `analytix-<bản>-offline/` chép
sang (USB, ổ mạng, bất cứ đường nào).

## Các bước

1. Trên **máy có mạng**, cắt bản phát hành:

   ```bash
   ship/make_bundle.sh <đường-dẫn-wheel>
   ship/make_image_release.sh /var/tmp/analytix-ship/analytix-<bản>
   ```

   Ra `/var/tmp/analytix-ship/analytix-<bản>-offline/`, khoảng **433 MB**.

2. Chép nguyên thư mục đó sang máy đích.

3. Trên **máy đích**, kiểm tệp không hỏng dọc đường:

   ```bash
   cd analytix-<bản>-offline
   sha256sum -c SHA256SUMS
   ```

4. Chạy:

   ```bash
   ./chay.sh
   ```

   Script nạp ảnh, dựng container, chờ sẵn sàng, rồi in địa chỉ và mật khẩu quản
   trị. Đổi cổng bằng `ANALYTIX_PORT=9000 ./chay.sh`.

🔴 **Mật khẩu quản trị chỉ in một lần.** Lưu ngay khi thấy.

## Kiểm tra là đã đúng

Mở địa chỉ script in ra và đăng nhập được là xong. Muốn chắc là nó thật sự không
cần mạng, chạy thử một container cắt hẳn đường ra:

```bash
docker run -d --network none --name thu-cach-ly analytix:<bản-với-dấu-gạch>
sleep 60
docker exec thu-cach-ly curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8088/health
```

Phải ra `200`. Dọn: `docker rm -f thu-cach-ly`.

:::note[Tên tag không có dấu `+`]
Docker không nhận dấu `+` trong tag, nên `6.1.0+foxai.18` thành
`analytix:6.1.0-foxai.18`. `chay.sh` tự biết, chỉ khi gõ tay mới phải để ý.
:::

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|---|---|---|
| `khong goi duoc Docker daemon` | Docker chưa chạy, hoặc tài khoản không thuộc nhóm `docker` | `sudo systemctl start docker`, rồi `sudo usermod -aG docker $USER` và đăng nhập lại |
| `thieu analytix-<bản>-image.tar.gz canh script nay` | Chép thiếu tệp, hoặc chạy `chay.sh` từ thư mục khác | Chép nguyên thư mục, `cd` vào đó rồi mới chạy |
| `sha256sum -c` báo `FAILED` | Tệp hỏng lúc chép | Chép lại. Đừng nạp ảnh hỏng — nó sẽ chết ở chỗ khó đoán |
| `exec format error` khi nạp | Ảnh dựng cho kiến trúc CPU khác | Ảnh đã lưu gắn với kiến trúc nó được dựng. Dựng lại trên máy cùng kiến trúc với máy đích |
| `qua 3 phut van chua san sang` | Máy yếu, lần khởi tạo đầu chạy migration lâu | `docker logs analytix` xem đang ở đâu; chạy lại `./chay.sh` |
| Mật khẩu không in ra | Tài khoản đã tạo từ lần chạy trước | Mật khẩu cũ vẫn dùng được. Mất thì xoá volume và làm lại: `docker rm -f analytix && docker volume rm analytix-data` |
| Cài xong chỉ thấy SQLite | Ảnh không mang driver nào khác | Máy không có mạng thì không cài thêm được. Phải dựng ảnh khác từ máy có mạng — xem [Thêm driver cho nguồn dữ liệu](./them-driver-du-lieu.md) |

## Liên quan

- [Đóng gói bản phát hành](./dong-goi-ban-phat-hanh.md) — bước cắt bundle đứng trước bước này
- [Yêu cầu hệ thống](../reference/yeu-cau-he-thong.md) — cái gì cần mạng, cái gì không
- [Cài bằng Docker](./cai-dat-bang-docker.md) — khi máy đích có mạng
