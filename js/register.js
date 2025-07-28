// 確認密碼比對
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const confirmError = document.getElementById("confirmError");

function validatePassword() {
    if (confirmPassword.value === "") {
        confirmError.textContent = "";
        return;
    }

    if (password.value !== confirmPassword.value) {
        confirmError.textContent = "密碼不一致";
    } else {
        confirmError.textContent = "";
    }
}

password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validatePassword);

// 護照姓名轉大寫
const passportSurname = document.getElementById("passportSurname");
const passportGivenname = document.getElementById("passportGivenname");

passportSurname.addEventListener("input", () => {
    passportSurname.value = passportSurname.value.toUpperCase();
});

passportGivenname.addEventListener("input", () => {
    passportGivenname.value = passportGivenname.value.toUpperCase();
});

// 驗證護照資料是否全空或全填
function isPassportEmpty() {
    const surname = document.getElementById("passportSurname").value.trim();
    const givername = document.getElementById("passportGivenname").value.trim();
    const number = document.getElementById("passportNumber").value.trim();
    const expiry = document.getElementById("expiryDate").value.trim();

    return !surname && !givername && !number && !expiry;
}

function isPassportFilled() {
    const surname = document.getElementById("passportSurname").value.trim();
    const givername = document.getElementById("passportGivenname").value.trim();
    const number = document.getElementById("passportNumber").value.trim();
    const expiry = document.getElementById("expiryDate").value.trim();

    return surname && givername && number && expiry;
}

function trySkip() {
    if (isPassportEmpty()) {
        goToStep("step4");
    } else {
        alert("如需跳過，請將護照欄位全部清空");
    }
}

function tryNext() {
    if (isPassportFilled()) {
        goToStep("step4");
    } else {
        alert("請完整填寫護照欄位，或選擇跳過填寫");
    }
}

// 確認頁面的資料抓取
function confirmFprm() {
    const account = document.getElementById("account").value;
    const username = document.getElementById("username").value;
    const gender = document.querySelector("input[name='gender']:checked")?.value;
    const nationality = document.getElementById("nationality").value;
    const phonenum = document.getElementById("phonenum").value;
    const birth = document.getElementById("birth").value;
    const passportSurname = document.getElementById("passportSurname").value;
    const passportGivenname = document.getElementById("passportGivenname").value;
    const passportNumber = document.getElementById("passportNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;

    document.getElementById("cf_male").checked = false;
    document.getElementById("cf_female").checked = false;

    document.getElementById("cf_account").value = account;
    document.getElementById("cf_username").value = username;
    document.getElementById("cf_nationality").value = nationality;
    document.getElementById("cf_phonenum").value = phonenum;
    document.getElementById("cf_birth").value = birth;
    document.getElementById("cf_passportSurname").value = passportSurname;
    document.getElementById("cf_passportGivenname").value = passportGivenname;
    document.getElementById("cf_passportNumber").value = passportNumber;
    document.getElementById("cf_expiryDate").value = expiryDate;

    if (gender === "男") {
        document.getElementById("cf_male").checked = true;
    } else if (gender === "女") {
        document.getElementById("cf_female").checked = true;
    }
}

// 註冊流程頁面的切換
function updateStep() {
    document.querySelectorAll(".step").forEach(div => div.style.display = "none");

    const step = location.hash || "#step1";
    const current = document.querySelector(step);
    if (current) current.style.display = "block";

    if (step === "#step4") {
        confirmFprm();
    }
}

function goToStep(stepid) {
    const currentStep = document.querySelector(location.hash || "#step1");
    const inputs = currentStep.querySelectorAll("input, select, textarea");

    for (const input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity(); // 顯示錯誤訊息
            return; // 有錯誤就不要切換 step
        }
    }

    // 驗證通過才換 step
    location.hash = `#${stepid}`;
}

// function goToStep(stepid) {
//     location.hash = `#${stepid}`;
// }
window.addEventListener("load", updateStep);
window.addEventListener("hashchange", updateStep);

document.getElementById("formRegister").addEventListener("submit", async (e) => {
    e.preventDefault(); // 阻止預設提交，改用 fetch 送資料

    // 你原本的 submitForm() 程式碼可以搬過來這裡
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const confirmError = document.getElementById("confirmError");

    // 再次檢查確認密碼是否一致
    if (password !== confirmPassword) {
        confirmError.textContent = "密碼不一致";
        return;
    } else {
        confirmError.textContent = "";
    }

    const data = {
        account: document.getElementById("account").value,
        password: document.getElementById("password").value,
        username: document.getElementById("username").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        nationality: document.getElementById("nationality").value,
        phonenum: document.getElementById("phonenum").value,
        birth: document.getElementById("birth").value,
        passportSurname: document.getElementById("passportSurname").value,
        passportGivenname: document.getElementById("passportGivenname").value,
        passportNumber: document.getElementById("passportNumber").value,
        expiryDate: document.getElementById("expiryDate").value,
    };

    try {
        const res = await fetch("../api/auth/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        const resultBox = document.getElementById("result");

        console.log("API 回傳內容：", result);

        if (res.ok && result.message === "註冊成功！") {
            resultBox.style.color = "green";
            resultBox.textContent = result.message + " 自動登入中...";

            setTimeout(() => {
                window.location.href = "../public/profile.html";
            }, 1500);
        } else {
            resultBox.style.color = "red";
            resultBox.textContent = result.message + " ，可直接登入" || "註冊失敗，請重試";
        }
    } catch (err) {
        console.error("錯誤：", err);
        document.getElementById("result").style.color = "red";
        document.getElementById("result").textContent = "伺服器錯誤，請稍後再試";
    }
});

// form API
// async function submitForm() {
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;
//     const confirmError = document.getElementById("confirmError");

//     // 再次檢查確認密碼是否一致
//     if (password !== confirmPassword) {
//         confirmError.textContent = "密碼不一致";
//         return;
//     } else {
//         confirmError.textContent = "";
//     }

//     const data = {
//         account: document.getElementById("account").value,
//         password: document.getElementById("password").value,
//         username: document.getElementById("username").value,
//         gender: document.querySelector('input[name="gender"]:checked')?.value || "",
//         nationality: document.getElementById("nationality").value,
//         phonenum: document.getElementById("phonenum").value,
//         birth: document.getElementById("birth").value,
//         passportSurname: document.getElementById("passportSurname").value,
//         passportGivenname: document.getElementById("passportGivenname").value,
//         passportNumber: document.getElementById("passportNumber").value,
//         expiryDate: document.getElementById("expiryDate").value,
//     };

//     try {
//         const res = await fetch("../api/auth/register.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)
//         });

//         const result = await res.json();
//         const resultBox = document.getElementById("result");

//         console.log("API 回傳內容：", result);

//         if (res.ok && result.message === "註冊成功！") {
//             resultBox.style.color = "green";
//             resultBox.textContent = result.message + " 自動登入中...";

//             setTimeout(() => {
//                 window.location.href = "../public/profile.html";
//             }, 1500);
//         } else {
//             resultBox.style.color = "red";
//             resultBox.textContent = result.message + " ，可直接登入" || "註冊失敗，請重試";
//         }
//     } catch (err) {
//         console.error("錯誤：", err);
//         document.getElementById("result").style.color = "red";
//         document.getElementById("result").textContent = "伺服器錯誤，請稍後再試";
//     }
// }