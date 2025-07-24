// 收合按鈕轉換
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
    btn.addEventListener('click', function() {
        const icon = this.querySelector('i');
        console.log(icon);
        icon.classList.toggle('rotate');
    });
});