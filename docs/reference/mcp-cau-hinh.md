---
title: Cấu hình MCP
sidebar_position: 4
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Cấu hình MCP

Các biến đặt trong `superset_config.py` để điều khiển dịch vụ MCP.

Mọi giá trị mặc định dưới đây **đọc trực tiếp từ `mcp_service/mcp_config.py` và
`mcp_service/constants.py`** của bản 6.1.0 đang cài, không lấy theo tài liệu
thượng nguồn. Trang tài liệu bản `master` **sai hai chỗ**: nó ghi
`MCP_RESPONSE_SIZE_CONFIG["max_bytes"]` trong khi bản 6.1.0 dùng
**`token_limit`**, và nó ghi yêu cầu "Superset 5.0+" trong khi mã nguồn MCP
**không tồn tại** ở 6.0.0 và cũ hơn. Sàn thật là 6.1.0.

## Mạng và địa chỉ

| Biến | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `MCP_SERVICE_HOST` | `"localhost"` | Địa chỉ dịch vụ nghe |
| `MCP_SERVICE_PORT` | `5008` | Cổng dịch vụ nghe |
| `MCP_SERVICE_URL` | *(không đặt)* | Địa chỉ công khai của dịch vụ, dùng khi sinh link. Có đặt thì thắng mọi suy luận khác |
| `SUPERSET_WEBSERVER_ADDRESS` | `"http://localhost:9001"` | Địa chỉ AnalytiX |
| `WEBDRIVER_BASEURL` | `"http://localhost:9001/"` | Địa chỉ nội bộ để chụp ảnh biểu đồ |
| `WEBDRIVER_BASEURL_USER_FRIENDLY` | *(bằng `WEBDRIVER_BASEURL`)* | **Bắt buộc đặt tường minh** — biến sinh link trả về cho người dùng |

AnalytiX gán `WEBDRIVER_BASEURL_USER_FRIENDLY` từ mặc định riêng của nó **trước
khi** `superset_config.py` chạy. Nên đặt `WEBDRIVER_BASEURL` là **không đủ** —
link biểu đồ MCP trả về sẽ trỏ về địa chỉ mặc định và không mở được. Phải đặt
thẳng biến `_USER_FRIENDLY`.

## Xác thực và phân quyền

| Biến | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `MCP_AUTH_ENABLED` | `False` | Bật xác thực JWT. `False` = **không kiểm token** |
| `MCP_DEV_USERNAME` | *(không đặt)* | Tài khoản cố định dùng ở chế độ dev. Loại trừ nhau với `MCP_AUTH_ENABLED = True` |
| `MCP_RBAC_ENABLED` | `True` | Áp phân quyền của AnalytiX cho mọi công cụ MCP, kể cả RLS |
| `MCP_JWT_ALGORITHM` | — | `"HS256"` hoặc `"RS256"` |
| `MCP_JWT_SECRET` | — | Khoá chia sẻ, cho HS256 |
| `MCP_JWT_PUBLIC_KEY` | — | Khoá công khai tĩnh, cho RS256 |
| `MCP_JWKS_URI` | — | Địa chỉ JWKS, cho RS256 |
| `MCP_JWT_ISSUER` | — | Giá trị `iss` bắt buộc khớp |
| `MCP_JWT_AUDIENCE` | — | Giá trị `aud` bắt buộc khớp |
| `MCP_REQUIRED_SCOPES` | `[]` | Scope bắt buộc có trong token |
| `MCP_JWT_DEBUG_ERRORS` | `False` | Ghi lý do từ chối token vào log. **Chỉ bật tạm khi gỡ lỗi** |
| `MCP_AUTH_FACTORY` | `None` | Hàm tự viết thay toàn bộ cơ chế xác thực |

`MCP_REQUIRED_SCOPES` gác ở tầng token và được thực thi thật — token thiếu scope
bị từ chối hoàn toàn (`jwt_verifier.py`, bước 7: scope bắt buộc phải là tập con
của scope trong token). Nhưng nó **không** quyết định token gọi được công cụ nào;
việc đó do phân quyền của AnalytiX làm. Đừng dùng scope thay cho vai trò.

Bản 6.1.0 **không có** xác thực bằng vé khách (guest token) cho MCP. Đó là tính
năng của bản sau.

## Giới hạn kích thước phản hồi

`MCP_RESPONSE_SIZE_CONFIG` — mặc định:

