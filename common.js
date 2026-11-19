/* Video: tren GitHub Pages / may tinh dung thu muc videos/ co san; tren ten mien rieng (vangelbeauty.com) phat video tu ban GitHub */
const VBASE = /github\.io$|^localhost$|^127\.0\.0\.1$/.test(location.hostname) ? "videos/" : "https://vemeo5238-sudo.github.io/vi/videos/";
/* =========================================================
   PHẦN DÙNG CHUNG CHO MỌI TRANG
   Header, footer, popup đặt lịch, thẻ dịch vụ, thư viện ảnh
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const PAGE = document.body.dataset.page || "";

/* ---------- Biểu tượng mạng xã hội ---------- */
function socialHTML(extra = "") {
  const I = {
    Facebook: '<path d="M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3h2.8V22z" fill="currentColor"/>',
    Instagram: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" stroke-width="1.9"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor"/>',
    TikTok: '<path d="M16.7 5.6A4.4 4.4 0 0 1 15.6 2.7h-3.2v12.8a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.6a6 6 0 1 0 5.1 5.9V9a7.6 7.6 0 0 0 4.4 1.4V7.2a4.4 4.4 0 0 1-3.3-1.6z" fill="currentColor"/>'
  };
  return `<div class="social-icons ${extra}">${Object.entries(SALON.social).map(([n, u]) =>
    `<a href="${u}" target="_blank" rel="noopener" aria-label="V Angel on ${n}" title="${n}"><svg viewBox="0 0 24 24" aria-hidden="true">${I[n] || ""}</svg></a>`).join("")}</div>`;
}

/* ---------- Header ---------- */
const NAV = [
  ["treatments", "treatments.html", "Services"],
  ["prices", "treatments.html#bang-gia", "Price List"],
  ["salon", "salon.html", "Locations"],
  ["vip", "vip.html", "VIP Membership"]
];

$("#site-header").outerHTML = `
  <div class="announce">
    First Visit Special: <strong>40% off</strong> your first facial
    <a href="#" data-book>Book now →</a>
  </div>
  <header class="header" id="top">
    <div class="container header__inner">
      <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a href="index.html" class="header__logo" aria-label="V Angel - Home">
        <img src="images/logo-header.webp" alt="V Angel — Facial • Lash • Nail" width="700" height="261" />
      </a>
      <nav class="nav" aria-label="Main menu">
        ${NAV.map(([k, h, t]) => `<a href="${h}"${k === PAGE ? ' class="is-current" aria-current="page"' : ""}>${t}</a>`).join("")}
        <a href="#" class="nav__book" data-book>Book an appointment</a>
      </nav>
      <div class="header__right">
        <button class="hicon" data-search-open aria-label="Search services"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button>
        <a class="hicon" href="${typeof RIMAN_LINK !== "undefined" ? RIMAN_LINK : "#"}" target="_blank" rel="noopener" aria-label="Shop Riman skincare"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></a>
        <a class="hicon" href="salon.html" aria-label="Locations &amp; contact"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></a>
        <a href="#" class="btn btn--gold header__cta" data-book>Book Now</a>
      </div>
    </div>
  </header>
  <div class="search-panel" id="searchPanel" aria-hidden="true">
    <form class="search-panel__form" action="treatments.html" role="search">
      <input type="search" name="q" placeholder="Search treatments, products, or ask a question" aria-label="Search treatments" />
      <button type="submit" class="btn btn--gold">Search</button>
      <button type="button" class="search-panel__close" data-search-close aria-label="Close search">×</button>
    </form>
  </div>`;
/* Ô tìm kiếm ở đầu trang */
document.addEventListener("click", e => {
  if (e.target.closest("[data-search-open]")) { const p = $("#searchPanel"); p.classList.add("is-open"); p.setAttribute("aria-hidden", "false"); setTimeout(() => $("input", p).focus(), 50); }
  if (e.target.closest("[data-search-close]")) { const p = $("#searchPanel"); p.classList.remove("is-open"); p.setAttribute("aria-hidden", "true"); }
});

