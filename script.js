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
