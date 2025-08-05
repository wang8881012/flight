// 動態生成訂單card
document.addEventListener("DOMContentLoaded", () => {
    fetch("../api/auth/orders.php")
        .then((res) => res.json())
        .then((result) => {
            if (!result.success) {
                console.error("取得訂單失敗");
                return;
            }

            const noOrderMsg = document.getElementById("no_order_msg");
            const accordion = document.getElementById("orderscard");
            accordion.innerHTML = "";
            
            if (result.data.length === 0) {
                noOrderMsg.style.display = "block";
            } else {
                noOrderMsg.style.display = "none";


                // 英文轉中文
                const classMap = {
                    business: "商務艙",
                    economy: "經濟艙",
                }

                // 轉成標準日期
                function formatTime(datetimeStr) {
                    const d = new Date(datetimeStr);
                    return d.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", hour12: false });
                }

                // 轉成標準時間
                function getDuration(start, end) {
                    const d1 = new Date(start);
                    const d2 = new Date(end);
                    const mins = Math.floor((d2 - d1) / 60000);
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    return `${h}h ${m}m`;
                }

                result.data.forEach((order, index) => {
                    const collapseId = `collapse${index}`;

                    const classText = classMap[order.艙等] || order.艙等;
                    const addon = order.加購項目;
                    const addonText = addon
                        ? addon.split(",").map(item => addonMap[item.trim()] || item.trim()).join("、")
                        : "無加購";

                    const card = document.createElement("div");
                    card.className = "col-12 col-lg-10";

                    card.innerHTML = `
                    <div class="card m-3 border-0">
                        <div class="row card-header mx-0 p-4 pt-3" style="background-color: #2b3b52; color: #dbb37d;">
                            <div class="d-flex flex-row align-items-center">
                            <div class="fs-6">${order.出發地機場代碼} ${order.出發地機場名稱} → ${order.目的地機場代碼} ${order.目的地機場名稱}</div>
                            <div class="ms-3 fs-6">${new Date(order.出發時間).toLocaleDateString("zh-TW", { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}</div>
                            </div>
                        </div>

                        <div class="row card-body mx-0 p-3 gy-3 rounded-bottom-5" style="background-color: #dbeaff;">
                            <div class="col-12 col-lg-7 d-flex justify-content-around align-items-center flex-column flex-lg-row">
                            <div class="text-center me-lg-4 mb-3 mb-lg-0">
                                <p class="blue-text fs-3 fw-bolder">${formatTime(order.出發時間)}</p>
                                <p class="blue-text fs-3 fw-bolder">${order.出發地機場代碼}</p>
                            </div>
                            <div class="blue-text fs-3 fw-bolder">→</div>
                            <div class="text-center">
                                <p class="blue-text fs-3 fw-bolder">${formatTime(order.抵達時間)}</p>
                                <p class="blue-text fs-3 fw-bolder">${order.目的地機場代碼}</p>
                            </div>
                            </div>

                            <div class="col-12 col-lg-2 d-flex flex-column justify-content-center text-start">
                            <div class="blue-text fs-4 fw-bolder"><i class="bi bi-clock-history"></i> ${getDuration(order.出發時間, order.抵達時間)}</div>
                            <div class="blue-text fs-4 fw-bolder"><i class="bi bi-airplane-engines-fill"></i>${order.航班編號}</div>
                            <div class="blue-text fs-4 fw-bolder"><i class="bi bi-ticket-perforated-fill"></i> 1張</div>
                            </div>

                            <div class="col-12 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center">
                            <div class="blue-text fs-4 fw-bolder">${classText}</div>
                            <button class="py-0 btn" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                                <i class="bi bi-caret-down-fill fs-1" data-toggle-icon="${collapseId}"></i>
                            </button>
                            </div>

                            <div class="collapse mt-4" id="${collapseId}" data-bs-parent="#accordionExample">
                            <div class="container my-4 detailed">
                                <div class="row">
                                <div class="col-8">
                                    <h4><strong>行程詳細資訊</strong></h4>
                                    <div class="d-flex">
                                    <div class="text-end d-flex flex-column justify-content-start mt-4 me-4">
                                        <p class="mb-2">${getDuration(order.出發時間, order.抵達時間)}</p>
                                        <p>航班班號 ${order.航班編號}</p>
                                    </div>
                                    <div class="d-flex flex-column justify-content-start align-items-center">
                                        <div class="rounded-circle" style="width: 12px; height: 12px; background-color: #283852;"></div>
                                        <div class="border-start border-2 h-50" style="background-color: #283852;"></div>
                                        <div class="rounded-circle" style="width: 12px; height: 12px; background-color: #283852;"></div>
                                    </div>
                                    <div class="ms-3">
                                        <div class="mb-3">
                                        <p class="mb-1 fw-bold">${order.出發地機場名稱}</p>
                                        <p class="mb-1">${formatTime(order.出發時間)}</p>
                                        </div>
                                        <div>
                                        <p class="mb-1 fw-bold">${order.目的地機場名稱}</p>
                                        <p class="mb-1">${formatTime(order.抵達時間)}</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div class="col-md-1 d-none d-md-block">
                                    <div class="vr h-100 mx-auto" style="width: 2px; background-color: #6c757d;"></div>
                                </div>
                                <div class="col-md-3 d-flex flex-column justify-content-between">
                                    <div>
                                    <p class="mb-4">${classText}</p>
                                    <p>${addonText || "無任何加購"}</p>
                                    <p>總計：TWD ${Number(order.總計).toLocaleString("en-US")}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                    accordion.appendChild(card);
                });

                // 控制箭頭上下
                document.querySelectorAll("[data-toggle-icon]").forEach(icon => {
                    const collapseId = icon.getAttribute("data-toggle-icon");
                    const collapseEl = document.getElementById(collapseId);

                    if (collapseEl) {
                        // 當展開
                        collapseEl.addEventListener("shown.bs.collapse", () => {
                            icon.classList.remove("bi-caret-down-fill");
                            icon.classList.add("bi-caret-up-fill");
                        });

                        // 當收合
                        collapseEl.addEventListener("hidden.bs.collapse", () => {
                            icon.classList.remove("bi-caret-up-fill");
                            icon.classList.add("bi-caret-down-fill");
                        });
                    }
                });
            }
        });
})
