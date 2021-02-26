window.onload = function () {
    const clipboard = document.getElementById('clipboard');

    chrome.storage.sync.get(null, (result) => {
        if (!result || !result.items) {
            clipboard.innerHTML = '<div class="item">No items found ¯(°_o)/¯</div>';
            return;
        }

        const items = result.items.map((item) => {
            return `<div class="item">${item}</div>`;
        });
        clipboard.innerHTML = items.join('');
    });
};
