---
title: Dựng dashboard theo phong cách tuỳ chỉnh (Table-viz + HTML trong SQL)
sidebar_position: 7
---

# Dựng dashboard theo phong cách tuỳ chỉnh

Dashboard mặc định dùng các loại biểu đồ có sẵn (Bar, Pie, Big Number…). Khi
cần một bố cục tuỳ chỉnh hơn — ví dụ dải ô số liệu lớn có màu theo trạng
thái — kỹ thuật dưới đây dựng toàn bộ bằng chuột, không cần script, chỉ cần
dán một câu SQL.

## Vì sao dùng Table-viz thay vì Handlebars

Loại biểu đồ **Handlebars** biên dịch template bằng `new Function()` trong
trình duyệt — nếu AnalytiX phục vụ Content-Security-Policy không
cho phép `'unsafe-eval'`, mọi biểu đồ Handlebars sẽ hiện lỗi CSP thay vì nội
dung. Loại biểu đồ **Table** thì khác: nó render HTML của từng ô qua
`dangerouslySetInnerHTML`, giữ nguyên cả `class` lẫn `style` — không có
`eval` nào liên quan. Vì vậy: **dựng markup (HTML) ngay trong câu SQL, Table
chỉ việc vẽ ra.**

## Các bước

1. **Viết SQL dựng HTML.** Trong SQL Lab, viết một câu truy vấn trả về đúng
   một dòng, một cột — cột đó là một chuỗi HTML đã dựng sẵn (ví dụ một dải
   `<div>` có class và style cho từng ô số liệu).
2. **Lưu thành dataset.** Dùng đúng nút lưu dataset (không nhầm với nút lưu
   câu truy vấn — hai nút khác nhau, nhầm nút là lỗi hay gặp nhất ở bước
   này).
3. **Dựng biểu đồ kiểu Table.** Mở màn hình chỉnh biểu đồ (Explore), chọn
   kiểu **Table**, ở tab Data chọn chế độ **Raw records**, kéo đúng cột HTML
   vào ô Columns.
4. **Bật hiển thị HTML.** Ở tab Customize, tích ô **Render columns in HTML
   format**, bấm cập nhật rồi lưu. Thiếu bước này, ô sẽ hiện nguyên văn thẻ
   HTML thay vì bản vẽ đẹp.
5. **Xếp vào dashboard.** Kéo biểu đồ vào trang dashboard như bình thường.

## Chiều cao khối — đặt đúng số ngay từ đầu

Mỗi khối biểu đồ có chiều cao **cố định**, nội dung không đẩy nó cao ra
được. Cao quá thì hoặc sinh thanh cuộn bên trong, hoặc bị cắt — và trang
**vẫn trông bình thường** cho tới khi có người cần đọc phần dưới cùng.

Công thức ước lượng, đo trên DOM thật của một dashboard:

```
chiều cao khối (đơn vị lưới) = ceil( (58 + tiêu_đề_bảng + nội_dung + 29 + 16) / 8 )

  58  khoảng đệm mặc định bao quanh một khối biểu đồ
  29  tiêu đề biểu đồ — chế độ SỬA đưa nó vào LẠI trong khối (chế độ xem thì không)
  16  dự phòng cho một dòng chữ bị xuống hàng
   8  một đơn vị lưới dashboard thường đúng bằng 8px
```

Ví dụ áp dụng: dải ô số liệu lớn thường cần khoảng 32 đơn vị lưới, dải thẻ
trạng thái nhỏ hơn cần khoảng 40 đơn vị, bảng chi tiết 9 dòng cần khoảng 83
đơn vị — đo lại trên nội dung thật của bạn thay vì dùng số cố định, vì chiều
cao phụ thuộc vào kiểu chữ và độ dài nội dung thật.

## Ba điều làm hỏng trang mà nhìn không ra

1. **Đừng ẩn dòng tiêu đề bảng bằng `display: none`.** Đặt lên `<thead>`
   hay `<colgroup>` (hoặc `height: 0` trên `th`) sẽ phá bước đo cột tự động
   của bảng, để nguyên phần thân ở `visibility: hidden` — biểu đồ trắng
   trơn dù markup vẫn còn đủ nội dung. Nếu muốn ẩn hàng tiêu đề, chỉ **làm
   mất màu** nó (ví dụ `color: transparent`), không đụng vào kích thước.
2. **Chế độ sửa tốn thêm khoảng 29px** cho tiêu đề biểu đồ bị đưa vào lại
   trong khối. Một khối vừa khít lúc xem sẽ cuộn ngay khi mở ra sửa — công
   thức ở trên đã tính sẵn phần này.
3. **`raw_value` không phải số để hiển thị.** Đó là chữ thô, chưa quy đổi —
   xem [Viết SQL an toàn với cột dạng chữ](./viet-sql-an-toan.md) để biết
   cách ép kiểu đúng trước khi đưa vào HTML hiển thị.

## Tự tạo theme CSS riêng của bạn

Phần hình thức chung (màu nền, phông chữ) nằm ở mục **Edit properties →
Styling** của dashboard. Bạn có thể tự viết một bộ CSS riêng cho tổ chức
mình (ví dụ định nghĩa các class `.so-lieu-tile`, `.trang-thai-pill` dùng
chung cho mọi dashboard) rồi dán vào ô CSS tuỳ chỉnh ở đó — không cần công
cụ nào khác ngoài trình duyệt. Một khi đã có một dashboard mẫu ưng ý, lưu
lại CSS đó để dán lại cho các dashboard khác cùng tổ chức, cho thống nhất
hình thức.

## Kiểm tra trước khi công bố

Vì giao diện vẽ hoàn toàn ở phía trình duyệt, cách chắc chắn nhất để biết bố
cục đúng hay sai là **mở thật và nhìn** — đặc biệt kiểm tra cả chế độ xem
lẫn chế độ sửa, vì một khối vừa khít ở chế độ xem có thể cuộn ở chế độ sửa
(xem mục "Ba điều làm hỏng trang" ở trên).
