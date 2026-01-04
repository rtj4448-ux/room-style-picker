// --- Buttons to scroll to tool section ---
const startBtn = document.getElementById("startBtn");
const heroBtn = document.getElementById("heroBtn");
const toolSection = document.getElementById("tool");

function goToTool() {
  if (toolSection) toolSection.scrollIntoView({ behavior: "smooth" });
}

if (startBtn) startBtn.addEventListener("click", goToTool);
if (heroBtn) heroBtn.addEventListener("click", goToTool);

// --- Required alert button ---
const visitBtn = document.getElementById("visitBtn");
if (visitBtn) {
  visitBtn.addEventListener("click", () => {
    alert("شكراً لزيارة موقعي!");
  });
}

// --- Fake login (optional) ---
const loginForm = document.getElementById("loginForm");
const userNameInput = document.getElementById("userName");
const welcomeMsg = document.getElementById("welcomeMsg");

const storedName = localStorage.getItem("userName");
if (storedName && welcomeMsg) {
  welcomeMsg.textContent = `مرحبًا ${storedName} 👋`;
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (userNameInput?.value || "").trim();
    if (!name) return;

    localStorage.setItem("userName", name);
    if (welcomeMsg) welcomeMsg.textContent = `هلا ${name}! تقدري تبدأي الاقتراح تحت ✨`;

    goToTool();
  });
}

// --- Suggestion tool ---
const suggestBtn = document.getElementById("suggestBtn");
const roomType = document.getElementById("roomType");
const style = document.getElementById("style");
const result = document.getElementById("result");

const suggestions = {
  modern:  { name: "مودرن هادي", colors: ["#F8FAFC", "#111827", "#0f172a"], items: ["كنبة بسيطة", "طاولة قهوة", "إضاءة أرضية"] },
  minimal: { name: "مينيمال نظيف", colors: ["#FFFFFF", "#E2E8F0", "#0f172a"], items: ["قطع قليلة", "خزانة تخزين", "مرايا"] },
  boho:    { name: "بوهو دافئ", colors: ["#F5EDE3", "#B45309", "#065F46"], items: ["سجاد", "نباتات", "وسائد"] },
  classic: { name: "كلاسيك أنيق", colors: ["#FFF7ED", "#7C2D12", "#0f172a"], items: ["ستارة", "طاولة جانبية", "لوحات"] }
};

const roomNames = {
  bedroom: "غرفة نوم",
  living: "غرفة معيشة",
  office: "مكتب"
};

function dots(colors) {
  return colors.map(c =>
    `<span style="display:inline-block;width:18px;height:18px;border-radius:6px;background:${c};border:1px solid #e2e8f0;margin-left:6px;"></span>`
  ).join("");
}

if (suggestBtn) {
  suggestBtn.addEventListener("click", () => {
    if (!style || !roomType || !result) return;

    const s = suggestions[style.value];
    const r = roomNames[roomType.value];

    result.innerHTML = `
      <strong>اقتراحك: ${s.name} لـ ${r}</strong><br/>
      <div style="margin-top:10px;">الألوان: ${dots(s.colors)}</div>
      <div style="margin-top:10px;">عناصر مقترحة: ${s.items.join("، ")}</div>
    `;
  });
}
