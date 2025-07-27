// 新增成員表單送出api
document.querySelector("#addCompanionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("../api/auth/companion/create_passengers.php", {
        method: "POST",
        body: formData,
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                addCompanionToDOM(data.data);
                form.reset(); // 清空表單
            } else {
                alert("新增失敗：" + (data.message || ""));
            }
        })
        .catch(err => {
            console.error("錯誤：", err);
        });
});

// 動態新增同行旅客區塊
document.addEventListener("DOMContentLoaded", () => {
    fetch("../api/auth/companion/create_passengers.php")
        .then(res => res.json())
        .then(data => {
            const noCompanionsMsg = document.getElementById("no_companion_msg");
            if (data.success) {
                if (data.data.length === 0) {
                    noCompanionsMsg.style.display = "block";
                } else {
                    noCompanionsMsg.style.display = "none";
                    data.data.forEach(companion => {
                        addCompanionToDOM(companion);
                    });
                }
            } else {
                console.error("載入同行旅客失敗：", data.msg);
                noCompanionsMsg.style.display = "block";
            }
        })
        .catch(err => console.error("發生錯誤：", err));
        document.querySelector("#no_companion_msg").style.display = "block";
});

function addCompanionToDOM(companion) {
    const container = document.querySelector("#companionsList"); // 放卡片的容器
    const id = companion.id;

    const html = `
    <div class="d-flex align-items-start mx-auto mb-3" style="width: 70%;" data-id="${id}">
        <div class="me-3 pt-4">
            <input type="radio" style="transform: scale(1.5); accent-color: #dbb37d;">
        </div>
        <div class="flex-grow-1" style="background-color: #455b80; border-radius: 2rem;">
            <div class="d-flex align-items-center position-relative py-3">
                <div class="mx-auto">
                    <p class="mb-0 fs-2" style="color: #dbb37d;">${companion.name}</p>
                </div>
                <div class="d-flex position-absolute top-10 end-0 px-3">
                    <button class="delete-btn" data-id="${id}" style="background-color: transparent; border: none;">
                        <i class="bi bi-trash fs-2"></i>
                    </button>
                    <button data-bs-toggle="collapse" data-bs-target="#passenger${id}"
                        style="background-color: transparent; border: none;">
                        <i class="bi bi-caret-down-fill fs-2"></i>
                    </button>
                </div>
            </div>
            <div class="collapse" id="passenger${id}">
                <div class="card shadow overflow-hidden" style="background-color: #f5f5f5; border-radius: 0 0 2rem 2rem;">
                    <div class="card-body p-0">
                        <form method="POST" class="p-3 row justify-content-center align-items-center">
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <div class="d-flex justify-content-around">
                                        <label class="form-label pe-2">中文姓名</label>
                                        <input type="text" name="n_name" class="form-control" value="${companion.name}" style="width: 70%;">
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex justify-content-between">
                                        <label class="form-label pe-2">英文姓</label>
                                        <input type="text" name="n_lastname" class="form-control" value="${companion.passport_last_name}" style="width: 70%;">
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex justify-content-between">
                                        <label class="form-label pe-2">英文名</label>
                                        <input type="text" name="n_firstname" class="form-control" value="${companion.passport_first_name}" style="width: 70%;">
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex justify-content-between">
                                        <label for="gender" class="form-label pe-2">性別</label>
                                        <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="n_gender" id="male" value="男"
                                            ${companion.gender === "男" ? "checked" : ""}>
                                        <label class="form-check-label" for="male_${companion.id}">男</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="n_gender" id="female" value="女"
                                            ${companion.gender === "女" ? "checked" : ""}>
                                        <label class="form-check-label" for="female_${companion.id}">女</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 mb-3">
                                    <div class="d-flex justify-content-between">
                                        <label class="form-label pe-2">出生日期</label>
                                        <input type="text" name="n_birth" class="form-control" value="${companion.birthday}" style="width: 70%;">
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 class="text-center">護照資料</h2>
                            </div>
                            <div>
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <div class="d-flex align-items-center">
                                            <label class="form-label me-2 mb-0" style="width: 40%;">護照號碼</label>
                                            <input type="text" name="n_number" class="form-control" value="${companion.passport_number}">
                                        </div>
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        <div class="d-flex align-items-center">
                                            <label class="form-label me-2 mb-0" style="width: 40%;">國籍/地區</label>
                                            <select class="form-select" name="n_nationality" id="nationality">
                                                <option value="TW" ${companion.nationality === 'TW' ? 'selected' : ''}>TW</option>
                                                <option value="JPN" ${companion.nationality === 'JPN' ? 'selected' : ''}>JPN</option>
                                                <option value="USA" ${companion.nationality === 'USA' ? 'selected' : ''}>USA</option>
                                                <option value="KOR" ${companion.nationality === 'KOR' ? 'selected' : ''}>KOR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="col-md-4 mb-3">
                                        <div class="d-flex align-items-center">
                                            <label class="form-label me-2 mb-0" style="width: 40%;">有效期限</label>
                                            <input type="date" name="n_expiry" class="form-control" value="${companion.passport_expiry}">
                                        </div>
                                    </div>
                                    <div class="text-center" style="border-top: none;">
                                        <button type="button" class="btn px-3"
                                            style="background-color: #dbb37d; color: #283852; border-radius: 1rem;">取消</button>
                                        <button type="submit" class="btn px-3"
                                            style="background-color: #dbb37d; color: #283852; border-radius: 1rem;">確認修改</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    container.insertAdjacentHTML("beforeend", html);

    const thisBlock = container.querySelector(`[data-id="${id}"]`);
    const form = thisBlock.querySelector("form");

    // 取消按鈕
    const cancelBtn = form.querySelector("button[type='button']");
    cancelBtn.addEventListener("click", () => {

        // 還原欄位值
        form.elements["n_name"].value = companion.name;
        form.elements["n_lastname"].value = companion.passport_last_name;
        form.elements["n_firstname"].value = companion.passport_first_name;

        // 性別 radio
        const genderMale = form.querySelector("#male");
        const genderFemale = form.querySelector("#female");
        if (companion.gender === "男") {
            genderMale.checked = true;
            genderFemale.checked = false;
        } else if (companion.gender === "女") {
            genderMale.checked = false;
            genderFemale.checked = true;
        } else {
            genderMale.checked = false;
            genderFemale.checked = false;
        }

        form.elements["n_birth"].value = companion.birthday;
        form.elements["n_number"].value = companion.passport_number;

        // 國籍 select
        const nationalitySelect = form.querySelector("#nationality");
        nationalitySelect.value = companion.nationality;

        form.elements["n_expiry"].value = companion.passport_expiry;

        // 收合區塊 (Bootstrap Collapse)
        const collapseElement = document.querySelector(`#passenger${id}`);
        const bsCollapse = bootstrap.Collapse.getInstance(collapseElement);
        if (bsCollapse) {
            bsCollapse.hide();
        } else {
            // 如果還沒初始化過，可以手動初始化後再 hide
            const newCollapse = new bootstrap.Collapse(collapseElement);
            newCollapse.hide();
        }
    });

    // 修改同行旅客的資料
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        formData.append("id", id); // id 不是 input 欄位，所以手動加

        fetch("../api/auth/companion/update_passengers.php", {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert("修改成功！");
                } else {
                    alert("修改失敗：" + (data.message || ""));
                }
            })
            .catch(err => {
                console.error("錯誤：", err);
            });
    });
}

