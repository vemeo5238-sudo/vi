"""
Tạo đường dẫn gọn (không đuôi .html) cho web V Angel.

Chạy lại script này MỖI KHI sửa treatments.html, salon.html hoặc vip.html:
    python tools/build_routes.py

Nó chép các trang gốc vào thư mục:
    services/index.html            (từ treatments.html)
    services/<nhóm>/index.html     (facial, lash, brow, pmu, nail)
    locations/index.html           (từ salon.html)
    vip/index.html                 (từ vip.html)
Mỗi trang có thẻ <base> tự tính nên ảnh, CSS, JS vẫn lấy từ thư mục gốc.
"""
import io, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATS = ["facial", "lash", "brow", "pmu", "nail"]
ROUTES = {
    "treatments.html": ["services"] + ["services/" + c for c in CATS],
    "salon.html": ["locations"],
    "vip.html": ["vip"],
}

def main():
    for src, dests in ROUTES.items():
        html = io.open(os.path.join(ROOT, src), encoding="utf-8").read()
        assert "<!--va-base-->" in html, src + " thiếu đoạn <base> tự tính"
        for d in dests:
            out_dir = os.path.join(ROOT, d)
            os.makedirs(out_dir, exist_ok=True)
            io.open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8", newline="\n").write(html)
            print("wrote", d + "/index.html")

if __name__ == "__main__":
    main()
