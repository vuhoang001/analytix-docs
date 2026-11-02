---
title: Ghim báo cáo quan trọng lên menu
sidebar_position: 7
---

# Ghim báo cáo quan trọng lên menu

Để người làm nghiệp vụ không cần nhớ tên bảng hay tên dashboard kỹ thuật —
ghim thẳng một báo cáo quan trọng thành lối tắt có tên và biểu tượng riêng
trên menu.

## Các bước

1. Bấm nút **Báo cáo** ở thanh bên trái.
2. Trong hộp thoại **Quản lý báo cáo**, lọc theo [lớp dữ liệu](../explanation/analytix-la-gi.md)
   (`raw`/`bronze`/`silver`/`gold`) hoặc theo loại (bảng/mô hình/dashboard).
3. Chọn một mục có sẵn — một bảng trong Danh mục, hoặc một dashboard đã dựng.
4. Đặt **Tên hiển thị ở thanh bên** (tên dễ hiểu cho người nghiệp vụ, không
   cần trùng tên kỹ thuật) và chọn một **biểu tượng** phù hợp.
5. Bấm **Thêm**.

Mục mới xuất hiện ngay trên menu, dưới nhóm "Báo cáo" — ai dùng Console
cũng thấy.

## Lưu ý

Nếu lọc theo lớp `gold` mà không thấy gì để chọn, nghĩa là chưa có luồng xử
lý nào (xem **Dựng một luồng xử lý dữ liệu**) chạy ra tới lớp đó. Lúc này
chọn tạm từ lớp `raw`, hoặc chọn một dashboard đã dựng thay vì một bảng.
