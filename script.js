const $ = (id) => document.getElementById(id);
function colorDots(colors) {
  return colors
    .map(
      (c) =>
        `<span style="display:inline-block;width:18px;height:18px;border-radius:6px;background:${c};border:1px solid #e2e8f0;margin-left:6px;"></span>`
    )
    .join("");
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem("savedDesigns") || "[]");
  } catch {
    return [];
  }
}

function saveAll(list) {
  localStorage.setItem("savedDesigns", JSON.stringify(list));
}

function nowLabel() {
  const d = new Date();
  return d.toLocaleString("ar-SA");
}
const visitBtn = $("visitBtn");
visitBtn?.addEventListener("click", () => {
  alert("شكراً لزيارة موقعي!");
});
$("startBtn")?.addEventListener("click", () =>
  $("tool")?.scrollIntoView({ behavior: "smooth" })
);
$("heroBtn")?.addEventListener("click", () =>
  $("tool")?.scrollIntoView({ behavior: "smooth" })
);
let DATA = null;

async function loadData() {
  const res = await fetch("./data.json?v=1");
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
      <strong>روابط منتجات (بحث عام):</strong>
      <ul style="margin-top:8px;">
        ${queries
          .map(
            (q) => `
          <li>
            ${q}
            — <a href="${searchLink("amazon", q)}" target="_blank" rel="noopener noreferrer">Amazon</a>
            | <a href="${searchLink("ikea", q)}" target="_blank" rel="noopener noreferrer">IKEA</a>
            | <a href="${searchLink("noon", q)}" target="_blank" rel="noopener noreferrer">Noon</a>
          </li>
        `
          )
          .join("")}
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

  lastRecommendation = rec;
  lastSelections = { roomType, styleKey };

  renderResult(rec, lastSelections);

  $("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
});
const saveDesignBtn = $("saveDesignBtn");
const clearSavedBtn = $("clearSavedBtn");
const savedList = $("savedList");

function renderSaved() {
  if (!savedList) return;

  const saved = loadSaved();

  if (saved.length === 0) {
    savedList.innerHTML = `<div class="muted">ما عندك تصاميم محفوظة حالياً.</div>`;
    return;
  }

  savedList.innerHTML = saved
    .map(
      (d, idx) => `
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
  `
    )
    .join("");
}

saveDesignBtn?.addEventListener("click", () => {
  if (!lastRecommendation || !lastSelections) {
    alert("اختاري نوع الغرفة والستايل ثم اضغطي (اقترح لي) أولاً.");
    return;
  }

  const saved = loadSaved();
  saved.unshift({
    ...lastRecommendation,
    ...lastSelections,
    savedAt: nowLabel()
  });

  saveAll(saved.slice(0, 20));
  renderSaved();
  alert("تم حفظ التصميم ✅");
});

clearSavedBtn?.addEventListener("click", () => {
  localStorage.removeItem("savedDesigns");
  renderSaved();
});

savedList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const idx = Number(btn.getAttribute("data-idx"));

  const saved = loadSaved();
  const item = saved[idx];
  if (!item) return;

  if (action === "delete") {
    saved.splice(idx, 1);
    saveAll(saved);
    renderSaved();
    return;
  }

  if (action === "load") {
    if (roomTypeEl) roomTypeEl.value = item.roomType;
    if (styleEl) styleEl.value = item.styleKey;

    lastRecommendation = {
      title: item.title,
      hint: item.hint,
      colors: item.colors,
      items: item.items
    };
    lastSelections = { roomType: item.roomType, styleKey: item.styleKey };

    renderResult(lastRecommendation, lastSelections);
    $("tool")?.scrollIntoView({ behavior: "smooth" });
  }
});
(async function init() {
  try {
    await loadData();
    renderSaved();
  } catch (err) {
    console.error(err);
    alert("في مشكلة بتحميل البيانات (data.json). تأكدي إنه موجود في نفس مكان index.html");
  }
})();
