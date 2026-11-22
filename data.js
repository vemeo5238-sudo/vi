/* =========================================================
   DỮ LIỆU WEBSITE V ANGEL — sửa thông tin tại file này.
   Giá lấy từ bảng giá in tại salon (USD). Ghi giá dạng chữ: "$80", "$110+", "$73 – $88"
   image: để "" sẽ hiện biểu tượng; hoặc điền "images/ten-anh.webp"
   ========================================================= */

/* ---------- Thông tin salon ---------- */
const SALON = {
  name: "V Angel Facial & Nail Spa",
  area: "Springdale · Bentonville, Arkansas",
  phone: "(479) 717-2557",            // số tiệm nail (Springdale)
  phoneLink: "+14797172557",
  owner: "(857) 218-8777",            // số chủ tiệm — Vi (facial, lash, skincare)
  ownerLink: "+18572188777",
  email: "hello@vangel.vn",
  social: {
    Facebook: "https://www.facebook.com/share/1EFbDDu1UG/",
    Instagram: "https://www.instagram.com/angelnailsfacial",
    TikTok: "https://www.tiktok.com/@angel.nails.facial"
  }
};

/* ---------- Chi nhánh ----------
   cats: nhóm dịch vụ có tại chi nhánh (dùng để lọc ô chọn dịch vụ khi đặt lịch) */
/* Form "Free consultation": dán link nhận form vào đây (VD https://formsubmit.co/ajax/email-cua-tiem
   hoặc link Formspree). Để trống thì khách gửi bằng tin nhắn SMS tới số của Vi. */
/* Đặt cọc giữ chỗ: điền tài khoản của tiệm vào đây. Ô nào để trống sẽ không hiện trên web.
   zelle: số điện thoại hoặc email đăng ký Zelle · venmo: tên Venmo (không cần @) · cashapp: $cashtag (không cần $) */
const DEPOSIT = {
  amount: 25,
  zelle: "(857) 218-8777",
  zelleName: "",
  venmo: "Vi-LeElina",
  cashapp: ""
};

const CONSULT_ENDPOINT = "https://vangelbeauty.com/?rest_route=/vangel/v1/submit";

const LOCATIONS = [
  { id: "springdale", label: "Location 1", name: "Springdale", photo: "images/loc-springdale.webp?v=3", phones: [["Nails", "(479) 717-2557", "+14797172557", "Walk-ins welcome"], ["Facial, Lash, Brow & PMU", "(857) 218-8777", "+18572188777", "(By appointment only)"]],
    address: "1602 E Robinson Ave #K, Springdale, AR 72764",
    services: ["Nail", "Facial", "Lash", "Lash Lift", "Skincare"],
    cats: ["nail", "facial", "lash", "brow", "pmu"],
    policy: "Nails: walk-ins welcome or book ahead. Facial, lash, lash lift and skincare: by appointment only.",
    walkin: true,
    hours: [["Monday – Friday", "9:30 AM – 7:00 PM"], ["Saturday", "9:30 AM – 6:00 PM"], ["Sunday", "Closed (facials by appointment)"]] },
  { id: "bentonville", label: "Location 2", name: "Bentonville", photo: "images/loc-bentonville.webp?v=5", phones: [["Facial, Lash, Brow & PMU", "(857) 218-8777", "+18572188777", "(By appointment only)"]],
    address: "Room 6, 1724 SE Moberly Ln, Bentonville, AR 72712",
    services: ["Facial", "Lash", "Brow Lamination", "Lash Lift"],
    cats: ["facial", "lash", "brow", "pmu"],
    policy: "By appointment only.",
    walkin: false,
    hours: [["Hours", "By appointment"]] }
];

/* ---------- Dịch vụ có thẻ ảnh ----------
   category: "facial" | "lash" | "brow" | "nail"
   popular: true = hiện ở trang chủ "Dịch vụ nổi bật"
   steps: các mục "Bao gồm" in trên bảng giá */
