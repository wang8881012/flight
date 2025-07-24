// 載入navbar footer
document.addEventListener("DOMContentLoaded", async function () {
    const navbarContainer = document.getElementById("navbar");
    const footerContainer = document.getElementById("footer");

    try {
        const navbarHtml = await fetch("../partials/navbar.html").then(res => res.text());
        const footerHtml = await fetch("../partials/footer.html").then(res => res.text());

        navbarContainer.innerHTML = navbarHtml;
        footerContainer.innerHTML = footerHtml;

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