/* ---------- Footer + popup + giỏ hàng ---------- */
$("#site-footer").outerHTML = (PAGE === "salon" ? "" : `
  <section class="contact" id="lien-he">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Visit us</p>
        <h2>${SALON.name} — 2 locations</h2>
      </div>
      <div class="locs locs--photo">${LOCATIONS.map(locPhotoCard).join("")}</div>
    </div>
  </section>`) + `

  <footer class="fx">
    <div class="fx__wrap">
      <div class="fx__founder">
        <img src="images/founder.webp" alt="Vi, founder of V Angel" loading="lazy" />
        <div>
          <p class="fx__name">Vi</p>
          <p class="fx__role">Founder &amp; Owner</p>
          <a href="#" class="fx__meet" data-meet>Meet Vi</a>
        </div>
      </div>
      <div class="fx__cols">
        <details class="fx__acc">
          <summary>Services<span class="fx__plus" aria-hidden="true"></span></summary>
          <a href="treatments.html?loai=facial">Facials</a>
          <a href="treatments.html?loai=lash">Lash extensions &amp; lash lift</a>
          <a href="treatments.html?loai=brow">Brows &amp; waxing</a>
          <a href="treatments.html?loai=nail">Nails &amp; pedicures</a>
          <a href="treatments.html#bang-gia">Full price list</a>
        </details>
        <details class="fx__acc">
          <summary>Spas<span class="fx__plus" aria-hidden="true"></span></summary>
          <a href="salon.html#springdale">Springdale</a>
          <a href="salon.html#bentonville">Bentonville</a>
          <a href="salon.html#uu-dai">Spa offers</a>
          <a href="#" data-book>Book an appointment</a>
        </details>
        <details class="fx__acc">
          <summary>Shop<span class="fx__plus" aria-hidden="true"></span></summary>
          <a href="${typeof RIMAN_LINK !== "undefined" ? RIMAN_LINK : "#"}" target="_blank" rel="noopener">Riman Incellderm skincare ↗</a>
          <a href="index.html#riman">Featured products</a>
          <a href="sms:${SALON.ownerLink}">Ask Vi for a recommendation</a>
        </details>
        <details class="fx__acc">
          <summary>Help<span class="fx__plus" aria-hidden="true"></span></summary>
          <a href="salon.html#faq">FAQ</a>
          <a href="tel:${SALON.phoneLink}">Nails: ${SALON.phone}</a>
          <a href="tel:${SALON.ownerLink}">Facial, lash &amp; skincare (Vi): ${SALON.owner}</a>
          <a href="salon.html">Directions &amp; hours</a>
        </details>
      </div>
      <div class="fx__social">${socialHTML()}</div>
      <div class="fx__disc">
        <p class="fx__disc-title">Disclaimer</p>
        <p class="fx__disc-text" id="fxDisc">Results vary from person to person and are not guaranteed. Prices shown are starting prices and may change depending on length, design, add-ons and the condition of your skin, lashes or nails — we will always confirm your price before we begin. Riman Incellderm products are offered through an independent Riman shop link; product information is available on request. Our facial and skincare services are cosmetic and are not a substitute for medical advice. Please tell us about any allergies, medications or skin conditions before your treatment.</p>
        <button class="fx__more" id="fxMore" aria-expanded="false">Read more</button>
      </div>
    </div>
    <div class="fx__bottom">
      <nav class="fx__legal" aria-label="Footer">
        <a href="treatments.html#bang-gia">Price list</a><a href="vip.html">VIP Membership</a><a href="salon.html">Locations</a><a href="salon.html#faq">FAQ</a><a href="#" data-book>Book now</a><a href="#top">Back to top</a>
      </nav>
      <p class="fx__copy">© ${new Date().getFullYear()} V Angel Facial &amp; Nail Spa</p>
    </div>
  </footer>

  <!-- Câu chuyện của Vi -->
  <div class="modal" id="meetModal" aria-hidden="true">
    <div class="modal__backdrop" data-meet-close></div>
    <div class="modal__box meet" role="dialog" aria-modal="true" aria-labelledby="meetTitle">
      <button class="modal__close" aria-label="Close" data-meet-close>×</button>
      <img class="meet__photo" src="images/founder.webp" alt="Vi, founder of V Angel" loading="lazy" />
      <p class="eyebrow">Our Story</p>
      <h2 id="meetTitle">Hi, I'm Vi — founder of V Angel Facial and Nail Spa.</h2>
      <p>I built this business on my own, step by step. I have owned my nail salon for 10 years, and 2 years ago I opened our facial and spa side — because I wanted to take care of the whole beauty of a woman, not just her nails.</p>
      <p>Everything I do, I do with my heart. I choose products carefully, I work slowly and honestly, and I always aim for the best possible result for your skin — healthy, glowing, and safe.</p>
      <p>I also have 5 years of professional lash experience. I don't do one lash style for everyone — I design the lash style for you, based on your eyes, your face, and the look you want: natural, soft, or bold.</p>
      <p class="meet__lead">That is V Angel: real skill, real care, and real results.</p>
      <p class="meet__sign">Welcome. <span>Your Beauty. Our Passion.</span></p>
      <a href="#" class="btn btn--gold" data-book>Book with Vi</a>
    </div>
  </div>

  <a href="#" class="sticky-book" data-book>Book Now</a>

  <!-- Popup đặt lịch -->
  <div class="modal" id="bookModal" aria-hidden="true">
    <div class="modal__backdrop" data-close></div>
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="bookTitle">
      <button class="modal__close" aria-label="Close" data-close>×</button>
      <p class="eyebrow eyebrow--gold">V Angel</p>
      <h2 id="bookTitle">Book an appointment</h2>
      <form id="bookForm" class="book-form">
        <label>Full name<input type="text" name="name" required /></label>
        <label>Phone number<input type="tel" name="phone" required pattern="[0-9 +]{9,15}" /></label>
        <label>Location<select name="branch" id="branchSelect" required>
          ${LOCATIONS.map(l => `<option value="${l.id}">${l.name} — ${l.address}</option>`).join("")}
        </select></label>
        <p class="book-form__hint" id="branchHint"></p>
        <label>Service<select name="service" id="serviceSelect" required></select></label>
        <div class="book-form__row">
          <label>Date<input type="date" name="date" id="bookDate" required /></label>
          <label>Time<select name="time" required>
            ${["09:30","10:00","10:30","11:00","11:30","12:00","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"].map(t => { const [h, m] = t.split(":").map(Number); return `<option value="${t}">${(h % 12) || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}</option>`; }).join("")}
          </select></label>
        </div>
        <label>Notes<textarea name="note" rows="2" placeholder="Skin concerns, lash or nail style you'd like…"></textarea></label>
        <button type="submit" class="btn btn--gold btn--block">Request appointment</button>
      </form>
      <div class="modal-done" id="bookDone" hidden>
        <h3>Thank you!</h3>
        <p>We've received your request and will call to confirm as soon as possible. Need it sooner? Nails: <a href="tel:${SALON.phoneLink}">${SALON.phone}</a> · Vi: <a href="tel:${SALON.ownerLink}">${SALON.owner}</a></p>
        <button class="btn btn--outline" data-close>Close</button>
      </div>
    </div>
  </div>`;