const TREATMENTS = [
  // FACIAL — Essential
  { category: "facial", name: "Hydro Glow Facial", duration: "75 min", price: "$180", badge: "Premium", popular: true, image: "images/svc-hydro-glow.webp?v=5",
    desc: "Hydro dermabrasion deep-cleans, deeply hydrates and infuses serum — skin glows right after your visit.",
    benefits: ["Hydro Dermabrasion", "Deep Hydration", "Instant Glow"],
    steps: ["Hydro Dermabrasion", "Deep Hydration", "Serum Infusion", "Instant Glow"] },
  { category: "facial", name: "Basic Glow Facial", duration: "45 min", price: "$80", badge: "", image: "images/svc-basic-glow.webp",
    desc: "Our essential facial: deep cleansing, exfoliation and a hydrating mask for healthy, glowing skin.",
    steps: ["Deep Cleansing", "Exfoliation", "Hydrating Mask"] },
  { category: "facial", name: "Deep Pore Facial", duration: "60 min", price: "$100", badge: "", image: "images/svc-deep-pore-new.webp",
    desc: "Deep pore cleansing with steam and extractions for clear, refreshed skin.",
    steps: ["Deep Cleansing", "Steam Therapy", "Extractions", "Hydrating Mask"] },
  { category: "facial", name: "Acne Rescue Facial", duration: "60 min", price: "$120", badge: "", popular: true, image: "images/svc-acne-ba.webp?v=2",
    desc: "For acne-prone skin: deep cleansing, antibacterial blue LED light and a calming treatment.",
    steps: ["Deep Cleansing", "LED Blue Light", "Calming Treatment", "Hydrating Mask"] },
  // FACIAL — Premium
  { category: "facial", name: "Brightening Facial", duration: "60 min", price: "$140", badge: "Premium", image: "images/svc-brightening-new.webp",
    desc: "Vitamin C and brightening serum with LED light therapy for a more even, radiant complexion.",
    steps: ["Vitamin C Treatment", "Brightening Serum", "LED Light Therapy", "Hydrating Mask"] },
  { category: "facial", name: "Age-Defying Facial", duration: "75 min", price: "$160", badge: "Premium", image: "images/svc-age-defying-new.webp",
    desc: "Lifting massage, collagen and anti-aging serum for firmer, younger-looking skin.",
    steps: ["Lifting Massage", "Collagen Treatment", "LED Light Therapy", "Anti-Aging Serum"] },
  { category: "facial", name: "Skin Renewal Peel", duration: "90 min", price: "$220", badge: "Premium", image: "images/svc-renewal-peel-mask.webp",
    desc: "A renewing chemical peel that refines skin texture and tone.",
    steps: [] },

  // LASH
  { category: "lash", name: "Classic Full Set", duration: "", price: "$110+", badge: "", image: "images/svc-lash-eye.webp",
    desc: "One extension per natural lash — soft, light and natural, just like your own lashes.", steps: [] },
  { category: "lash", name: "Hybrid Full Set", duration: "", price: "$140+", badge: "", image: "images/svc-lash-hybrid-new.webp",
    desc: "A mix of classic and volume for medium fullness with beautiful texture.", steps: [] },
  { category: "lash", name: "Volume Full Set", duration: "", price: "$170+", badge: "", popular: true, image: "images/svc-lash-volume-new.webp",
    desc: "Full, fluffy volume lashes with a lifted curl — still lightweight.", steps: [] },
  { category: "lash", name: "Wispy Full Set (Wet Set)", duration: "", price: "$160 + $25 & up", badge: "New", image: "images/svc-lash-ba.webp?v=2",
    desc: "Textured, wispy \u201cwet look\u201d lashes with defined spikes for a soft, editorial finish.", steps: [] },
  { category: "lash", name: "Mega Volume", duration: "", price: "$200 & up", badge: "New", image: "images/svc-lash-mega.webp?v=2",
    desc: "Our fullest, darkest set \u2014 ultra-fine fans for maximum drama that still feels light.", steps: [] },
  { category: "lash", name: "Cluster Lashes (Temporary)", duration: "", price: "$50+", badge: "", image: "images/svc-lash-cluster.webp",
    desc: "Temporary cluster lashes — a quick glam look for parties and events.", steps: [] },
  { category: "lash", name: "Korean Lash Lift", duration: "", price: "$90+", badge: "", image: "images/svc-lash-lift.webp",
    desc: "Korean-style lift and curl for your natural lashes. With tint: $100+.", steps: [] },

  // BROW
  { category: "brow", name: "Brow Lamination + Tint", duration: "", price: "$100+", badge: "", image: "images/svc-brow-lamination.webp",
    desc: "Lamination and tint for fuller, groomed, evenly colored brows.", steps: [] },
  // PMU & BROWS (phun xăm chân mày)
  { category: "pmu", name: "Ombre Shading", duration: "", price: "$249", badge: "Sale", image: "images/svc-pmu-ombre.webp",
    desc: "Soft powder brows that start light at the front and deepen toward the tail — like your favorite brow pencil, there when you wake up. Regular $399.",
    steps: ["Best for oily or combination skin", "Soft, filled-in look", "Great if you fill your brows daily"] },
  { category: "pmu", name: "Combo Brows", duration: "", price: "$349", badge: "Most picked", popular: true, image: "images/svc-pmu-combo-ba.webp",
    desc: "Fine hairstrokes at the front with soft shading through the body and tail. Natural up close, polished from across the room. Regular $599.",
    steps: ["Best for sparse fronts", "Natural start, defined tail", "Works on most skin types"] },
  { category: "pmu", name: "Nano Hairstrokes", duration: "", price: "$499", badge: "Signature", image: "images/svc-pmu-nano.webp",
    desc: "Very fine strokes placed one at a time with a nano needle, following the way your own hairs grow — our most natural brows. Regular $799.",
    steps: ["Most natural result", "Best for normal to dry skin", "Fills gaps and thin spots"] },
  { category: "pmu", name: "Color Correction / Cover Up", duration: "", price: "No fixed price", priceNote: "Price upon consultation", badge: "", image: "images/svc-pmu-correction.webp",
    desc: "Old brows that healed blue, gray, red or orange? A shape you never liked? We neutralize the unwanted color and rebuild your brows so you can go bare-faced again.",
    chips: ["Fixes faded or discolored brows", "Covers old work you don't love"],
    notice: ["Before you book", "This service can't be booked online until our brow artist sees your brows. Send clear photos of your current brows with no makeup first. After she reviews them, she'll send your price and open times."],
    cta: ["Text brow photos", "sms:+18572188777"],
    steps: [] },
  { category: "pmu", name: "PMU Touch-Up", duration: "", price: "$120 – $249", badge: "", image: "images/svc-pmu-touchup.webp",
    desc: "Refresh light spots, sharpen the shape and bring back the color. 4–6 weeks after your first session $120 · 4–6 months $200 · 8–12 months $249. For brows done at V Angel.",
    steps: ["4–6 weeks: $120", "4–6 months: $200", "8–12 months: $249"] },
  { category: "brow", name: "Brow Shaping Wax", duration: "", price: "$15+", badge: "", image: "images/svc-brow-wax.webp",
    desc: "Wax and shape for brows that flatter your face.", steps: [] },

  // NAIL & PEDICURE
  { category: "nail", name: "Gel Manicure", duration: "", price: "$35", badge: "", popular: true, image: "images/svc-nail-gel-new.webp",
    desc: "Nail care with a glossy, long-lasting gel polish. Gel polish change: $25.", steps: [] },
  { category: "nail", name: "Acrylic Full Set", duration: "", price: "$40 & up", badge: "", image: "images/svc-nail-acrylic.webp",
    desc: "Acrylic full set shaped to perfection. White tip from $50, ombre from $60.", steps: [] },
  { category: "nail", name: "Dipping Powder", duration: "", price: "$40+", badge: "", image: "images/svc-nail-dip-new.webp",
    desc: "Strong, durable dip powder nails. With paraffin $45, ombré dipping $55.", steps: [] },
  { category: "nail", name: "Nail Art Design", duration: "", price: "+$5 & up", badge: "", image: "images/svc-nail-art.webp",
    desc: "Hand-painted art, gems and effects in the design you love — add to any nail service.", steps: [] },
  { category: "nail", name: "Volcano Pedicure", duration: "", price: "$73 – $88", badge: "Luxury", image: "images/svc-pedi-volcano.webp",
    desc: "Our most luxurious pedicure. Higher price includes gel polish.",
    steps: ["Detox Volcano Crystal bath soak", "Cuticle trim, sugar scrub, callus removal", "Mud masque, hot paraffin, collagen cream", "Hot stone massage, collagen socks", "Hot towel wrap, hot steam machine, soy massage candle"] },
  { category: "nail", name: "Collagen Spa Pedicure", duration: "", price: "$63 – $78", badge: "", image: "images/svc-pedi-collagen.webp",
    desc: "Organic collagen pedicure with your choice of Milk & Honey or Mint. Higher price includes gel polish.",
    steps: ["Luxury organic sea salt", "Cuticle trim, organic sugar scrub, callus removal", "Organic mud masque, hot stone massage", "Hot paraffin wax, organic cream massage", "Hot towel wrap, collagen socks"] },
  { category: "nail", name: "Deluxe Pedicure", duration: "", price: "$43 – $58", badge: "", image: "images/svc-pedi-deluxe.webp",
    desc: "Orange or lavender sea salt, hot stone and hot towel wrap. Higher price includes gel polish.",
    steps: ["Orange or lavender sea salt", "Cuticle trim, sugar scrub", "Callus removal, hot stone", "Hot towel wrap"] }
];

