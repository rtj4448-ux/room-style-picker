function goToResult() {
  const room = document.getElementById("roomType").value;
  const style = document.getElementById("style").value;
  const budget = document.getElementById("budget").value;

  if (!room || !style || !budget) {
    alert("رجاءً اختاري جميع الخيارات");
    return;
  }

  const data = { room, style, budget };
  localStorage.setItem("selection", JSON.stringify(data));

  window.location.href = "result.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("resultBox");
  if (!box) return;

  const data = JSON.parse(localStorage.getItem("selection"));
  if (!data) {
    box.innerHTML = "<p>لا يوجد تصميم</p>";
    return;
  }

  box.innerHTML = `
    <div class="card">
      <p><strong>نوع الغرفة:</strong> ${data.room}</p>
      <p><strong>الأسلوب:</strong> ${data.style}</p>
      <p><strong>الميزانية:</strong> ${data.budget}</p>
      <img src="images/${data.room}.jpg">
    </div>
  `;
});

function addToCart() {
  const data = JSON.parse(localStorage.getItem("selection"));
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(data);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("تمت الإضافة للسلة 🛒");
}
// عرض السلة
document.addEventListener("DOMContentLoaded", () => {
  const cartBox = document.getElementById("cartBox");
  if (!cartBox) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartBox.innerHTML = "<p>السلة فارغة 🧺</p>";
    return;
  }

  cartBox.innerHTML = cart.map((item, index) => `
    <div class="card">
      <p><strong>الغرفة:</strong> ${item.room}</p>
      <p><strong>الأسلوب:</strong> ${item.style}</p>
      <p><strong>الميزانية:</strong> ${item.budget}</p>
      <img src="images/${item.room}.jpg">
      <button onclick="removeItem(${index})">حذف</button>
    </div>
  `).join("");
});

// حذف عنصر
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}

// تفريغ السلة
function clearCart() {
  localStorage.removeItem("cart");
  location.reload();
}