/* Chân trang: máy tính luôn mở 4 cột, điện thoại bấm "+" để mở */
const fxDesk = matchMedia("(min-width: 901px)");
const fxSync = () => $$(".fx__acc").forEach(d => d.open = fxDesk.matches);
fxSync(); fxDesk.addEventListener("change", fxSync);
$$(".fx__acc summary").forEach(su => su.addEventListener("click", e => { if (fxDesk.matches) e.preventDefault(); }));

/* ---------- Meet Vi + Disclaimer "Read more" ---------- */
document.addEventListener("click", e => {
  const m = $("#meetModal");
  if (e.target.closest("[data-meet]")) { e.preventDefault(); m.classList.add("is-open"); m.setAttribute("aria-hidden", "false"); lockScroll(true); }
  if (e.target.closest("[data-meet-close]")) { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); lockScroll(false); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#meetModal").classList.contains("is-open")) { $("#meetModal").classList.remove("is-open"); lockScroll(false); } });
$("#fxMore").addEventListener("click", () => {
  const open = $("#fxDisc").classList.toggle("is-open");
  $("#fxMore").textContent = open ? "Read less" : "Read more"; $("#fxMore").setAttribute("aria-expanded", open);
});

/* Trang có chỗ đặt sẵn (#contact-slot): đưa khối "Visit us — 2 locations" lên đó */
if ($("#contact-slot") && $("#lien-he")) $("#contact-slot").replaceWith($("#lien-he"));

/* ---------- Thẻ chi nhánh kiểu ảnh nền (theo mẫu) ---------- */
function locPhotoCard(l) {
  return `
    <article class="lphoto">
      <img class="lphoto__bg" src="${l.photo}" alt="" aria-hidden="true" loading="lazy" />
      <div class="lphoto__body">
        <h3 class="lphoto__city">${l.name}</h3>
        <p>${l.address}</p>
        <div class="lphoto__svcs">${(l.phones || []).map(([lbl, num, link, note]) => `
          <div class="lphoto__svc"><strong>${lbl}</strong><a href="tel:${link}">${num}</a>${note ? `<em>${note}</em>` : ""}</div>`).join("")}
        </div>
        <a class="lphoto__visit" href="salon.html#${l.id}">Visit this spa</a>
      </div>
    </article>`;
}

/* ---------- Thẻ chi nhánh ---------- */
function locationCard(l) {
  const q = encodeURIComponent(l.address);
  return `
    <article class="loc">
      <p class="loc__label">${l.label}</p>
      <h3>${l.name}</h3>
      <p class="loc__addr">${l.address}</p>
      <div class="loc__tags">${l.services.map(x => `<span>${x}</span>`).join("")}</div>
      <p class="loc__policy"><strong>${l.walkin ? "Nail walk-ins welcome" : "By appointment only"}</strong><br>${l.policy}</p>
      <ul class="loc__hours">${l.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join("")}</ul>
      <div class="btn-row">
        <a href="#" class="btn btn--gold" data-book="" data-branch="${l.id}">Book at ${l.name}</a>
        <a href="https://www.google.com/maps/search/?api=1&query=${q}" class="link-gold" target="_blank" rel="noopener">Directions ↗</a>
      </div>
    </article>`;
}

/* ---------- Thẻ dịch vụ ---------- */
function treatmentCard(t, i = 0) {
  const media = t.image ? `<img src="${t.image}" alt="${t.name}" loading="lazy" />` : ICONS[t.category];
  return `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card__media card__media--${t.category}">
        ${media}
        <span class="card__tag">${LABELS[t.category]}</span>
        ${t.badge ? `<span class="card__badge">${t.badge}</span>` : ""}
      </div>
      <div class="card__body">
        <h3 class="card__title">${t.name}</h3>
        <div class="card__meta">${t.duration ? `<span>${t.duration}</span><span class="dot"></span>` : ""}<span class="card__price">${t.price}</span></div>
        <p class="card__desc">${t.desc}</p>
        ${t.steps && t.steps.length ? `<details class="card__more">
          <summary>Includes</summary>
          <ul>${t.steps.map(s => `<li>${s}</li>`).join("")}</ul>
        </details>` : ""}
        <div class="card__actions"><a href="#" class="btn btn--outline" data-book="${t.name}">Book</a></div>
      </div>
    </article>`;
}

/* ---------- Thẻ đánh giá ---------- */
const reviewCard = r => `
  <figure class="review">
    <div class="stars" aria-label="5 sao">★★★★★</div>
    <blockquote>“${r.text}”</blockquote>
    <figcaption><strong>${r.name}</strong><span>${r.service}</span></figcaption>
  </figure>`;

/* ---------- Menu điện thoại ---------- */
const burger = $(".burger"), nav = $(".nav");
const setNavTop = () => document.documentElement.style.setProperty("--nav-top", $(".header").getBoundingClientRect().bottom + "px");
burger.addEventListener("click", () => {
  setNavTop();
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.closest("a")) { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", false); }
});
addEventListener("scroll", () => nav.classList.contains("is-open") && setNavTop(), { passive: true });

/* ---------- Popup đặt lịch ---------- */
const modal = $("#bookModal"), bookForm = $("#bookForm"), bookDone = $("#bookDone"), serviceSelect = $("#serviceSelect");
const branchSelect = $("#branchSelect");
function fillServices(branchId, keep) {
  const loc = LOCATIONS.find(l => l.id === branchId) || LOCATIONS[0];
  serviceSelect.innerHTML = '<option value="">— Choose a service —</option>' +
    loc.cats.map(cat => `<optgroup label="${LABELS[cat]}">` +
      TREATMENTS.filter(t => t.category === cat).map(t => `<option>${t.name}</option>`).join("") + "</optgroup>").join("") +
    (loc.cats.includes("facial") ? '<optgroup label="Platinum Facial Collection">' + PLATINUM.map(t => `<option>${t.name}</option>`).join("") + "</optgroup>" : "") +
    "<option>Not sure — I'd like advice</option>";
  if (keep && [...serviceSelect.options].some(o => o.value === keep)) serviceSelect.value = keep;
  $("#branchHint").textContent = loc.policy;
}
branchSelect.addEventListener("change", () => fillServices(branchSelect.value, serviceSelect.value));
/* Chọn chi nhánh phù hợp với dịch vụ (VD dịch vụ nail chỉ có ở Springdale) */
function branchFor(service) {
  const t = TREATMENTS.find(x => x.name === service);
  return t && t.category === "nail" ? "springdale" : null;
}
$("#bookDate").min = new Date().toISOString().split("T")[0];

function lockScroll(on) { document.body.style.overflow = on ? "hidden" : ""; }
function openBook(service, branch) {
  bookForm.hidden = false; bookDone.hidden = true; bookForm.reset();
  branchSelect.value = branch || branchFor(service) || LOCATIONS[0].id;
  fillServices(branchSelect.value, service);
  modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); lockScroll(true);
  setTimeout(() => $("input", bookForm).focus(), 50);
}
function closeBook() { modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); lockScroll(false); }

