---
title: Vì sao bản cài chưa sẵn sàng cho môi trường thật
sidebar_position: 2
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Vì sao bản cài chưa sẵn sàng cho môi trường thật

Dành cho người định đưa AnalytiX cho nhiều người dùng. Đọc trước khi mở nó ra
ngoài máy của bạn.

## Câu trả lời ngắn

Bộ cài dựng được **một bản chạy đúng, nhanh, một người dùng**. Nó cố ý **không**
dựng những thứ một hệ thống nhiều người dùng cần: web server chịu tải, HTTPS,
bộ đệm, tiến trình chạy việc nền, và một database metadata chịu được nhiều ghi
đồng thời.

Dùng để thử, để dựng báo cáo, để một người làm việc — đủ. Mở cho cả phòng dùng —
chưa đủ, và sáu chỗ dưới đây là lý do.

## Vấn đề

Bộ cài có một mục tiêu rõ: `./install.sh` hoặc `docker run` là ra một bản chạy
được, không hỏi gì thêm, không cần dịch vụ phụ. Mục tiêu đó va với mục tiêu
"chịu tải nhiều người dùng" — thứ hai đòi thêm ít nhất bốn thành phần nữa, mỗi
thành phần là một thứ phải cấu hình và phải trông.

Bộ cài chọn mục tiêu thứ nhất. Đó là lựa chọn đúng cho việc *giao sản phẩm*, và
là lý do bạn phải tự làm phần còn lại.

## Sáu chỗ cụ thể

### 1. Web server là bản dành cho phát triển

Cả hai đường cài đều chạy `superset run --with-threads` — đó là web server tích
hợp của Flask, bản thân nó in cảnh báo *"This is a development server. Do not use
it in a production deployment."*

`gunicorn` **có** trong bộ gói đã cài, nhưng không script nào gọi nó. Đưa vào
dùng thật thì chạy AnalytiX bằng gunicorn và đặt nginx phía trước.

### 2. Không có HTTPS

Không reverse proxy, không chứng chỉ. Đăng nhập đi qua mạng dưới dạng không mã
hoá. Trong một mạng nội bộ tin cậy thì tạm được; qua bất cứ đường nào khác thì
không.

### 3. Không có tiến trình chạy việc nền

Không có worker, không có hàng đợi. Hệ quả cụ thể — **các tính năng này không
hoạt động** dù giao diện vẫn hiện chúng:

- Cảnh báo và gửi báo cáo theo lịch
- Truy vấn bất đồng bộ (câu nặng sẽ chặn request)
- Ảnh thu nhỏ của biểu đồ và trang báo cáo

Giao diện không nói chúng đang tắt, nên người dùng sẽ bật rồi chờ mãi không thấy
gì.

### 4. Không có bộ đệm

Cấu hình đệm để ở mặc định thượng nguồn là **không đệm gì**. Mỗi lần mở một trang
báo cáo là mọi biểu đồ trên đó truy vấn lại database.

Mười người cùng mở một trang có tám biểu đồ là tám mươi truy vấn.

### 5. SQLite làm nơi lưu metadata

Database metadata là một tệp SQLite. SQLite cho **một người ghi tại một thời
điểm**, và AnalytiX ghi vào đó liên tục — nhật ký truy vấn, trạng thái bộ lọc.

Vài người dùng thì không thấy gì. Nhiều người dùng đồng thời thì bắt đầu gặp lỗi
khoá database. Chuyển sang PostgreSQL là cách giải — nhưng
[driver Postgres không có sẵn](../how-to/them-driver-du-lieu.md), phải cài thêm.

### 6. Container chạy bằng `root`

Ảnh không khai `USER`. Trong môi trường thật thì chạy với user thường và chỉ cấp
quyền ghi vào thư mục dữ liệu.

## Thứ bộ cài làm ĐÚNG về bảo mật

Để công bằng — có ba chỗ nó làm tốt hơn mặc định thường gặp:

**Không có tài khoản mặc định.** Mật khẩu quản trị sinh ngẫu nhiên và in **một
lần**, không ghi vào tệp nào. Không có `admin/admin` để bot dò.

**Khoá bí mật sinh riêng cho từng bản cài**, lưu ở tệp quyền `600`, và **không
bị sinh lại** khi cài lần hai. Nhiều sản phẩm dùng chung một khoá mặc định công
khai — đó là lỗi nặng, và bộ cài này không mắc.

**Bản cài tay nghe `127.0.0.1`**, không phải `0.0.0.0`. Phải cố ý mới mở ra mạng
được, và chỗ đổi có kèm ghi chú nhắc đổi mật khẩu trước.

## Cần gì để dùng thật

Thứ tự theo mức độ quan trọng:

| # | Việc | Vì sao |
|:--|:---|:---|
| 1 | nginx + HTTPS phía trước | Mật khẩu không đi qua mạng dạng thô |
| 2 | gunicorn thay web server phát triển | Chịu được nhiều request đồng thời |
| 3 | PostgreSQL cho metadata | Bỏ giới hạn một-người-ghi của SQLite |
| 4 | unit `systemd` | Tự chạy lại sau khi khởi động máy, sau khi sập |
| 5 | Redis + worker nền | Mở lại cảnh báo, báo cáo theo lịch, ảnh thu nhỏ |
| 6 | Sao lưu `superset.db` và `superset_config.py` | **Mất khoá bí mật là hỏng mọi session và mọi dashboard đã nhúng** |

Hạng 1–4 là bắt buộc. Hạng 5 chỉ cần nếu bạn dùng những tính năng đó. Hạng 6 làm
ngay từ ngày đầu, không phải sau khi mất.

## Điểm yếu của chính cách nhìn này

Danh sách trên **chưa được kiểm thật** ở đây — nó suy ra từ việc đọc bộ cài và
cấu hình mặc định, không phải từ một lần chạy tải thật. Con số cụ thể (bao nhiêu
người dùng đồng thời thì SQLite bắt đầu hỏng) phụ thuộc cách dùng, và cần đo mới
biết.

Và bản thân "sẵn sàng cho môi trường thật" không có một mốc duy nhất: mười người
trong một mạng nội bộ khác hẳn một nghìn người qua Internet.

## Liên quan

- [AnalytiX là gì](./analytix-la-gi.md)
- [Cài thực trên máy](../how-to/cai-dat-tren-may.md)
- [Cài bằng Docker](../how-to/cai-dat-bang-docker.md)
- [Thêm driver cho nguồn dữ liệu](../how-to/them-driver-du-lieu.md)
- [Yêu cầu hệ thống](../reference/yeu-cau-he-thong.md)
