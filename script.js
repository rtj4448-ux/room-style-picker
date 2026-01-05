// ====== Helpers ======
const $ = (id) => document.getElementById(id);

function colorDots(colors) {
  return (colors || [])
    .map(
      (c) =>
        `<span style="display:inline-block;width:18px;height:18px;border-radius:6px;background:${c};border:1px solid #e2e8f0;margin-left:6px;"></span>`
    )
    .join("");
}

function nowLabel() {
  const d = new Date();
  return d.toLocaleString("ar-SA");
}

function safeJsonParse(text, fallback) {
  try { return JSON.parse(text); } catch { return fallback; }
}

const KEY_SAVED = "savedDesigns";
const KEY_CART = "cartItems";
const KEY_CURRENT = "currentResult"; // ✅ النتيجة الحالية للعرض في results.html

// ====== Required Alert Button ======
$("visitBtn")?.addEventListener("click", () => {
  alert("شكراً لزيارة موقعي!");
});

// ====== Scroll buttons (Landing Page) ======
$("startBtn")?.addEventListener("click", () =>
  $("tool")?.scrollIntoView({ behavior: "smooth" })
);
$("heroBtn")?.addEventListener("click", () =>
  $("tool")?.scrollIntoView({ behavior: "smooth" })
);

// Smooth scroll for buttons with data-scroll
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-scroll");
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  });
});

// ====== Data (from data.json) ======
let DATA = null;

async function loadData() {
  const res = await fetch("./data.json?v=3");
  if (!res.ok) throw new Error("Failed to load data.json");
  DATA = await res.json();
}

function roomNameAr(roomType) {
  if (roomType === "bedroom") return "غرفة نوم";
  if (roomType === "living") return "غرفة معيشة";
  return "مكتب";
}

function buildRecommendation(roomType, styleKey) {
  const style = DATA.styles[styleKey];
  const room = DATA.roomRules[roomType];

  const items = [...style.items, ...(room?.extraItems || [])];

  return {
    title: `${style.name_ar} لـ ${roomNameAr(roomType)}`,
    hint: room?.hint_ar || "",
    colors: style.colors,
    items
  };
}

// ====== Product links (Amazon / IKEA / Noon) ======
function searchLink(site, query) {
  const q = encodeURIComponent(query);
  if (site === "amazon") return `https://www.amazon.sa/s?k=${q}`;
  if (site === "ikea") return `https://www.ikea.com/sa/ar/search/?q=${q}`;
  if (site === "noon") return `https://www.noon.com/saudi-ar/search?q=${q}`;
  return "#";
}