bookForm.addEventListener("submit", e => {
  e.preventDefault();
  // TODO: gửi dữ liệu tới Google Sheet / Zalo / email tại đây
  console.log("Booking:", Object.fromEntries(new FormData(bookForm)));
  bookForm.hidden = true; bookDone.hidden = false;
});

/* ---------- Xử lý click chung ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const book = t.closest("[data-book]");
  if (book) { e.preventDefault(); openBook(book.dataset.book, book.dataset.branch); return; }
  if (t.closest("[data-close]")) closeBook();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeBook(); });


/* ---------- Hiệu ứng hiện dần khi cuộn ---------- */
const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
}), { threshold: .12 }) : null;
$$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("is-in"));

/* Lấy tham số ?loai= trên URL */
const urlParam = k => new URLSearchParams(location.search).get(k);

/* Hoa sen trang trí */
$$(".lotus").forEach(el => el.innerHTML = ICONS.lotus);

/* ---------- Thư viện ảnh + xem ảnh lớn ---------- */
function galleryHTML(list, group) {
  return list.map(([f, cap], i) => `
    <button class="gitem" data-lightbox="${group}" data-i="${i}" aria-label="View photo: ${cap}">
      <img src="images/gallery/${f}.webp" alt="${cap}" loading="lazy" />
      <span class="gitem__cap">${cap}</span>
    </button>`).join("");
}
document.body.insertAdjacentHTML("beforeend", `
  <div class="lightbox" id="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button class="lightbox__close" data-lb-close aria-label="Close">×</button>
    <button class="lightbox__nav lightbox__nav--prev" data-lb-step="-1" aria-label="Previous photo">‹</button>
    <figure><img id="lbImg" alt="" /><figcaption id="lbCap"></figcaption></figure>
    <button class="lightbox__nav lightbox__nav--next" data-lb-step="1" aria-label="Next photo">›</button>
  </div>`);
