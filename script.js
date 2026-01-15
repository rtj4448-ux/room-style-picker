// قراءة الرابط في حال المشاركة
const params = new URLSearchParams(window.location.search);
if (params.has("design")) {
  localStorage.setItem("selection", decodeURIComponent(params.get("design")));
}

// الانتقال للنتيجة
function goToResult() {
  const room = roomType.value;
  const style = document.getElementById("style").value;
  const budget = document.getElementById("budget").value;

  if (!room || !style || !budget) {
    alert("رجاءً اختاري جميع الخيارات");
    return;
  }

  localStorage.setItem("selection", JSON.stringify({ room, style, budget }));
  window.location.href = "result.html";
}

// عرض النتيجة
document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("resultBox");
  if (!box) return;

  const data = JSON.parse(localStorage.getItem("selection"));
  if (!data) {
    box.innerHTML = "<p>لا يوجد تصميم</p>";
    return;
  }

  let bg = data.style === "modern" ? "#e5e7eb" : "#fef3c7";
  let img = `images/${data.room}-${data.style}.jpg`;

  box.innerHTML = `
    <div class="card" style="background:${bg}">
      <h3>تصميم ${data.style}</h3>
      <p>الغرفة: ${data.room}</p>
      <p>الميزانية: ${data.budget}</p>
      <img src="${img}">
    </div>
  `;
});

// إضافة للسلة
function addToCart() {
  const item = JSON.parse(localStorage.getItem("selection"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("تمت الإضافة للسلة 🛒");
}

// عرض السلة
document.addEventListener("DOMContentLoaded", () => {
  const cartBox = document.getElementById("cartBox");
  if (!cartBox) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartBox.innerHTML = "<p>السلة فارغة</p>";
    return;
  }

  cartBox.innerHTML = cart.map((item, i) => `
    <div class="card">
      <p>${item.room} - ${item.style}</p>
      <img src="images/${item.room}-${item.style}.jpg">
      <button onclick="removeItem(${i})">حذف</button>
    </div>
  `).join("");
});

// حذف عنصر
function removeItem(i) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

// تفريغ السلة
function clearCart() {
  localStorage.removeItem("cart");
  location.reload();
}

// مشاركة التصميم
function shareDesign() {
  const data = localStorage.getItem("selection");
  const url = `${location.origin}${location.pathname}?design=${encodeURIComponent(data)}`;
  navigator.clipboard.writeText(url);
  alert("تم نسخ رابط التصميم");
}