/* ---------- Platinum Facial Collection ---------- */
const PLATINUM = [
  { tier: "Essential", name: "Essential Deep Clean Facial", duration: "", price: "$79",
    desc: "Monthly deep cleansing and hydration for clean, healthy-looking skin.",
    includes: ["Deep cleansing", "Gentle exfoliation", "Hydration", "Personalized skincare recommendations"],
    best: "Monthly skincare maintenance and healthy-looking skin.",
    p3: "$225", p6: "$425", vip: { name: "Essential VIP", price: "$790", save: "$158", pay: ["$395", "$263.33*", "$158"] } },
  { tier: "Renewal", name: "Deep Clean + Peel Facial", duration: "", price: "$120",
    desc: "Deep cleansing with customized exfoliation and a gentle peel when appropriate.",
    includes: ["Deep cleansing", "Customized exfoliation", "Gentle peeling when appropriate", "Hydration and skin barrier support"],
    best: "Dull skin, uneven texture, congestion and clients seeking consistent skincare.",
    note: "Peel frequency depends on skin condition and professional assessment.",
    p3: "$340", p6: "$650", vip: { name: "Skin Renewal VIP", price: "$1,200", save: "$240", pay: ["$600", "$400", "$240"] } },
  { tier: "Silver", name: "Platinum Silver", duration: "75 min", price: "$220",
    desc: "Perfect for deep cleansing, hydration and a healthy glow.",
    includes: ["Deep cleansing", "Intensive hydration", "Customized advanced facial techniques", "Professional skin assessment"],
    best: "Clients who want a premium facial focused on clarity and glow.",
    p3: "$625", p6: "$1,190", vip: { name: "Platinum Silver VIP", price: "$2,200", save: "$440", pay: ["$1,100", "$733.33*", "$440"] } },
  { tier: "Gold", name: "Platinum Gold", duration: "90 min", price: "$250",
    desc: "Advanced treatment for brighter, firmer, younger-looking skin.",
    includes: ["Advanced brightening treatment", "Firming and lifting techniques", "Hydration", "Professional skin assessment"],
    best: "Clients who want brighter, firmer, younger-looking skin.",
    p3: "$710", p6: "$1,350", vip: { name: "Platinum Gold VIP", price: "$2,500", save: "$500", pay: ["$1,250", "$833.33*", "$500"] } },
  { tier: "Diamond", name: "Platinum Diamond", duration: "105 min", price: "$280",
    desc: "Enhanced results with premium collagen and deep rejuvenation.",
    includes: ["Premium collagen treatment", "Deep rejuvenation", "Advanced facial techniques", "Professional skin assessment"],
    best: "Clients looking for enhanced anti-aging and rejuvenation results.",
    p3: "$795", p6: "$1,510", vip: { name: "Platinum Diamond VIP", price: "$2,800", save: "$560", pay: ["$1,400", "$933.33*", "$560"] } },
  { tier: "Elite Peel", name: "Platinum Elite Peel Facial", duration: "120 min", price: "$300",
    desc: "The ultimate luxury experience for total skin transformation.",
    includes: ["Advanced Peel", "Deep Rejuvenation", "Collagen Boost", "Recovery Mask"],
    best: "Clients who want the most complete, transformative facial we offer.",
    p3: "$850", p6: "$1,620", vip: { name: "Platinum Elite VIP", price: "$3,000", save: "$600", pay: ["$1,500", "$1,000", "$600"] } }
];

