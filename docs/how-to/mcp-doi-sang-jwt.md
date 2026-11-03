---
title: Đổi xác thực MCP sang JWT
sidebar_position: 11
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Đổi xác thực MCP sang JWT

Thay chế độ dev (không kiểm token) bằng xác thực JWT thật. **Bắt buộc làm trước
khi để dịch vụ MCP nghe ngoài `127.0.0.1`.**

Dành cho người quản trị. Cần có trước: dịch vụ MCP đã chạy được ở chế độ dev
(xem [Bật dịch vụ MCP](./bat-mcp.md)), và đã chọn được nơi phát token.

:::danger[Chế độ dev không kiểm token]
`MCP_AUTH_ENABLED = False` nghĩa là dịch vụ **không xác thực gì cả** — mọi lời
gọi chạy dưới tài khoản ghi ở `MCP_DEV_USERNAME`. Nó an toàn ở máy cá nhân chỉ
vì cổng nghe trên `127.0.0.1`. Mở ra mạng mà giữ cấu hình đó là mở quyền của tài
khoản đó cho bất kỳ ai gọi tới được.
:::

## Chọn một trong ba cách

| Cách | Khi nào dùng | Biến cần đặt |
|:---|:---|:---|
| **HS256 — khoá chia sẻ** | Chỉ mình bạn phát token; đơn giản nhất | `MCP_JWT_SECRET` |
| **RS256 — khoá công khai tĩnh** | Có cặp khoá riêng, không có máy chủ JWKS | `MCP_JWT_PUBLIC_KEY` |
| **RS256 — JWKS** | Đã có hệ thống định danh tập trung (OIDC) | `MCP_JWKS_URI` |

Chưa có hệ thống định danh thì chọn **HS256**. Nó đủ an toàn khi khoá được giữ
kín, và không thêm thành phần nào phải vận hành.

## Các bước

### 1. Sinh khoá

```bash
openssl rand -hex 32
```

Cất vào nơi chỉ `root` đọc được, **không** ghi vào `superset_config.py` dưới
dạng chữ thô nếu file đó đi vào git. Đọc từ biến môi trường.

### 2. Sửa cấu hình

```python
import os

# Bật xác thực. Hai biến này loại trừ nhau — bật cái này thì
# MCP_DEV_USERNAME không còn tác dụng.
MCP_AUTH_ENABLED = True

MCP_JWT_ALGORITHM = "HS256"
MCP_JWT_SECRET = os.environ["MCP_JWT_SECRET"]

# Nên đặt cả hai. Thiếu thì token của hệ thống khác cũng được nhận.
MCP_JWT_ISSUER = "<ten-noi-phat-token>"
MCP_JWT_AUDIENCE = "<ten-dich-vu-mcp-cua-ban>"

# Phân quyền của AnalytiX vẫn là tầng quyết định thật — giữ bật.
MCP_RBAC_ENABLED = True
```

Dùng RS256 thì đổi `MCP_JWT_ALGORITHM = "RS256"` và thay `MCP_JWT_SECRET` bằng
`MCP_JWT_PUBLIC_KEY` hoặc `MCP_JWKS_URI`.

### 3. Phát token với đủ claim

Token phải mang: `iss`, `sub`, `aud`, `exp`, `iat`. Có thể thêm `email`,
`username`, `scopes`.

`sub` (hoặc `username`/`email`) là thứ ánh xạ sang tài khoản trong công cụ trực
quan — tài khoản đó phải **tồn tại** và có đúng quyền cần thiết.

Đặt `exp` ngắn. Token MCP là token máy-gọi-máy, không cần sống lâu.

### 4. (Tuỳ chọn) Bắt buộc scope

```python
MCP_REQUIRED_SCOPES = ["superset:read"]
```

:::note[Scope gác ở tầng token, không phân quyền từng công cụ]
Biến này **được thực thi thật**: token thiếu scope trong danh sách sẽ bị từ chối
hoàn toàn, không vào được dịch vụ. Nhưng nó **không** quyết định token đó gọi
được công cụ nào — việc đó do phân quyền của AnalytiX làm. Đừng dùng
scope thay cho vai trò.
:::

### 5. Khởi động lại và gửi token

Client phải gửi header:

```
Authorization: Bearer <token>
```

## Kiểm tra là đã đúng

Bốn phép thử, theo thứ tự:

| Thử gì | Kết quả đúng |
|:---|:---|
| Gọi **không** có header `Authorization` | Bị từ chối |
| Gọi với token **sai khoá** | Bị từ chối |
| Gọi với token **đã hết hạn** (`exp` ở quá khứ) | Bị từ chối |
| Gọi với token hợp lệ | `health_check` trả về `healthy` |

Phép thử đầu quan trọng nhất. Nếu gọi **không** token mà vẫn chạy, `MCP_AUTH_ENABLED`
chưa có tác dụng — rất có thể cấu hình chưa được nạp lại.

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|:---|:---|:---|
| Không token mà vẫn gọi được | Cấu hình chưa nạp lại, hoặc `MCP_AUTH_ENABLED` bị gán lại ở dưới trong file | Khởi động lại dịch vụ; kiểm xem biến có bị ghi đè lần hai |
| Token đúng nhưng vẫn bị từ chối | Lệch `iss` hoặc `aud` giữa nơi phát và nơi nhận | So đúng từng chữ hai giá trị đó |
| Bị từ chối mà không rõ lý do | Thông báo lỗi cố ý không nói chi tiết | Bật tạm `MCP_JWT_DEBUG_ERRORS = True`, đọc log, **tắt lại ngay sau khi xong** |
| Xác thực qua nhưng gọi công cụ báo không có quyền | `sub` ánh xạ sang tài khoản không đủ quyền, hoặc tài khoản không tồn tại | Tạo/sửa quyền tài khoản đó trong AnalytiX |
| Đặt `MCP_DEV_USERNAME` mà không có tác dụng | Hai chế độ loại trừ nhau | Bỏ `MCP_AUTH_ENABLED = True` nếu thật sự muốn chế độ dev |
| Muốn dùng vé khách (guest token) cho MCP | Bản 6.1.0 **chưa có** tính năng này | Dùng JWT; vé khách cho MCP là bản sau |

## Liên quan

- [Bật dịch vụ MCP](./bat-mcp.md)
- [Cấu hình MCP](../reference/mcp-cau-hinh.md) — bảng đầy đủ các biến
- [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md)
- [Vì sao nhúng dashboard cần "vé khách"](../explanation/vi-sao-nhung-can-ve-khach.md) — cơ chế token khác, cho việc nhúng