// 修改同行旅客的資料
// document.addEventListener("DOMContentLoaded", function () {
//     const thisBlock = container.querySelector(`[data-id="${id}"]`);
//     const form = thisBlock.querySelector("form");

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const genderRadios = form.querySelectorAll(`input[name="n_gender_${id}"]`);
//         let gender = "";
//         genderRadios.forEach(radio => {
//             if (radio.checked) gender = radio.value;
//         });

//         const formData = {
//             id: id,
//             name: form.elements["n_name"].value,
//             passport_last_name: form.elements["n_lastname"].value,
//             passport_first_name: form.elements["n_firstname"].value,
//             gender: gender,
//             birthday: form.elements["n_birth"].value,
//             passport_number: form.elements["n_number"].value,
//             nationality: form.elements["n_nationality"].value,
//             passport_expiry: form.elements["n_expiry"].value,
//         };

//         fetch("../api/auth/companion/update_passengers.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData)
//         })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.success) {
//                     alert("修改成功");
//                 } else {
//                     alert("修改失敗：" + (data.message || ""));
//                 }
//             })
//             .catch(err => {
//                 console.error("錯誤：", err);
//             });
//     });
// })


// 收合按鈕轉換
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    btn.addEventListener('click', function () {
        const icon = this.querySelector('i');
        console.log(icon);
        icon.classList.toggle('rotate');
    });
});

// 護照姓名轉大寫
// const lastname = document.getElementById("lastname");
// const firstname = document.getElementById("firstname");

// passportSurname.addEventListener("input", () => {
//     lastname.value = lastname.value.toUpperCase();
// });

// passportGivenname.addEventListener("input", () => {
//     firstname.value = firstname.value.toUpperCase();
// });