const lb = { el: $("#lightbox"), group: null, i: 0 };
function lbShow() {
  const [f, cap] = GALLERY[lb.group][lb.i];
  $("#lbImg").src = `images/gallery/${f}.webp`; $("#lbImg").alt = cap; $("#lbCap").textContent = cap;
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-lightbox]");
  if (g) { lb.group = g.dataset.lightbox; lb.i = +g.dataset.i; lbShow(); lb.el.classList.add("is-open"); lockScroll(true); return; }
  const st = e.target.closest("[data-lb-step]");
  if (st) { const n = GALLERY[lb.group].length; lb.i = (lb.i + +st.dataset.lbStep + n) % n; lbShow(); return; }
  if (e.target.closest("[data-lb-close]") || e.target === lb.el || e.target.tagName === "FIGURE") { lb.el.classList.remove("is-open"); lockScroll(false); }
});
document.addEventListener("keydown", e => {
  if (!lb.el.classList.contains("is-open")) return;
  if (e.key === "Escape") { lb.el.classList.remove("is-open"); lockScroll(false); }
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const n = GALLERY[lb.group].length; lb.i = (lb.i + (e.key === "ArrowRight" ? 1 : -1) + n) % n; lbShow(); }
});
/* Vuốt trái/phải trên điện thoại */
let lbX = null;
lb.el.addEventListener("touchstart", e => lbX = e.touches[0].clientX, { passive: true });
lb.el.addEventListener("touchend", e => {
  if (lbX === null) return; const dx = e.changedTouches[0].clientX - lbX; lbX = null;
  if (Math.abs(dx) > 50) { const n = GALLERY[lb.group].length; lb.i = (lb.i + (dx < 0 ? 1 : -1) + n) % n; lbShow(); }
});

