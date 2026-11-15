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
  ["about", "index.html#ve-chung-toi", "About"]
];

$("#site-header").outerHTML = `
  <div class="announce">
    First Visit Special: facial just <strong>$79</strong> <s>$120</s>
    <a href="#" data-book>Book now →</a>
  </div>
  <header class="header" id="top">
    <div class="container header__inner">
      <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <a href="index.html" class="header__logo" aria-label="V Angel - Home">
        <img src="images/logo.png" alt="V Angel — Facial • Lash • Nail" />
      </a>
      <nav class="nav" aria-label="Main menu">
        ${NAV.map(([k, h, t]) => `<a href="${h}"${k === PAGE ? ' class="is-current" aria-current="page"' : ""}>${t}</a>`).join("")}
        <a href="#" class="nav__book" data-book>Book an appointment</a>
      </nav>
      <div class="header__right">
        <a href="#" class="btn btn--gold header__cta" data-book>Book Now</a>
      </div>
    </div>
  </header>`;

/* ---------- Footer + popup + giỏ hàng ---------- */
$("#site-footer").outerHTML = (PAGE === "salon" ? "" : `
  <section class="contact" id="lien-he">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Visit us</p>
        <h2>${SALON.name} — 2 locations</h2>
      </div>
      <div class="locs">${LOCATIONS.map(locationCard).join("")}</div>
      <div class="contact__bar">
        <a href="tel:${SALON.phoneLink}" class="cphone"><span>Nails</span><strong>${SALON.phone}</strong></a>
        <a href="tel:${SALON.ownerLink}" class="cphone"><span>Owner — Vi · Facial, Lash, Skincare</span><strong>${SALON.owner}</strong></a>
        ${socialHTML()}
      </div>
    </div>
  </section>`) + `

  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <a href="index.html" class="footer__logo"><img src="images/logo.png" alt="V Angel" loading="lazy" /></a>
          <p class="footer__slogan">Your Beauty. Our Passion.</p>
          ${socialHTML("social-icons--dark")}
        </div>
        <div class="footer__cols">
          <details class="footer__col" open>
            <summary>Services</summary>
            <a href="treatments.html?loai=facial">Facial</a>
            <a href="treatments.html?loai=lash">Lash</a>
            <a href="treatments.html?loai=brow">Brow</a>
            <a href="treatments.html?loai=nail">Nail & Pedicure</a>
          </details>
          <details class="footer__col" open>
            <summary>V Angel</summary>
            <a href="salon.html#springdale">Springdale location</a>
            <a href="salon.html#bentonville">Bentonville location</a>
            <a href="index.html#ve-chung-toi">About</a>
            <a href="#" data-book>Book now</a>
          </details>
          <details class="footer__col" open>
            <summary>Help</summary>
            <a href="salon.html#faq">FAQ</a>
            <a href="tel:${SALON.phoneLink}">Nails: ${SALON.phone}</a>
            <a href="tel:${SALON.ownerLink}">Vi: ${SALON.owner}</a>
            <a href="treatments.html#bang-gia">Full price list</a>
          </details>
        </div>
      </div>
      <div class="footer__bottom">
        <p>© ${new Date().getFullYear()} V Angel. All rights reserved.</p>
        <a href="#top">Back to top ↑</a>
      </div>
    </div>
  </footer>

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
    <div class="platinum__media"><img src="images/svc-platinum.webp" alt="Platinum facial at V Angel" loading="lazy" /></div>
    <div class="platinum__tiers">${PLATINUM.map(p => `
      <div class="tier tier--${p.tier.toLowerCase().replace(/\s+/g, "-")}">
        <div class="tier__head"><span class="tier__crown" aria-hidden="true">♛</span><span class="tier__name">${p.tier}</span></div>
        <h3>${p.name}</h3>
        <p class="tier__meta">${p.duration} · <strong>${p.price}</strong></p>
        <p class="tier__desc">${p.desc}</p>
        <a href="#" class="link-gold" data-book="${p.name}">Book →</a>
      </div>`).join("")}
    </div>`;
});

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
      <video src="videos/${f}-preview.mp4" poster="videos/${f}.jpg" muted loop playsinline preload="none" aria-hidden="true"></video>
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
      vmv.poster = `videos/${v[0]}.jpg`; vmv.src = `videos/${v[0]}.mp4`; $("#vmTitle").textContent = v[1];
      vm.classList.add("is-open"); lockScroll(true); vmv.play().catch(() => {});
      return;
    }
    if (vm.classList.contains("is-open") && (e.target.closest("[data-vm-close]") || e.target === vm)) closeVm();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && vm.classList.contains("is-open")) closeVm(); });
}
