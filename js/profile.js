// api渲染資料到前端
document.addEventListener("DOMContentLoaded", function () {
    fetch("../api/auth/update_profile.php")
        .then(res => res.json())
        .then(data => {
            document.getElementById("user_number").textContent = data.user_number;
            document.getElementById("name").value = data.name;
            document.getElementById("nationality").value = data.nationality;
            document.getElementById("phonenum").value = data.phone;
            document.querySelector(`input[name="gender"][value="${data.gender}"]`).checked = true;
            document.getElementById("birth").value = data.birthday;
            document.getElementById("passportSurname").value = data.passport_last_name;
            document.getElementById("passportGivenname").value = data.passport_first_name;
            document.getElementById("passportNumber").value = data.passport_number;
            document.getElementById("expiryDate").value = data.passport_expiry;
        });
})

const form = document.getElementById("formProfile");

// 儲存初始值
const initialFormData = {};
Array.from(form.elements).forEach(el => {
    if (el.type === "radio") {
        if (el.checked) {
            initialFormData[el.name] = el.value;
        }
    } else {
        initialFormData[el.name] = el.value;
    }
});

form.addEventListener("submit", async e => {
    e.preventDefault();

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    const formData = new FormData(form);

    // 比對是否有改變
    let hasChanges = false;

    Array.from(form.elements).forEach(el => {
        if (!el.name) return;

        if (el.type === "radio") {
            if (el.checked && el.value !== initialFormData[el.name]) {
                hasChanges = true;
            }
        } else {
            if (el.value !== initialFormData[el.name]) {
                hasChanges = true;
            }
        }
    });

    if (!hasChanges) {
        showMessage("無資料更新");
        submitBtn.disabled = false;
        return;
    }

    // 有更動才送出
    try {
        const res = await fetch("../api/auth/update_profile.php", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("回應失敗");

        const result = await res.json();
        showMessage(result.message);

        // 更新初始值
        Array.from(form.elements).forEach(el => {
            if (!el.name) return;

            if (el.type === "radio") {
                if (el.checked) {
                    initialFormData[el.name] = el.value;
                }
            } else {
                initialFormData[el.name] = el.value;
            }
        });
    } catch (err) {
        showMessage("更新失敗：" + err.message);
    } finally {
        submitBtn.disabled = false;
    }
});

// 提示詞自動消失
function showMessage(text, duration = 3000) {
    const msg = document.getElementById("msg");
    msg.textContent = text;

    // 清除前一次的計時器（如果有）
    if (showMessage.timeoutId) clearTimeout(showMessage.timeoutId);

    // 幾秒後自動清除訊息
    showMessage.timeoutId = setTimeout(() => {
        msg.textContent = "";
    }, duration);
}


// 確認密碼比對
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const confirmError = document.getElementById("confirmError");

function validatePassword() {
    if (confirmPassword.value === "") {
        confirmError.textContent = "";
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        confirmError.textContent = "密碼不一致";
    } else {
        confirmError.textContent = "";
    }
}

newPassword.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

// edit password form
document.getElementById("changePasswordForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("../api/auth/change_profile_pwd.php", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById("responseMsg").textContent = data.message;
        })
        .catch((err) => {
            document.getElementById("responseMsg").textContent = "伺服器錯誤";
            console.error(err);
        });
});