/* ---------- Platinum Facial Collection ---------- */
$$("[data-platinum]").forEach(el => {
  el.innerHTML = `
    <div class="platinum__media platinum__vip">
      <span class="vip__crown" aria-hidden="true">♛</span>
      <p class="vip__kicker">Exclusive</p>
      <h3 class="vip__title">VIP Member<br />Package</h3>
      <span class="vip__rule" aria-hidden="true"></span>
      <p class="vip__sub">Platinum Facial Collection</p>
      <a href="vip.html" class="vip__more">View VIP Memberships →</a>
    </div>
    <div class="platinum__tiers">${PLATINUM.map((p, i) => `
      <div class="tier tier--${p.tier.toLowerCase().replace(/\s+/g, "-")}">
        <div class="tier__head"><span class="tier__crown" aria-hidden="true">♛</span><span class="tier__name">${p.tier}</span></div>
        <h3>${p.name}</h3>
        <p class="tier__meta">${p.duration ? p.duration + " · " : "From "}<strong>${p.price}</strong></p>
        <p class="tier__desc">${p.desc}</p>
        <a href="#" class="link-gold" data-vipd="${i}">Book →</a>
      </div>`).join("")}
    </div>`;
});

/* Bảng chi tiết khi bấm "Book" trong khung VIP */
if ($("[data-platinum]")) {
  const vd = document.createElement("div");
  vd.className = "modal vipd"; vd.id = "vipdModal"; vd.setAttribute("aria-hidden", "true");
  vd.innerHTML = '<div class="modal__backdrop" data-vipd-close></div><div class="modal__box vipd__box" role="dialog" aria-modal="true" aria-labelledby="vipdTitle"><button class="modal__close" aria-label="Close" data-vipd-close>×</button><div id="vipdBody"></div></div>';
  document.body.appendChild(vd);
  const closeVd = () => { vd.classList.remove("is-open"); vd.setAttribute("aria-hidden", "true"); lockScroll(false); };
  const openVd = i => {
    const p = PLATINUM[i], v = p.vip, cls = p.tier.toLowerCase().replace(/\s+/g, "-");
    $("#vipdBody").innerHTML = `
      <div class="vipd__head tier--${cls}">
        <span class="tier__crown" aria-hidden="true">♛</span><span class="vipd__tier">${p.tier}</span>
        <h3 id="vipdTitle">${p.name}</h3>
        <p class="vipd__meta">${p.duration ? p.duration + " · " : ""}<strong>${p.price}</strong> single session</p>
        <p class="vipd__desc">${p.desc}</p>
      </div>
      <div class="vipd__grid">
        <div>
          <h4>What's included</h4>
          <ul class="vipm-list">${p.includes.map(x => `<li>${x}</li>`).join("")}</ul>
          <p class="vipd__best"><strong>Best for:</strong> ${p.best}</p>
          ${p.note ? `<p class="vipd__note">${p.note}</p>` : ""}
        </div>
        <div>
          <h4>Pricing &amp; packages</h4>
          <table class="vipd__table">
            <tr><td>Single session</td><td>${p.price}</td></tr>
            <tr><td>3-session package</td><td>${p.p3}</td></tr>
            <tr><td>6-session package</td><td>${p.p6}</td></tr>
          </table>
          <div class="vipd__vip">
            <p class="vipd__vipname">♛ ${v.name} · 12 sessions</p>
            <p class="vipd__vipprice">${v.price}<span> / year</span></p>
            <p class="vipd__vipsave">Pay for 10, get 2 FREE · Save ${v.save}</p>
            <p class="vipd__pay">Or split: 2 × ${v.pay[0]} · 3 × ${v.pay[1]} · 5 × ${v.pay[2]}</p>
          </div>
        </div>
      </div>
      <div class="vipd__actions">
        <a href="#" class="btn btn--gold" data-book="${p.name}">Book this facial</a>
        <a href="vip.html#memberships" class="btn btn--outline">View VIP Memberships</a>
      </div>
      <p class="vipd__fine">By appointment only · Call or text Vi <a href="tel:+18572188777">(857) 218-8777</a>${v.pay[1].includes("*") ? " · *Final installment may vary slightly due to rounding." : ""}</p>`;
    vd.classList.add("is-open"); vd.setAttribute("aria-hidden", "false"); lockScroll(true);
    setTimeout(() => $(".modal__close", vd).focus(), 50);
  };
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-vipd]");
    if (t) { e.preventDefault(); openVd(+t.dataset.vipd); }
  });
  vd.addEventListener("click", e => {
    if (e.target.closest("[data-vipd-close]")) closeVd();
    else if (e.target.closest("[data-book]")) closeVd();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && vd.classList.contains("is-open")) closeVd(); });
}