/* ---------- Bảng giá đầy đủ (chép từ menu in tại salon) ----------
   Mỗi nhóm: [tên nhóm, ghi chú, [[tên dịch vụ, giá, chi tiết]...]] */
const PRICE_MENU = {
  facial: [
    ["Essential Facials", "", [
      ["Basic Glow Facial", "$80", "45 min"], ["Deep Pore Facial", "$100", "60 min"], ["Acne Rescue Facial", "$120", "60 min"]]],
    ["Premium Facials", "", [
      ["Brightening Facial", "$140", "60 min"], ["Age-Defying Facial", "$160", "75 min"], ["Hydro Glow Facial", "$180", "75 min"],
      ["Skin Renewal Peel", "$220", "90 min"], ["Platinum Elite Peel Facial", "$300", "120 min"]]],
    ["Platinum Facial Collection", "", [
      ["Platinum Silver", "$220", "75 min"], ["Platinum Gold", "$250", "90 min"], ["Platinum Diamond", "$280", "105 min"],
      ["Platinum Elite Peel Facial", "$300", "120 min"]]],
    ["Add-on Services", "Add to any facial treatment", [
      ["Cold Plasma Therapy", "$20"], ["Nano Meso Infusion", "$25"], ["Silver Ion Therapy", "$20"], ["LED Light Therapy", "$15"],
      ["Chemical Peel Upgrade", "$50"], ["Dermaplaning", "$25"], ["Collagen Mask Upgrade", "$20"], ["Eye Treatment", "$15"],
      ["Lip Treatment", "$10"], ["Hydrating Mask Upgrade", "$15"]]]
  ],
  lash: [
    ["Eyelash Extensions — Full Sets", "", [
      ["Cluster Lashes (Temporary)", "$50+"], ["Classic Full Set", "$110+"], ["Hybrid Full Set", "$140+"], ["Volume Full Set", "$170+"],
      ["Wispy Full Set (Wet Set)", "$160 + $25 & up"], ["Mega Volume", "$200 & up"]]],
    ["Refills", "", [
      ["Cluster Touch-Up", "$30+"], ["Classic Fill", "$60+"], ["Hybrid Fill", "$75+"], ["Volume Fill", "$90+"],
      ["Wispy (Wet Set) Fill", "$85+"], ["Mega Volume Fill", "$100+"]]],
    ["Lash Lift", "", [
      ["Korean Lash Lift", "$90+"], ["Korean Lash Lift + Tint", "$100+"], ["Lash Tint", "$25+"]]]
  ],
  brow: [
    ["Brows", "", [
      ["Brow Shaping Wax", "$15+"], ["Brow Tint", "$25+"], ["Brow Lamination", "$85+"], ["Brow Lamination + Tint", "$100+"]]],
    ["Waxing", "", [
      ["Eyebrows", "$15"], ["Lips", "$10"], ["Chin", "$15"], ["Full Face", "$45 & up"], ["Underarms", "$20 & up"],
      ["Half Legs", "$32 & up"], ["Full Legs", "$45 & up"]]]
  ],
  pmu: [
    ["Permanent Brows", "Sale prices shown; regular price in small text.", [
      ["Ombre Shading", "$249", "Regular $399 · soft powder look"], ["Combo Brows", "$349", "Regular $599 · most picked"],
      ["Nano Hairstrokes", "$499", "Regular $799 · most natural"], ["Color Correction / Cover Up", "No fixed price", "Price upon consultation"]]],
    ["Touch-Ups", "For brows done at V Angel.", [
      ["4–6 weeks after first session", "$120"], ["4–6 months after last session", "$200"], ["8–12 months after last session", "$249"]]]
  ],
  nail: [
    ["Manicure & Pedicure", "", [
      ["Manicure", "$25"], ["Manicure and Pedicure", "$58"], ["Gel Manicure", "$35"], ["Gel polish change", "$25"], ["Take off", "+$3"],
      ["Spa Pedicure", "$33"], ["Deluxe Pedicure", "$43"], ["Luxury Pedicure", "$53"], ["Collagen Pedicure", "$63"],
      ["Volcano Pedicure", "$73"], ["Gel polish add-on", "$15"]]],
    ["Pedicure + Gel Polish", "Prices include gel polish", [
      ["Volcano Pedicure + Gel", "$73 – $88"], ["Collagen Spa Pedicure + Gel", "$63 – $78"], ["Luxury Organic Pedicure + Gel", "$53 – $68"],
      ["Deluxe Pedicure + Gel", "$43 – $58"], ["Callus Removal Pedicure + Gel", "$38 – $53"], ["Spa Pedicure + Gel", "$33 – $48"]]],
    ["Acrylic Nails", "", [
      ["Acrylic Full Set", "$40 & up"], ["Acrylic Fill-in", "$30 & up"], ["Acrylic White Tip", "$50 & up"], ["Acrylics Ombre", "$60 & up"],
      ["Gel Polish Add-on", "$15"]]],
    ["Dipping Powder", "", [
      ["Dipping Powder", "$40+", "+$5 dip removal"], ["Dipping with Paraffin", "$45"], ["Ombré Dipping", "$55"], ["Extra Fake Tip", "+$5"],
      ["Extra Special Shape", "+$5"], ["Extra Longer Nail", "$5"], ["Extra Manicure for Dipping", "$10"], ["Special Color Dipping Extra", "+$5"]]],
    ["Kid Menu", "", [
      ["Manicure", "$18"], ["Pedicure", "$30"], ["Manicure and Pedicure", "$48"], ["Special Design", "$5 & up"]]],
    ["Additional Services", "", [
      ["Special Shape", "+$5"], ["Extra Longer Nail", "+$5 & up"], ["Special Design", "+$5 & up"], ["Nail Repair", "+$3 & up"],
      ["Polish Acrylic", "$25 & up", "With take-off +$3"], ["Nail Removal Only", "$15 & up"], ["Nail Removal with Full Set", "$8"],
      ["French Tip", "$5 & up"], ["Full Set / Fill-in 2 Big Toes", "$14 / $7"], ["Paraffin for Hands / Feet", "$5 / $8"],
      ["Acrylic for Toes", "$7 each"]]]
  ]
};

