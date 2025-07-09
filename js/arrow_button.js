//下拉選單功能
const collapseElements = document.querySelectorAll('.collapse');

collapseElements.forEach(collapseEl => {
    collapseEl.addEventListener('show.bs.collapse', function () {
        const targetId = this.getAttribute('id');
        const icon = document.querySelector(`i[data-toggle-icon='${targetId}']`);
        icon.classList.remove('bi-caret-down-fill');
        icon.classList.add('bi-caret-up-fill');
    });

    collapseEl.addEventListener('hide.bs.collapse', function () {
        const targetId = this.getAttribute('id');
        const icon = document.querySelector(`i[data-toggle-icon='${targetId}']`);
        icon.classList.remove('bi-caret-up-fill');
        icon.classList.add('bi-caret-down-fill');
    });
});