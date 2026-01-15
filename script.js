/* =========================
   بيانات جاهزة (API-ready)
========================= */
const DESIGN_DATA = {
  bedroom: {
    modern: {
      colors: ["#e5e7eb", "#111827"],
      text: "غرفة نوم مودرن بخطوط بسيطة وإضاءة هادئة"
    },
    classic: {
      colors: ["#fef3c7", "#78350f"],
      text: "غرفة نوم كلاسيك بألوان دافئة وتفاصيل فخمة"
    }
  },
  living: {
    modern: {
      colors: ["#e0f2fe", "#0f172a"],
      text: "غرفة معيشة مودرن بألوان محايدة ومساحات مفتوحة"
    },
    classic: {
      colors: ["#fde68a", "#7c2d12"],
      text: "غرفة معيشة كلاسيك بلمسة أنيقة وأثاث تقليدي"
    }
  }
};

/* =========================
   قراءة رابط المشاركة
========================= */
const params = new URLSearchParams(location.search);
if (params.has("design")) {
  localStorage.setItem("selection", decodeURIComponent(params.get("design")));
}

/* =========================
   صفحة الاختيار
========================= */
function goToResult(){
  const room = document.getElementById("roomType").value;
  const style = document.getElementById("style").value;
  const budget = document.getElementById("budget").value;

  if(!room || !style || !budget){
    alert("اختاري كل الخيارات أولاً 🌸");
    return;
  }

  localStorage.setItem("selection", JSON.stringify({room,style,budget}));
  location.href = "result.html";
}

/* =========================
   صفحة النتيجة
========================= */
document.addEventListener("DOMContentLoaded",()=>{
  renderResult();
  renderCart();
});

function renderResult(){
  const box = document.getElementById("resultBox");
  if(!box) return;

  const data = JSON.parse(localStorage.getItem("selection"));
  if(!data){
    box.innerHTML = "<p>لا يوجد تصميم بعد</p>";
    return;
  }

  const info = DESIGN_DATA[data.room][data.style];
  const img = `images/${data.room}-${data.style}.jpg`;

  box.innerHTML = `
    <div class="card" style="background:${info.colors[0]}">
      <h3>${info.text}</h3>
      <p>الميزانية: ${data.budget}</p>
      <img src="${img}">
    </div>
  `;
}

/* =========================
   السلة
========================= */
function addToCart(){
  const item = JSON.parse(localStorage.getItem("selection"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت الإضافة للسلة 🛒");
}

function renderCart(){
  const box = document.getElementById("cartBox");
  if(!box) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if(cart.length === 0){
    box.innerHTML = "<p>السلة فارغة</p>";
    return;
  }

  box.innerHTML = cart.map((it,i)=>{
    const info = DESIGN_DATA[it.room][it.style];
    return `
      <div class="card">
        <p>${info.text}</p>
        <img src="images/${it.room}-${it.style}.jpg">
        <button onclick="removeItem(${i})">حذف</button>
      </div>
    `;
  }).join("");
}

function removeItem(i){
  const cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(i,1);
  localStorage.setItem("cart",JSON.stringify(cart));
  location.reload();
}

function clearCart(){
  localStorage.removeItem("cart");
  location.reload();
}

/* =========================
   مشاركة
========================= */
function shareDesign(){
  const data = localStorage.getItem("selection");
  const url = `${location.origin}${location.pathname}?design=${encodeURIComponent(data)}`;
  navigator.clipboard.writeText(url);
  alert("تم نسخ رابط التصميم ✨");
}