/* ---------- Skincare Riman: cả thẻ là link mở cửa hàng Riman ---------- */
$$("[data-riman]").forEach(el => {
  el.innerHTML = RIMAN.map(p => `
    <a class="rcard" href="${RIMAN_LINK}" target="_blank" rel="noopener" aria-label="Shop ${p.name} at the Riman store">
      <div class="rcard__media">${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" />` : `<span class="rcard__mono">Collagen<br><em>Melting Mask</em></span>`}
        <span class="card__tag">${p.tag}</span></div>
      <div class="rcard__body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="rcard__cta">Shop now ↗</span>
      </div>
    </a>`).join("");
});

/* Tự điền thư viện vào các khối có data-gallery */
$$("[data-gallery]").forEach(el => el.innerHTML = galleryHTML(GALLERY[el.dataset.gallery], el.dataset.gallery));

/* ---------- Video: bản xem trước tự chạy khi cuộn tới, bấm để xem đầy đủ có tiếng ----------
   <div data-videos="v"> = video dọc, "h" = video ngang, "all" = tất cả */
const PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
$$("[data-videos]").forEach(el => {
  const kind = el.dataset.videos;
  const list = VIDEOS.filter(v => kind === "all" || v[2] === kind);
  el.innerHTML = list.map(([f, title, o, dur]) => `
    <button class="vcard vcard--${o}" data-video="${f}" aria-label="Watch video: ${title}">
      <video src="${VBASE}${f}-preview.mp4" poster="${VBASE}${f}.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>
      <span class="vcard__play">${PLAY_SVG}</span>
      <span class="vcard__info"><strong>${title}</strong><span>${dur}</span></span>
    </button>`).join("");
  const vio = new IntersectionObserver(es => es.forEach(en => en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause()), { threshold: .5 });
  $$("video", el).forEach(v => vio.observe(v));
});
/* Nút cuộn trái/phải cho hàng video */
$$("[data-scroll]").forEach(b => b.addEventListener("click", () => {
  const row = $(b.dataset.scroll); row.scrollBy({ left: (+b.dataset.dir) * row.clientWidth * .8, behavior: "smooth" });
}));

if ($("[data-videos]")) {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="vmodal" id="vmodal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="vmTitle">
      <button class="lightbox__close" data-vm-close aria-label="Close">×</button>
      <figure><video id="vmVideo" controls playsinline preload="metadata"></video><figcaption id="vmTitle"></figcaption></figure>
    </div>`);
  const vm = $("#vmodal"), vmv = $("#vmVideo");
  const closeVm = () => { vmv.pause(); vmv.removeAttribute("src"); vmv.load(); vm.classList.remove("is-open"); lockScroll(false); };
  document.addEventListener("click", e => {
    const c = e.target.closest("[data-video]");
    if (c) {
      const v = VIDEOS.find(x => x[0] === c.dataset.video);
      vm.classList.toggle("vmodal--v", v[2] === "v");
      vmv.poster = `${VBASE}${v[0]}.jpg`; vmv.src = `${VBASE}${v[0]}.mp4`; $("#vmTitle").textContent = v[1];
      vm.classList.add("is-open"); lockScroll(true); vmv.play().catch(() => {});
      return;
    }
    if (vm.classList.contains("is-open") && (e.target.closest("[data-vm-close]") || e.target === vm)) closeVm();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && vm.classList.contains("is-open")) closeVm(); });
}