/* ---------- Đánh giá (mẫu — thay bằng đánh giá Google thật của salon) ---------- */
const REVIEWS = [
  { name: "Ashley M.", service: "Hydro Glow Facial", text: "My skin was glowing right after the facial. The room is so clean, warm and relaxing." },
  { name: "Maria G.", service: "Volume Full Set", text: "My lashes look natural but full and lasted over 3 weeks. Vi is so talented!" },
  { name: "Jessica T.", service: "Gel Manicure", text: "Beautiful, long-lasting nails. Friendly staff with great attention to detail." },
  { name: "Sofia R.", service: "Acne Rescue Facial", text: "After a few sessions my acne is so much better. They really take time to explain everything." },
  { name: "Emily K.", service: "Korean Lash Lift", text: "Naturally curled lashes — I wake up and don't even need mascara." },
  { name: "Daniela L.", service: "Volcano Pedicure", text: "The most relaxing pedicure I've ever had — hot stones, massage candle, amazing." }
];

/* ---------- Điểm nổi bật (trang Salon) ---------- */
const OFFERS = [
  { big: "50% OFF", title: "PMU & Brows", sub: "Ombre, combo & nano brows", book: "Combo Brows" },
  { big: "40% OFF", title: "Facial · Lash · Brow Lamination", sub: "Holiday special at V Angel", book: "" },
  { big: "$220+", title: "Platinum Collection", sub: "4 luxury facial packages, 75–120 min" },
  { big: "$15", title: "LED Light Therapy", sub: "Add-on for any facial treatment" }
];

