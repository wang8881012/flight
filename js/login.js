document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("../api/auth/login.php", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // 使用後端提供的導向網址
                console.log(data.redirect_url)
                window.location.href = data.redirect_url;
            } else {
                showMessage(data.message);
            }
        })
        .catch(err => {
            console.error("登入發生錯誤", err);
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