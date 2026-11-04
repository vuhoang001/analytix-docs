---
title: Công cụ MCP
sidebar_position: 5
last_update:
  date: "2026-11-02"
  author: vuhoang001
---

# Công cụ MCP

24 công cụ dịch vụ MCP cung cấp, và các tham số của những công cụ hay dùng
nhất.

Danh sách lấy từ **lời gọi `tools/list` thật** vào dịch vụ bản 6.1.0 với
`MCP_TOOL_SEARCH_CONFIG` đã tắt, không lấy theo tài liệu thượng nguồn.

Hai lỗi gọi sai hay gặp nhất. Một, **hầu hết công cụ bọc tham số trong một
object tên `request`** — gọi `{}` trực tiếp sẽ bị
`Missing required argument [request]`, đúng là `{"request": { ... }}`; ngoại lệ
là `health_check` và `get_chart_type_schema`, hai công cụ này nhận tham số
phẳng. Hai, **`get_chart_info` dùng `identifier`, không dùng `chart_id`**.

## Danh sách 24 công cụ

| Nhóm | Công cụ |
|:---|:---|
| **Biểu đồ** (9) | `generate_chart`, `update_chart`, `update_chart_preview`, `list_charts`, `get_chart_info`, `get_chart_data`, `get_chart_preview`, `get_chart_type_schema`, `generate_explore_link` |
| **Dashboard** (4) | `generate_dashboard`, `add_chart_to_existing_dashboard`, `list_dashboards`, `get_dashboard_info` |
| **Dataset** (3) | `create_virtual_dataset`, `list_datasets`, `get_dataset_info` |
| **SQL** (3) | `execute_sql`, `save_sql_query`, `open_sql_lab_with_context` |
| **Kết nối dữ liệu** (2) | `list_databases`, `get_database_info` |
| **Hệ thống** (3) | `health_check`, `get_instance_info`, `get_schema` |

Dịch vụ còn cung cấp một *prompt* tên `quickstart`.

## `generate_chart` — tạo biểu đồ

| Tham số | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `dataset_id` | **bắt buộc** | ID hoặc UUID của dataset |
| `config` | **bắt buộc** | Cấu hình biểu đồ; **phải** có khoá `chart_type` |
| `chart_name` | tự sinh | Tên biểu đồ, tối đa 255 ký tự |
| `save_chart` | **`false`** | **Bắt buộc truyền `true` nếu muốn lưu thật vào AnalytiX** |
| `generate_preview` | `true` | Sinh ảnh xem trước; cần Chromium |
| `use_cache` | `true` | Dùng bộ đệm nếu có |
| `force_refresh` | `false` | Bỏ đệm, lấy dữ liệu mới |
| `cache_timeout` | — | Ghi đè thời gian đệm, giây |

`save_chart` mặc định là `false`: không truyền `save_chart: true` thì biểu đồ
**không được lưu** — gọi xong, mở AnalytiX ra không thấy gì. Đây là lỗi hay gặp
nhất khi mới dùng.

`generate_preview` mặc định `true` và sinh ảnh xem trước bằng trình duyệt không
giao diện. Bản gốc bỏ Chromium khỏi ảnh mặc định từ 6.0, nên nếu chưa cài thì
đặt `generate_preview: false` — các công cụ khác vẫn chạy bình thường.

### Bảy kiểu biểu đồ

| `chart_type` | Trường chính |
|:---|:---|
| `xy` | `x`, `y`, `kind` (`line`/`bar`/`area`/`scatter`) |
| `table` | `columns` |
| `pie` | `dimension`, `metric` |
| `pivot_table` | `rows`, `metrics` |
| `mixed_timeseries` | `x`, `y`, `y_secondary` |
| `handlebars` | `columns`, `handlebars_template` |
| `big_number` | `metric` |

Gọi `get_chart_type_schema` với `{"chart_type": "<kiểu>"}` để lấy schema đầy đủ
và ví dụ của từng kiểu. Đây là cách đúng — đừng đoán tên trường.

### Cấu hình kiểu `xy`