/* ---------- Câu hỏi thường gặp (trang Salon) ---------- */
const FAQS = [
  ["How many locations does V Angel have?", "Two. Springdale (Location 1): 1602 E Robinson Ave #K, Springdale, AR 72764 — nails, facials, lashes, lash lift and skincare. Bentonville (Location 2): Room 6, 1724 SE Moberly Ln, Bentonville, AR 72712 — facials, lashes, brow lamination and lash lift."],
  ["Do I need an appointment?", "Nails in Springdale: walk-ins welcome, or book ahead. Facials, lashes, lash lift and skincare at both locations are by appointment only. The Bentonville location is appointment only."],
  ["Which number should I call to book?", "Nails: (479) 717-2557. Facials, lashes, brow lamination, lash lift and skincare: call or text Vi at (857) 218-8777."],
  ["What are your hours?", "Springdale: Monday – Friday 9:30 AM – 7:00 PM, Saturday 9:30 AM – 6:00 PM, Sunday closed. Bentonville: by appointment."],
  ["What does a “+” after the price mean?", "It's the starting price. The final price depends on length, design and the condition of your lashes or nails — we'll always confirm before we start."],
  ["Are your tools sanitized?", "Yes. All tools are cleaned and sterilized after every guest, and single-use items are always replaced."]
];

