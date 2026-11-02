# Site tài liệu AnalytiX

AnalytiX là công cụ trực quan hoá dữ liệu: nối vào database, viết truy vấn,
dựng biểu đồ, xếp thành trang báo cáo, nhúng vào hệ thống khác.

Repo này chứa **site tài liệu** của nó — Docusaurus, tiếng Việt, tổ chức theo
khung [Diátaxis](https://diataxis.fr/).

## Chạy ở máy

```bash
npm install
npm run start          # http://localhost:3000
npm run build
```

## Bốn ngăn

Chia theo **mục đích người đọc**, không theo thành phần hệ thống:

| Ngăn | Người đọc đang | Thư mục |
|:---|:---|:---|
| Học theo hướng dẫn | mới, cần dắt tay từ đầu | `docs/tutorials/` |
| Cách làm | đã cài được, cần làm xong một việc | `docs/how-to/` |
| Tra cứu | đã biết tên thứ cần tìm | `docs/reference/` |
| Giải thích | muốn hiểu vì sao | `docs/explanation/` |

## Phát hành

GitHub Actions (`.github/workflows/pages.yml`) build và phát hành qua GitHub
Pages mỗi lần push vào `main`.

Trước khi phát hành, workflow chạy `./kiem-bi-mat.sh` để chắc chắn bản build
không chứa định danh thật của bất kỳ bản triển khai nào. Danh sách mẫu **không**
nằm trong repo — nó được cấp qua GitHub Secret `SECRET_AUDIT_PATTERNS`. Thiếu
secret đó thì workflow **hỏng**, không phải bỏ qua: không kiểm được thì coi như
chưa kiểm.

Kiểm ở máy:

```bash
npm run build
SECRET_PATTERNS=/đường/dẫn/tới/mẫu ./kiem-bi-mat.sh
```

## Đóng góp

Mỗi ngăn có mục bắt buộc riêng — ví dụ *"Lỗi hay gặp"* của How-to, *"Điểm yếu"*
của Explanation. Giữ đúng khuôn đó khi thêm trang; một trang How-to không có mục
lỗi là trang thiếu đúng phần người đọc cần nhất.

Frontmatter bắt buộc:

```yaml
---
title: <trùng với H1>
sidebar_position: <số, không trùng trong cùng ngăn>
last_update:
  date: "YYYY-MM-DD"
  author: <tên>
---
```

`last_update` là bắt buộc vì tài liệu hạ tầng lệch thực tế rất nhanh — trang càng
cũ người đọc càng cần biết nó cũ.

**Không viết vào trang:** IP thật, UUID thật, tên miền thật, tài khoản, mật khẩu.
Dùng ô giữ chỗ dạng `<địa-chỉ-analytix>`.
