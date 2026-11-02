#!/usr/bin/env bash
# Kiểm bản build xem có lọt định danh thật của bản triển khai không.
# Chạy trước mọi lần phát hành:  cd website && ./kiem-bi-mat.sh
#
# Thoát 0 = sạch. Thoát khác 0 = có vấn đề, ĐỪNG phát hành.
set -uo pipefail

cd "$(dirname "$0")"

PATTERNS=${SECRET_PATTERNS:-SECRET_AUDIT.patterns}
BUILD=${BUILD_DIR:-build}

# Thiếu file mẫu thì PHẢI báo lỗi, không được coi là đạt.
# grep với file mẫu rỗng/thiếu sẽ không khớp gì và trông như sạch — an tâm giả.
if [ ! -s "$PATTERNS" ]; then
  cat >&2 <<EOF
LỖI: không thấy (hoặc rỗng) file mẫu '$PATTERNS'.

File này đã được .gitignore nên KHÔNG có trong bản clone — đó là cố ý, vì nó
chứa bí mật dạng chữ thô. Xin nó từ người giữ, hoặc dựng lại theo hướng dẫn
trong SECRET_AUDIT.md.

Không kiểm được thì coi như CHƯA kiểm. Đừng phát hành.
EOF
  exit 2
fi

# Dòng trống trong file mẫu khớp với mọi thứ -> mọi lần kiểm đều "có rò rỉ".
if grep -qE '^[[:space:]]*$' "$PATTERNS"; then
  echo "LỖI: '$PATTERNS' có dòng trống. grep -F coi dòng trống là mẫu khớp mọi thứ." >&2
  exit 2
fi

if [ ! -d "$BUILD" ]; then
  echo "LỖI: chưa có thư mục '$BUILD'. Chạy 'npm run build' trước." >&2
  exit 2
fi

echo "Kiểm $(grep -c . "$PATTERNS") mẫu trên '$BUILD/'…"

if hits=$(grep -RFf "$PATTERNS" "$BUILD" 2>/dev/null); then
  echo
  echo ">>> CÓ RÒ RỈ — đừng phát hành. Các tệp liên quan:" >&2
  grep -RFlf "$PATTERNS" "$BUILD" 2>/dev/null | sed 's/^/    /' >&2
  echo >&2
  echo "Số dòng khớp: $(printf '%s\n' "$hits" | wc -l)" >&2
  echo "Sửa trang nguồn trong docs/, build lại, rồi kiểm lại." >&2
  exit 1
fi

echo "Sạch — không mẫu nào khớp."
