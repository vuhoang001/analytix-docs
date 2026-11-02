---
title: Tham số iframe khi nhúng dashboard
sidebar_position: 6
---

# Tham số iframe khi nhúng dashboard

```html
<iframe
  src="<địa-chỉ-trực-quan-của-bạn>/dashboard/<mã-trang>/?standalone=2&show_filters=0"
  width="100%"
  height="<chiều-cao-đã-đo>"
  style="border:0; min-width:1200px"
></iframe>
```

| Tham số | Vì sao cần |
|---|---|
| `standalone=2` | Ẩn **cả** thanh điều hướng **và** thanh tiêu đề của AnalytiX. Dùng `standalone=1` sẽ còn thanh tiêu đề, chồng lên tiêu đề của chính trang chứa nó — thành hai tiêu đề |
| `show_filters=0` | Ẩn thanh bộ lọc rỗng ở bên trái khi trang không có bộ lọc nào cần hiển thị |
| `height` cố định | Khung iframe khác tên miền **không tự co giãn theo nội dung**. Phải đo đúng chiều cao thật của trang và ghi cố định, nếu không trang sẽ bị cắt hoặc thừa khoảng trắng |
| `min-width:1200px` | Dưới 1200px bố cục dồn thành 2 cột và sinh thanh cuộn bên trong khung |

Cách dùng đầy đủ xem ở **Cách làm → Nhúng dashboard bằng iframe đơn giản**.
