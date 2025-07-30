document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // 阻止表單預設送出行為

    const formData = new FormData(this);

    fetch("../api/auth/login.php", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 登入成功 → 導向 profile.html
                window.location.href = "../public/profile.html";
            } else {
                // 登入失敗 → 顯示錯誤訊息
                //document.getElementById("err-msg").textContent = data.message;
                showMessage(data.message);
            }
        })
        .catch(err => {
            console.error("伺服器錯誤", err);
        });
});

// 提示詞自動消失
function showMessage(text, duration = 2000) {
    const msg = document.getElementById("err-msg");
    msg.textContent = text;

    // 清除前一次的計時器（如果有）
    if (showMessage.timeoutId) clearTimeout(showMessage.timeoutId);

    // 幾秒後自動清除訊息
    showMessage.timeoutId = setTimeout(() => {
        msg.textContent = "";
    }, duration);
}