/* ---------- Nút dịch ngôn ngữ (góc phải dưới, dùng Google Translate) ---------- */
(function () {
  const LANGS = [
    ["en", "English", "EN"], ["es", "Español (México)", "ES-MX"], ["vi", "Tiếng Việt", "VI"], ["mh", "Kajin M̧ajeļ", "MH"],
    ["zh-CN", "中文 (简体)", "中文"], ["ko", "한국어", "KO"], ["tl", "Tagalog", "TL"], ["lo", "ພາສາລາວ", "LO"],
    ["fr", "Français", "FR"], ["pt", "Português", "PT"], ["de", "Deutsch", "DE"], ["hi", "हिन्दी", "HI"],
    ["ja", "日本語", "JA"], ["ar", "العربية", "AR"]
  ];
  const ownVi = () => { try { return localStorage.getItem("va_lang") === "vi"; } catch (e) { return false; } };
  const setOwn = v => { try { v ? localStorage.setItem("va_lang", v) : localStorage.removeItem("va_lang"); } catch (e) {} };
  const getLang = () => { if (ownVi()) return "vi"; const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]+\/([^;]+)/); return m ? decodeURIComponent(m[1]) : "en"; };
  const setCookie = v => {
    const host = location.hostname, parts = host.split(".");
    const doms = ["", host]; if (parts.length > 1) doms.push("." + parts.slice(-2).join("."));
    doms.forEach(d => { document.cookie = "googtrans=" + v + ";path=/" + (d ? ";domain=" + d : "") + (v ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT"); });
  };
  const cur = getLang();
  const curShort = (LANGS.find(l => l[0] === cur) || LANGS[0])[2];

  const box = document.createElement("div");
  box.className = "lang notranslate"; box.setAttribute("translate", "no");
  box.innerHTML = `
    <div class="lang__menu" id="langMenu" role="menu" aria-label="Choose language" hidden>
      <p class="lang__head">Choose your language</p>
      ${LANGS.map(([c, n]) => `<button type="button" role="menuitem" data-lang="${c}" class="${c === cur ? "is-on" : ""}"><span>${n}</span>${c === cur ? "<i>✓</i>" : ""}</button>`).join("")}
    </div>
    <button type="button" class="lang__btn" aria-haspopup="true" aria-expanded="false" aria-controls="langMenu" title="Translate this page">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9M12 3C9.4 5.6 8.2 8.6 8.2 12s1.2 6.4 3.8 9"/></svg>
      <span class="lang__code">${curShort}</span>
    </button>
    <div id="gt_el" class="lang__gt"></div>`;
  document.body.appendChild(box);
  const btn = $(".lang__btn", box), menu = $("#langMenu", box);
  const toggle = on => { menu.hidden = !on; btn.setAttribute("aria-expanded", on); box.classList.toggle("is-open", on); };
  btn.addEventListener("click", e => { e.stopPropagation(); toggle(menu.hidden); });
  document.addEventListener("click", e => { if (!box.contains(e.target)) toggle(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });

  menu.addEventListener("click", e => {
    const b = e.target.closest("[data-lang]"); if (!b) return;
    const code = b.dataset.lang;
    toggle(false);
    if (code === getLang()) return;
    if (code === "en") { setCookie(""); setOwn(""); location.reload(); return; }
    if (code === "vi") { setCookie(""); setOwn("vi"); location.reload(); return; }
    setOwn("");
    setCookie("/en/" + code);
    location.reload();
  });

  window.vaGtInit = function () {
    new google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: LANGS.map(l => l[0]).join(","), autoDisplay: false }, "gt_el");
  };
  const s = document.createElement("script");
  s.src = "https://translate.google.com/translate_a/element.js?cb=vaGtInit"; s.async = true;
  document.body.appendChild(s);
})();
