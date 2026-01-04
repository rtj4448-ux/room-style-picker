const loginForm = document.getElementById("loginForm");
const userNameInput = document.getElementById("userName");
const welcomeMsg = document.getElementById("welcomeMsg");
const helloUser = document.getElementById("helloUser");

function setUser(name){
  if (helloUser) helloUser.textContent = `أهلًا ${name} 👋`;
}

const storedName = localStorage.getItem("userName");
if (storedName) {
  setUser(storedName);
  welcomeMsg.textContent = `رجعت لنا يا ${storedName} 😄`;
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = userNameInput.value.trim();
  if (!name) return;

  localStorage.setItem("userName", name);
  setUser(name);

  welcomeMsg.textContent = `هلا ${name}! تحت فيه اقتراحات جاهزة 🌟`;

  // نخليها “صفحة دخول” فعلاً: نخفي الفورم بعد الدخول
  loginForm.style.display = "none";

  // ننزل تلقائيًا لقسم الاقتراح
  document.getElementById("mainSection")?.scrollIntoView({ behavior: "smooth" });
});

// --- زر المتطلبات: Alert ---
const visitBtn = document.getElementById("visitBtn");
visitBtn.addEventListener("click", () => {
  alert("شكراً لزيارة موقعي!");
});

// --- اقتراح ستايل + ألوان ---
const suggestBtn = document.getElementById("suggestBtn");
const roomType = document.getElementById("roomType");
const style = document.getElementById("style");
const result = document.getElementById("result");

const suggestions = {
  modern:  { name: "مودرن هادي", colors: ["#F8FAFC", "#111827", "#6D28D9"], items: ["كنبة بسيطة", "طاولة قهوة", "إضاءة أرضية"] },
  minimal: { name: "مينيمال نظيف", colors: ["#FFFFFF", "#E5E7EB", "#111827"], items: ["قطع قليلة", "خزانة تخزين", "مرايا"] },
  boho:    { name: "بوهو دافئ", colors: ["#F5EDE3", "#B45309", "#065F46"], items: ["سجاد", "نباتات", "وسائد"] },
  classic: { name: "كلاسيك أنيق", colors: ["#FFF7ED", "#7C2D12", "#1F2937"], items: ["طاولة جانبية", "ستارة", "لوحات"] }
};

const roomNames = {
  bedroom: "غرفة نوم",
  living: "غرفة معيشة",
  office: "مكتب"
};

function colorDots(colors){
  return colors.map(c =>
    `<span style="display:inline-block;width:18px;height:18px;border-radius:6px;background:${c};border:1px solid #e5e7eb;margin-left:6px;"></span>`
  ).join("");
}

suggestBtn.addEventListener("click", () => {
  const s = suggestions[style.value];
  const rName = roomNames[roomType.value];

  result.innerHTML = `
    <strong>اقتراحك: ${s.name} لـ ${rName}</strong><br/>
    <div style="margin-top:8px;">الألوان: ${colorDots(s.colors)}</div>
    <div style="margin-top:10px;">عناصر مقترحة: ${s.items.join("، ")}</div>
  `;
});
