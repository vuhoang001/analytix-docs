---
title: Bật dịch vụ MCP
sidebar_position: 11
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Bật dịch vụ MCP

Bật dịch vụ cho phép trợ lý AI đọc dữ liệu và dựng biểu đồ trong công cụ trực
quan bằng lời. Dịch vụ chạy như **một tiến trình riêng** — xem
[Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md).

Dành cho người quản trị. Cần có trước: quyền ghi vào thư mục cài của công cụ
trực quan, và quyền khởi động tiến trình trên máy đó.

:::warning[MCP không phải tính năng được giao sẵn]
Mã nguồn dịch vụ MCP **có** trong bản cài — nó đi theo nền Superset 6.1.0 mà
AnalytiX dựa trên. Nhưng **không có gì trong bộ cài bật nó lên**: `install.sh`,
`Dockerfile` và `entrypoint.sh` đều không cài `fastmcp`, không mở cổng 5008,
không khởi động dịch vụ. Không bản vá nào của AnalytiX chạm vào nó.

Nên hãy coi đây là **tính năng tự thêm vào**, không phải tính năng có bảo hành:
bạn tự cài gói, tự viết cấu hình, tự trông tiến trình.

Và lưu ý tài liệu thượng nguồn ghi yêu cầu *"Superset 5.0+"* là **sai** — mã
nguồn `mcp_service/` không tồn tại trước 6.1.0. Bước 1 kiểm điều đó tại chỗ
thay vì tin tài liệu.
:::

## Các bước

### 1. Kiểm bản đang chạy và mã nguồn MCP

```bash
<venv>/bin/pip show apache-superset | head -3
SP=$(<venv>/bin/python -c 'import superset,os;print(os.path.dirname(superset.__file__))')
ls -d "$SP/mcp_service" && ls "$SP/cli/mcp.py"
```

Cả hai đường dẫn phải tồn tại. Thiếu là bản quá cũ.

### 2. Cài gói `fastmcp`

Đây thường là thứ duy nhất còn thiếu — mã MCP đã nằm sẵn trong bản cài.

```bash
<venv>/bin/pip freeze > /tmp/freeze-truoc.txt          # để lùi lại được
<venv>/bin/pip install --dry-run "fastmcp>=3.1.0,<4.0" # xem trước ảnh hưởng
<venv>/bin/pip install "fastmcp>=3.1.0,<4.0"
<venv>/bin/pip check
```

:::note[Phải chặn ở bản 4]
Khai báo của AnalytiX là `fastmcp>=3.1.0,<4.0`. Trên kho gói công khai
đã có bản 4.x — cài bản 4 là ra ngoài khoảng được hỗ trợ. Bản 3 cao nhất hiện
là `3.4.11`.
:::

Lần cài thử nghiệm nâng cấp **3 gói** đã có (`certifi`, `python-dotenv`,
`typing_extensions`) — đều là bump nhỏ — và cài mới 39 gói. `pip check` sạch sau
khi cài. Nếu `--dry-run` cho thấy nhiều hơn thế, dừng lại và đọc kỹ trước khi
cài thật.

### 3. Thêm khối cấu hình

Nối vào cuối `superset_config.py`:

```python
MCP_SERVICE_HOST = "127.0.0.1"
MCP_SERVICE_PORT = 5008

# Chế độ dev: không kiểm token, chạy dưới một tài khoản cố định.
# An toàn CHỈ VÌ chỉ nghe trên 127.0.0.1. Mở ra ngoài thì phải đổi sang JWT.
MCP_AUTH_ENABLED = False
MCP_DEV_USERNAME = "admin"

# Phân quyền của AnalytiX vẫn áp dụng cho mọi công cụ MCP, kể cả RLS.
MCP_RBAC_ENABLED = True

# Tắt tìm-kiếm-công-cụ: khi bật, nó thay 24 công cụ bằng cặp proxy để tiết kiệm
# ngữ cảnh. 24 công cụ thì để client thấy trực tiếp đáng tin hơn.
MCP_TOOL_SEARCH_CONFIG = {"enabled": False}

SUPERSET_WEBSERVER_ADDRESS = "<dia-chi-cong-cu-truc-quan>"
WEBDRIVER_BASEURL = "<dia-chi-cong-cu-truc-quan>/"

# BẮT BUỘC — đây mới là biến sinh link trả về cho người dùng.
WEBDRIVER_BASEURL_USER_FRIENDLY = "<dia-chi-cong-cu-truc-quan>/"
```

:::danger[Thiếu dòng cuối là link không bấm được]
AnalytiX gán `WEBDRIVER_BASEURL_USER_FRIENDLY` từ mặc định riêng của nó
**trước khi** `superset_config.py` chạy, nên đặt `WEBDRIVER_BASEURL` là **không
đủ**. Thiếu dòng cuối thì mọi link biểu đồ MCP trả về đều trỏ về một địa chỉ mặc
định sai và không mở được.
:::

