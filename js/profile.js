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


// edit form
document.getElementById("formProfile").addEventListener("submit", async e => {
    e.preventDefault();

    // btn disabled
    const submitBtn = document.querySelector("#formProfile button[type=submit]");
    submitBtn.disabled = true;

    const result = await res.json();
    submitBtn.disabled = false;

    const formData = new FormData(e.target);

    try {
        const res = await fetch("../api/auth/update_profile.php", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("回應失敗");

        const result = await res.json();
        document.getElementById("msg").textContent = result.message;
    } catch (err) {
        document.getElementById("msg").textContent = "更新失敗：" + err.message;
    }
});

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