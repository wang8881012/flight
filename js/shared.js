// 載入navbar footer
document.addEventListener("DOMContentLoaded", async function () {
    const navbarContainer = document.getElementById("navbar");
    const footerContainer = document.getElementById("footer");

    try {
        const navbarHtml = await fetch("../partials/navbar.html").then(res => res.text());
        const footerHtml = await fetch("../partials/footer.html").then(res => res.text());

        navbarContainer.innerHTML = navbarHtml;
        footerContainer.innerHTML = footerHtml;

        // 確認使用者登入狀態
        const userRes = await fetch("../api/auth/check_login.php");
        const userData = await userRes.json();

        const userArea = document.getElementById("navbarUserArea");

        if (userData.loggedIn) {
            userArea.innerHTML = `
                <span class="gold-text me-3">歡迎，${userData.username}</span>
                <a href="../public/profile.html" class="gold-text me-3">會員中心</a>        
                <button id="logoutBtn" class="gold-bg blue-text btn px-2">登出</button>
            `;
        } else {
            userArea.innerHTML = `
                <a href="#" class="gold-text me-3">聯絡我們</a>
                <a href="login.html" class="gold-text">登入</a>
            `;
        }

        // logout
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                try {
                    const res = await fetch("../api/auth/logout.php");
                    if (res.ok) {
                        window.location.href = "../public/login.html";
                    } else {
                        alert("登出失敗，請稍後再試");
                    }
                } catch (err) {
                    console.error("登出錯誤：", err);
                    alert("伺服器錯誤，請稍後再試");
                }
            });
        }
    } catch (err) {
        console.error("navbar footer載入失敗", err)
    };
})



// 載入memberNav時動態載入active
document.addEventListener("DOMContentLoaded", async function () {
    const memberNavContainer = document.getElementById("memberNav");

    if (memberNavContainer) {
        try {
            const memberNavHtml = await fetch("../partials/memberNav.html").then(res => res.text());
            memberNavContainer.innerHTML = memberNavHtml;

            //套用active
            const currentPage = location.pathname.split('/').pop();
            const links = memberNavContainer.querySelectorAll("a");

            links.forEach(link => {
                const href = link.getAttribute("href");
                if (href === currentPage) {
                    link.classList.add("active")
                };
            })

        } catch (err) {
            console.error("memberNav載入失敗", err);
        };
    };
})