/* ---------- Biểu tượng (dùng khi chưa có ảnh) ---------- */
const ICONS = {
  facial: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M38 8c-12 0-20 9-20 21 0 6 2 10 4 13l-2 6c3 2 6 3 9 3l2 5h9"/><path d="M38 8c6 4 9 11 8 19"/><path d="M26 28c2 2 5 2 7 0"/><path d="M27 28l-1 3M30 29v3M33 28l1 3"/><path d="M36 38c2 1 4 1 6-1"/></svg>',
  lash: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M10 30c12 12 32 12 44 0"/><path d="M16 35l-4 7M22 38l-2 8M29 40l-1 8M36 40l1 8M42 38l2 8M48 35l4 7"/></svg>',
  nail: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M24 56V26c0-8 4-14 8-14s8 6 8 14v30"/><path d="M26 30c0-6 3-10 6-10s6 4 6 10v8H26z"/><path d="M32 6l1.5 3 3 1.5-3 1.5L32 15l-1.5-3-3-1.5 3-1.5z"/></svg>',
  bottle: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="22" y="22" width="20" height="34" rx="4"/><path d="M27 22v-6h10v6M29 16v-6h6v6"/><path d="M26 34h12M26 40h12"/></svg>',
  jar: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M16 30h32v18a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z"/><rect x="14" y="22" width="36" height="8" rx="2"/><path d="M24 42h16"/></svg>',
  gift: '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="12" y="26" width="40" height="28"/><rect x="10" y="20" width="44" height="8"/><path d="M32 20v34M32 20c-4-8-14-8-12-2 1 3 8 2 12 2zm0 0c4-8 14-8 12-2-1 3-8 2-12 2z"/></svg>',
  lotus: '<svg viewBox="0 0 80 40" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M40 4c6 8 6 20 0 32-6-12-6-24 0-32z"/><path d="M40 36c-8-4-18-6-28-4 6-8 16-10 28 4zm0 0c8-4 18-6 28-4-6-8-16-10-28 4z"/><path d="M40 36c-4-6-12-14-22-16 2 8 10 14 22 16zm0 0c4-6 12-14 22-16-2 8-10 14-22 16z"/></svg>'
};
ICONS.brow = '<svg class="card__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M10 30c8-8 30-10 44-2"/><path d="M14 40c10 8 26 8 36 0"/><circle cx="32" cy="40" r="5"/></svg>';
const LABELS = { facial: "Facial", lash: "Lash", brow: "Brow", pmu: "PMU & Brows", nail: "Nail & Pedicure" };