| Trường | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `x` | **bắt buộc** | Cột trục X |
| `y` | **bắt buộc** | Danh sách cột trục Y, ít nhất 1 |
| `kind` | `"line"` | `line`, `bar`, `area`, `scatter` |
| `time_grain` | — | `PT1M`, `PT1H`, `P1D`, `P1W`, `P1M`, `P3M`, `P1Y`… |
| `group_by` | — | Cột tách thành nhiều chuỗi |
| `stacked` | `false` | Xếp chồng |
| `orientation` | — | `vertical`/`horizontal`, chỉ cho `kind: "bar"` |
| `filters` | — | Bộ lọc dạng `column`/`op`/`value` |
| `row_limit` | `10000` | Trần số điểm dữ liệu |
| `x_axis`, `y_axis` | — | `title`, `scale` (`linear`/`log`), `format` |
| `legend` | — | `show`, `position` |

Bộ lọc **phải dùng dạng có cấu trúc**: trường `filters` nhận
`{column, op, value}`, **không** truyền SQL thô hay `adhoc_filters`. Toán tử cho
phép: `=`, `>`, `<`, `>=`, `<=`, `!=`, `LIKE`, `ILIKE`, `NOT LIKE`, `IN`,
`NOT IN`. Với `IN`/`NOT IN` thì `value` là danh sách.

### Cách khai một cột

| Trường | Ý nghĩa |
|:---|:---|
| `name` | **bắt buộc** — tên cột |
| `label` | Nhãn hiện trên biểu đồ |
| `aggregate` | `SUM`, `COUNT`, `AVG`, `MIN`, `MAX`, `COUNT_DISTINCT`, `STDDEV`, `VAR`, `MEDIAN`, `PERCENTILE` |
| `saved_metric` | `true` = `name` trỏ tới metric đã lưu trong dataset; khi đó `aggregate` bị bỏ qua |
| `dtype` | Kiểu dữ liệu, nếu cần nói rõ |

### Ví dụ đã chạy thật

```json
{"request": {
  "dataset_id": 1,
  "chart_name": "So chuyen theo thang",
  "save_chart": true,
  "generate_preview": false,
  "config": {
    "chart_type": "xy",
    "kind": "line",
    "time_grain": "P1M",
    "x": {"name": "src_month_date"},
    "y": [{"name": "trips_true", "aggregate": "SUM", "label": "So chuyen"}],
    "group_by": [{"name": "service"}],
    "y_axis": {"title": "So chuyen", "format": ",d"}
  }
}}
```

Kết quả: biểu đồ được lưu với `viz_type` là `echarts_timeseries_line`, mở được
bằng link `explore_url` trong phản hồi.

## `execute_sql` — chạy truy vấn

| Tham số | Mặc định | Ý nghĩa |
|:---|:---|:---|
| `database_id` | **bắt buộc** | ID kết nối dữ liệu |
| `sql` | **bắt buộc** | Câu truy vấn |
| `schema` | — | Schema mặc định |
| `catalog` | — | Catalog |
| `limit` | — | Trần số dòng, tối đa `10000`. Có đặt thì **thắng** `LIMIT` trong câu SQL |
| `timeout` | `30` | Giây, tối đa `300` |
| `template_params` | — | Tham số Jinja2 |
| `dry_run` | `false` | Chỉ kiểm, không chạy |

Phân quyền và luật lọc theo dòng (RLS) của AnalytiX **vẫn áp dụng** cho
công cụ này — không có đường đi vòng.

Kết nối đã tắt quyền ghi thì mọi câu ghi bị từ chối với thông báo
`DML queries are not allowed on this database`. Đây là **kết quả đúng**, không
phải lỗi — xem [Bật dịch vụ MCP](../how-to/tro-ly-ai/bat-mcp.md).

## Phân trang

Các công cụ `list_*` trả về `10` mục mỗi trang, tối đa `100`. Phản hồi có
`page`, `total_pages`, `has_next` để đi tiếp.

## Công cụ không bị chặn kích thước

`MCP_RESPONSE_SIZE_CONFIG` chặn phản hồi ở `25000` token, trừ 5 công cụ:
`health_check`, `get_chart_preview`, `generate_explore_link`,
`open_sql_lab_with_context`, `search_tools`.

## Liên quan

- [Bật dịch vụ MCP](../how-to/tro-ly-ai/bat-mcp.md)
- [Cấu hình MCP](./mcp-cau-hinh.md)
- [Tạo biểu đồ bằng lời](../tutorials/tao-bieu-do-bang-loi.md)
- [Vì sao MCP là một dịch vụ riêng](../explanation/vi-sao-mcp-la-service-rieng.md)