| Khoá | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `enabled` | `True` | Bật chốt chặn |
| `token_limit` | `25000` | Trần kích thước phản hồi, tính theo token |
| `warn_threshold_pct` | `80` | Vượt mức này thì ghi cảnh báo vào log |
| `excluded_tools` | 5 công cụ | `health_check`, `get_chart_preview`, `generate_explore_link`, `open_sql_lab_with_context`, `search_tools` |

Phân trang dùng chung: mặc định **10** mục mỗi trang, tối đa **100**.

## Tìm kiếm công cụ

`MCP_TOOL_SEARCH_CONFIG` — mặc định:

| Khoá | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `enabled` | `True` | Thay toàn bộ công cụ bằng cặp `search_tools` + `call_tool` |
| `strategy` | `"bm25"` | `"bm25"` (tìm theo ngôn ngữ tự nhiên) hoặc `"regex"` |
| `max_results` | `5` | Số công cụ trả về mỗi lần tìm |
| `compact_schemas` | `True` | Cắt `$defs`/`$ref` khỏi schema |
| `max_description_length` | `300` | Cắt mô tả công cụ; `0` = không cắt |
| `include_schemas` | `False` | `False` = chỉ tên + gợi ý |

Bật thì tiết kiệm khoảng 70% ngữ cảnh, nhưng client chỉ thấy **2** công cụ thay
vì 24. Với 24 công cụ thì nên **tắt** — client nhìn trực tiếp đáng tin hơn là
qua một lớp proxy:

```python
MCP_TOOL_SEARCH_CONFIG = {"enabled": False}
```

Gán dict rút gọn như trên là an toàn: cả hai chỗ đọc biến này đều kiểm
`.get("enabled", False)` trước, nên các khoá khác không bị đọc tới khi đã tắt.

## Bộ đệm và lưu trạng thái

| Biến | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `MCP_CACHE_CONFIG` | `{"enabled": False}` | Đệm kết quả gọi công cụ |
| `MCP_STORE_CONFIG` | `{"enabled": False}` | Lưu sự kiện phiên, cần khi chạy nhiều bản song song |

Cả hai **tắt** mặc định. Chạy một bản duy nhất thì giữ nguyên.

## Khác

| Biến | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `MCP_DEBUG` | `False` | Chế độ gỡ lỗi |
| `MCP_PARSE_REQUEST_ENABLED` | `True` | Phân tích tham số `request` của công cụ |
| `MCP_SESSION_CONFIG` | xem dưới | Cookie phiên |
| `MCP_CSRF_CONFIG` | `WTF_CSRF_ENABLED: True` | Chống CSRF |
| `MCP_FACTORY_CONFIG` | toàn `None` | Ghi đè tên, nhãn, hướng dẫn, danh sách công cụ |

`MCP_SESSION_CONFIG` mặc định: `SESSION_COOKIE_HTTPONLY: True`,
`SESSION_COOKIE_SECURE: **False**`, `SESSION_COOKIE_SAMESITE: "Lax"`,
`PERMANENT_SESSION_LIFETIME: 86400`. Phục vụ qua HTTPS thì **phải đổi
`SESSION_COOKIE_SECURE` thành `True`**, nếu không cookie phiên đi được trên kết
nối không mã hoá.

## Hai cách khởi động

| Cách | Giao thức | Điều khiển bằng |
|:---|:---|:---|
| `superset mcp run --host H --port P` | streamable-HTTP tại `/mcp` | Tham số dòng lệnh |
| `python -m superset.mcp_service` | **`stdio`** mặc định | Biến môi trường `FASTMCP_TRANSPORT`, `FASTMCP_HOST`, `FASTMCP_PORT` |

Cách thứ hai mặc định là `stdio`, dành cho client chỉ nói được `stdio`. Đặt
`FASTMCP_TRANSPORT` sang giao thức HTTP thì nó đọc `FASTMCP_HOST` (mặc định
`127.0.0.1`) và `FASTMCP_PORT` (mặc định `5008`).

**Không có cờ tính năng nào** — MCP **không** bật bằng cờ tính năng. Nó là một
tiến trình riêng: cài gói `fastmcp`, đặt cấu hình, chạy lệnh. Thượng nguồn từng
có một cờ `MCP_SERVICE` nhưng nó chưa bao giờ được dùng tới và đã bị xoá.

## Liên quan

- [Bật dịch vụ MCP](../how-to/bat-mcp.md)
- [Đổi xác thực MCP sang JWT](../how-to/mcp-doi-sang-jwt.md)
- [Công cụ MCP](./mcp-cong-cu.md)
- [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md)