/* ---------- Thư viện ảnh (thư mục images/gallery) ---------- */
const GALLERY = {
  results: [
    ["result-6", "Skin Transformation — ICD Radiansome™100, after 2 months"],
    ["result-1", "Real Results — after a facial + 2 weeks of home care"],
    ["result-2", "The Eye Ritual — a smoother-looking eye area"],
    ["result-3", "Visible Clarity — clearer-looking skin"],
    ["result-4", "The Pore Reset — cleaner, balanced pores"],
    ["result-5", "Pore Clarity"]
  ],
  looks: [
    ["look-1", "Emerald Gilded — nail art"], ["look-5", "Cateye Hybrid lash"], ["look-2", "Ocean Breeze — nail art"],
    ["look-6", "Dolly Wispy lash"], ["look-3", "Timeless Grace — nail art"], ["look-8", "Light in Balance — LED"],
    ["look-4", "Citrus Pop — nail art"], ["look-9", "The Quiet Touch — facial"], ["look-7", "Violet Restore — LED"]
  ],
  space: [
    ["space-3", "The Beauty Room"], ["space-1", "Private Facial Room"], ["space-5", "Inside the Ritual"],
    ["space-2", "A Relaxing Beauty Space"], ["space-4", "Where beauty becomes a ritual"]
  ],
  rituals: [
    ["ritual-3", "Gilded Rest"], ["ritual-1", "Scalp Reset"], ["ritual-2", "The Root Ritual"], ["ritual-4", "Before the Glow"]
  ],
  pmu: [
    ["pmu-1", "Before & after — PMU brows"], ["pmu-2", "Before & after — PMU brows"], ["pmu-3", "Before & after — PMU brows"],
    ["pmu-4", "Before & after — soft powder"], ["pmu-5", "Before & after — combo brows"], ["pmu-6", "Nano combo brows"],
    ["pmu-7", "Nano combo brows, two angles"], ["pmu-8", "Fresh brows, right after"], ["pmu-9", "Brow mapping before we start"]
  ],
  nails: [
    ["nail-1", "Pastel pink with line art & gems"], ["nail-2", "Red & black swirl stilettos"], ["nail-3", "White French with leaf art"],
    ["nail-4", "Red ombre with 3D flowers & gems"], ["nail-5", "Green marble with gold foil"], ["nail-6", "Nude with gold French & stars"],
    ["nail-7", "Blue & white porcelain with 3D flowers"], ["nail-8", "Black & clear with hearts and lips"], ["nail-9", "Matte red with gems & sweater texture"],
    ["nail-10", "Neon pink ombre with glitter line"], ["nail-11", "Red, white & blue French"], ["nail-12", "Green French with black outline"],
    ["nail-13", "Mint & amber with butterfly wings"], ["nail-14", "Burgundy French with tiny hearts"], ["nail-15", "Red & white bow French"],
    ["nail-16", "Silver chrome with 3D effect"]
  ]
};

/* ---------- Skincare Riman (trang chủ) — bấm vào sản phẩm sẽ mở link mua ---------- */
const RIMAN_LINK = "https://tuongvyanna.riman.com";
const RIMAN = [
  { name: "Incellderm EX Line", desc: "Deep nourishment for smoother, brighter, younger-looking skin.", image: "images/riman-ex-line.webp", tag: "Skincare" },
  { name: "Radiansome 100", desc: "An intensive serum for brighter, firmer skin — see the glow in just 5 days.", image: "images/riman-radiansome.webp", tag: "Serum" },
  { name: "Cleanse • Protect • Hydrate", desc: "The complete 3-step routine: cleanse, protect and hydrate every day.", image: "images/riman-icd-set.webp", tag: "3-Step Set" },
  { name: "Collagen Melting Mask", desc: "A 100% collagen mask for instantly firmer, brighter skin.", image: "images/riman-collagen-mask.webp", tag: "Mask" }
];

/* ---------- Video (thư mục videos) ----------
   [tên file, tiêu đề, hướng "v" dọc / "h" ngang, thời lượng]
   Mỗi video có 3 file: tên.mp4 (đầy đủ, có tiếng), tên-preview.mp4 (6 giây), tên.jpg (ảnh bìa) */
const VIDEOS = [
  ["v-lash-story", "Lash extensions — a client's story", "v", "1:00"],
  ["v-luxury-facial", "Angel Nails Luxury Facial", "v", "6:56"],
  ["v-microneedling", "Skin rejuvenation with microneedling", "v", "0:31"],
  ["v-beyond-skincare", "Beyond Skincare — a relaxing mask", "v", "0:22"],
  ["v-first-visit", "Your first-visit facial", "v", "0:49"],
  ["v-moment", "Take a moment for yourself", "v", "0:34"],
  ["v-men-facial", "Self-care for men", "v", "0:48"],
  ["v-todays-story", "Today's story — a day at V Angel", "v", "6:37"],
  ["v-firming-facial", "Firming & Collagen-Boosting Facial", "h", "2:00"],
  ["v-signature-facial", "Signature facial — fresh, plump skin", "h", "1:40"],
  ["v-behind", "Behind the scenes at V Angel", "h", "0:27"]
];