### 4. Tắt quyền ghi trên kết nối dữ liệu

Mở khai báo kết nối mà MCP sẽ truy vấn, bỏ chọn **Allow DML**, **Allow CTAS**,
**Allow CVAS**, **Allow file upload**.

Đây là chốt an toàn thật — nó chặn ở tầng kết nối, không dựa vào việc MCP tự
giữ mình.

### 5. Khởi động dịch vụ

```bash
export SUPERSET_CONFIG_PATH=<duong-dan-superset_config.py>
<venv>/bin/superset mcp run --host 127.0.0.1 --port 5008
```

Chạy thường trực thì bọc thành một đơn vị dịch vụ `systemd` theo đúng tiền tố
sản phẩm của bản cài đang dùng. Thượng nguồn **không** cung cấp sẵn đơn vị
`systemd` lẫn khối Helm cho MCP — phải tự viết.

### 6. Nối trợ lý AI vào

Khai báo endpoint cho client MCP:

```json
{
  "mcpServers": {
    "analytix": {
      "type": "http",
      "url": "http://127.0.0.1:5008/mcp"
    }
  }
}
```

Nối từ máy khác thì mở đường hầm SSH trước, đừng mở cổng ra mạng:

```bash
ssh -N -L 5008:127.0.0.1:5008 <may-chu>
```

## Kiểm tra là đã đúng

Cổng phải nghe, và **chỉ nghe trên `127.0.0.1`**:

```bash
ss -ltnp | grep 5008
```

Gọi thử công cụ `health_check` qua client MCP — kết quả đúng có dạng:

```json
{"status":"healthy","service":"... MCP Service","version":"6.1.0...","uptime_seconds":16.4}
```

Rồi kiểm ba điều sau, theo đúng thứ tự:

| Kiểm cái gì | Kết quả đúng |
|:---|:---|
| Số công cụ client thấy được | **24** |
| Gọi `execute_sql` với một câu `SELECT` | Trả về dữ liệu |
| Gọi `execute_sql` với `CREATE TABLE` hoặc `DELETE` | **Bị từ chối** — `DML queries are not allowed on this database` |

Dòng thứ ba là dòng quan trọng nhất. Nếu câu `CREATE TABLE` **chạy được**, bước
4 chưa có tác dụng — dừng lại và sửa trước khi cho ai dùng.

## Lỗi hay gặp

| Hiện tượng | Nguyên nhân | Cách sửa |
|:---|:---|:---|
| Không có thư mục `mcp_service`, hoặc `superset mcp` báo không rõ lệnh | Bản cài thấp hơn 6.1.0 | Nâng cấp. Không có cách bật nào khác |
| `superset mcp` báo thiếu module | Chưa cài `fastmcp` | Làm lại bước 2 |
| Link biểu đồ trả về trỏ về địa chỉ lạ, không mở được | Thiếu `WEBDRIVER_BASEURL_USER_FRIENDLY` | Thêm dòng đó rồi khởi động lại dịch vụ MCP |
| Client chỉ thấy 2 công cụ tên `search_tools`/`call_tool` | Tìm-kiếm-công-cụ đang bật | Đặt `MCP_TOOL_SEARCH_CONFIG = {"enabled": False}` |
| Gọi công cụ báo `Missing required argument [request]` | Hầu hết công cụ bọc tham số trong một object tên `request` | Gọi `{"request": {...}}`, không gọi `{}` |
| `get_chart_info` báo thiếu `identifier` | Tham số tên là `identifier`, không phải `chart_id` | Đổi tên tham số |
| `CREATE TABLE`/`DELETE` bị từ chối | **Không phải lỗi** — đúng thiết kế | Không sửa gì |
| Dịch vụ chết lúc chạy truy vấn dài | Quá hạn thời gian của công cụ | Tăng `timeout` trong lời gọi (tối đa 300 giây) |
| Xem trước biểu đồ dạng ảnh PNG không ra | Thiếu Chromium — bản gốc bỏ Chromium khỏi ảnh mặc định từ 6.0 | Cài Chromium, hoặc bỏ dùng xem-trước-ảnh |

## Liên quan

- [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md)
- [Đổi xác thực MCP sang JWT](./mcp-doi-sang-jwt.md) — **bắt buộc** trước khi mở ra ngoài localhost
- [Cấu hình MCP](../reference/mcp-cau-hinh.md) — bảng đầy đủ các biến
- [Công cụ MCP](../reference/mcp-cong-cu.md) — 24 công cụ và cách gọi
- [Tạo biểu đồ bằng lời](../tutorials/tao-bieu-do-bang-loi.md)