function productSearchLinks(styleKey, roomType) {
  const styleName = DATA.styles[styleKey].name_ar;
  const roomName = roomNameAr(roomType);

  const queries = [
    `${styleName} ${roomName} كنبة`,
    `${styleName} ${roomName} طاولة`,
    `${styleName} ${roomName} إضاءة`
  ];

  return `
    <div style="margin-top:12px;">
      <strong>روابط منتجات (بحث عام) + إضافة للسلة:</strong>
      <ul style="margin-top:8px;">
        ${queries.map((q) => `
          <li style="margin-bottom:10px;">
            <div><strong>${q}</strong></div>
            <div style="margin-top:6px;">
              <a href="${searchLink("amazon", q)}" target="_blank" rel="noopener noreferrer">Amazon</a>
              | <a href="${searchLink("ikea", q)}" target="_blank" rel="noopener noreferrer">IKEA</a>
              | <a href="${searchLink("noon", q)}" target="_blank" rel="noopener noreferrer">Noon</a>
            </div>
            <div style="margin-top:8px;">
              <button class="small-btn" data-addcart="1" data-query="${encodeURIComponent(q)}">أضف للسلة</button>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

function renderResult(rec, selections) {
  const result = $("result");
  if (!result) return;

  const productsHtml = productSearchLinks(selections.styleKey, selections.roomType);

  result.innerHTML = `
    <strong>اقتراحك: ${rec.title}</strong><br/>
    ${rec.hint ? `<div style="margin-top:8px; color:#64748b;">${rec.hint}</div>` : ""}
    <div style="margin-top:12px;">الألوان: ${colorDots(rec.colors)}</div>
    <div style="margin-top:12px;"><strong>عناصر مقترحة:</strong> ${rec.items.join("، ")}</div>
    ${productsHtml}
  `;
}

function fillExtraSections(rec, selections) {
  const paletteBox = $("paletteBox");
  if (paletteBox) {
    paletteBox.innerHTML = `
      <strong>لوحة الألوان:</strong>
      <div style="margin-top:10px;">${colorDots(rec.colors)}</div>
    `;
  }

  const linksBox = $("linksBox");
  if (linksBox) {
    linksBox.innerHTML = productSearchLinks(selections.styleKey, selections.roomType);
  }

  const diyBox = $("diyBox");
  if (diyBox) {
    const styleName = DATA.styles[selections.styleKey]?.name_ar || "هذا الستايل";
    diyBox.innerHTML = `
      <strong>DIY أفكار سريعة (${styleName}):</strong>
      <ul style="margin-top:10px;">
        <li>غيّري الوسائد/البطانية بألوان من اللوحة.</li>
        <li>أضيفي لوحة جدارية + إضاءة دافئة.</li>
        <li>ركني نباتات صغيرة (أو صناعية) للّمسات.</li>
      </ul>
    `;
  }
}

// ====== Saved Designs ======
function loadSaved() {
  return safeJsonParse(localStorage.getItem(KEY_SAVED) || "[]", []);
}
function saveSaved(list) {
  localStorage.setItem(KEY_SAVED, JSON.stringify(list));
}

function renderSaved() {
  const savedList = $("savedList");
  if (!savedList) return;

  const saved = loadSaved();
  if (saved.length === 0) {
    savedList.innerHTML = `<div class="muted">ما عندك تصاميم محفوظة حالياً.</div>`;
    return;
  }

  savedList.innerHTML = saved.map((d, idx) => `
    <div class="saved-card">
      <h3>${d.title}</h3>
      <p class="meta">تم الحفظ: ${d.savedAt}</p>
      <div>الألوان: ${colorDots(d.colors)}</div>
      ${d.hint ? `<p class="meta" style="margin-top:10px;">${d.hint}</p>` : ""}
      <div class="actions">
        <button class="small-btn" data-action="load" data-idx="${idx}">تطبيق</button>
        <button class="small-btn" data-action="delete" data-idx="${idx}">حذف</button>
      </div>
    </div>
  `).join("");
}

// ====== Cart ======
function loadCart() {
  return safeJsonParse(localStorage.getItem(KEY_CART) || "[]", []);
}
function saveCart(list) {
  localStorage.setItem(KEY_CART, JSON.stringify(list));
}

function setCartCount() {
  const el = $("cartCount");
  if (!el) return;
  el.textContent = String(loadCart().length);
}

function renderCart() {
  const cartListEl = $("cartList");
  if (!cartListEl) return;

  const cart = loadCart();
  setCartCount();

  if (cart.length === 0) {
    cartListEl.innerHTML = `<div class="muted">السلة فاضية… ضيفي شيء من روابط المنتجات 👀</div>`;
    return;
  }

  cartListEl.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <p class="cart-item__title">${item.query}</p>
      <div class="cart-item__links">
        <a href="${searchLink("amazon", item.query)}" target="_blank" rel="noopener noreferrer">Amazon</a>
        | <a href="${searchLink("ikea", item.query)}" target="_blank" rel="noopener noreferrer">IKEA</a>
        | <a href="${searchLink("noon", item.query)}" target="_blank" rel="noopener noreferrer">Noon</a>
      </div>
      <div class="cart-item__actions">
        <button class="small-btn" data-removecart="1" data-idx="${idx}">حذف</button>
      </div>
    </div>
  `).join("");
}

// add/remove cart (delegation)
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-addcart]");
  if (!addBtn) return;

  const encoded = addBtn.getAttribute("data-query") || "";
  const query = decodeURIComponent(encoded);

  const cart = loadCart();
  const exists = cart.some((x) => x.query === query);

  if (!exists) {
    cart.unshift({ query, addedAt: nowLabel() });
    saveCart(cart.slice(0, 50));
    setCartCount();
    alert("تمت الإضافة للسلة ✅");
  } else {
    alert("هذا موجود بالسلة بالفعل 🙂");
  }
});

document.addEventListener("click", (e) => {
  const rmBtn = e.target.closest("[data-removecart]");
  if (!rmBtn) return;

  const idx = Number(rmBtn.getAttribute("data-idx"));
  const cart = loadCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
  setCartCount();
});

$("clearCartBtn")?.addEventListener("click", () => {
  localStorage.removeItem(KEY_CART);
  renderCart();
  setCartCount();
});

// ====== Export / Import ======
function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

$("exportAllBtn")?.addEventListener("click", () => {
  const payload = {
    exportedAt: nowLabel(),
    savedDesigns: loadSaved(),
    cartItems: loadCart()
  };
  downloadJson("room-style-backup.json", payload);
});

$("importFile")?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const text = await file.text();
  const data = safeJsonParse(text, null);

  if (!data || typeof data !== "object") {
    alert("الملف غير صالح.");
    return;
  }

  if (Array.isArray(data.savedDesigns)) localStorage.setItem(KEY_SAVED, JSON.stringify(data.savedDesigns));
  if (Array.isArray(data.cartItems)) localStorage.setItem(KEY_CART, JSON.stringify(data.cartItems));

  renderSaved();
  renderCart();
  setCartCount();

  alert("تم الاستيراد ✅");
  e.target.value = "";
});

// ====== Tool (index page): redirect to results.html instead of scrolling ======
const roomTypeEl = $("roomType");
const styleEl = $("style");
const suggestBtn = $("suggestBtn");

let lastRecommendation = null;
let lastSelections = null;

suggestBtn?.addEventListener("click", () => {
  if (!DATA) return;

  const roomType = roomTypeEl?.value;
  const styleKey = styleEl?.value;
  if (!roomType || !styleKey) return;

  const rec = buildRecommendation(roomType, styleKey);
  const selections = { roomType, styleKey };

  // خزّني النتيجة عشان results.html يقرأها
  localStorage.setItem(KEY_CURRENT, JSON.stringify({
    rec,
    selections,
    createdAt: nowLabel()
  }));

  // ✅ بدال ما ينزل لتحت: يروح لصفحة النتائج
  window.location.href = "results.html";
});

// Quick actions -> same redirect
document.querySelectorAll("[data-quick='true']").forEach((btn) => {
  btn.addEventListener("click", () => {
    const roomType = btn.getAttribute("data-room");
    const styleKey = btn.getAttribute("data-style");

    const rec = buildRecommendation(roomType, styleKey);
    const selections = { roomType, styleKey };

    localStorage.setItem(KEY_CURRENT, JSON.stringify({
      rec,
      selections,
      createdAt: nowLabel()
    }));

    window.location.href = "results.html";
  });
});

// Save design (works on results.html too)
$("saveDesignBtn")?.addEventListener("click", () => {
  // لو كنا في results.html نقرأ من currentResult
  if (!lastRecommendation || !lastSelections) {
    const current = safeJsonParse(localStorage.getItem(KEY_CURRENT) || "null", null);
    if (current?.rec && current?.selections) {
      lastRecommendation = current.rec;
      lastSelections = current.selections;
    }
  }

  if (!lastRecommendation || !lastSelections) {
    alert("ما فيه نتيجة جاهزة للحفظ. سوي اقتراح أولاً.");
    return;
  }

  const saved = loadSaved();
  saved.unshift({
    ...lastRecommendation,
    ...lastSelections,
    savedAt: nowLabel()
  });

  saveSaved(saved.slice(0, 20));
  renderSaved();
  alert("تم حفظ التصميم ✅");
});

// Saved list buttons (على index.html فقط غالبًا)
$("savedList")?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const idx = Number(btn.getAttribute("data-idx"));

  const saved = loadSaved();
  const item = saved[idx];
  if (!item) return;

  if (action === "delete") {
    saved.splice(idx, 1);
    saveSaved(saved);
    renderSaved();
    return;
  }

  if (action === "load") {
    // نفتح results.html على التصميم المحفوظ
    localStorage.setItem(KEY_CURRENT, JSON.stringify({
      rec: {
        title: item.title,
        hint: item.hint,
        colors: item.colors,
        items: item.items
      },
      selections: { roomType: item.roomType, styleKey: item.styleKey },
      createdAt: nowLabel()
    }));
    window.location.href = "results.html";
  }
});

// ====== Init ======
(async function init() {
  try {
    await loadData();

    // تحديث عداد السلة على أي صفحة
    setCartCount();

    // لو صفحة النتائج: اعرض النتيجة
    const isResults = window.location.pathname.endsWith("/results.html") || window.location.pathname.endsWith("results.html");
    if (isResults) {
      const current = safeJsonParse(localStorage.getItem(KEY_CURRENT) || "null", null);

      if (!current?.rec || !current?.selections) {
        $("result") && ($("result").innerHTML = "ما فيه نتيجة حالياً. ارجعي للرئيسية وسوي اقتراح.");
        return;
      }

      lastRecommendation = current.rec;
      lastSelections = current.selections;

      renderResult(lastRecommendation, lastSelections);
      fillExtraSections(lastRecommendation, lastSelections);
      return;
    }

    // لو صفحة السلة
    if ($("cartList")) renderCart();

    // لو صفحة الرئيسية
    renderSaved();

  } catch (err) {
    console.error(err);
    alert("في مشكلة بتحميل البيانات (data.json). تأكدي إنه موجود في نفس مكان index.html");
  }
})();
