window.onload = function () {
    const clipboard = document.getElementById('clipboard');
    const optionsButton = document.getElementById('options');
    const clearButton = document.getElementById('clear');
    const showNoItems = () => {
        clipboard.innerHTML = '<div class="item">No items found ¯(°_o)/¯</div>';
        clearButton.style.display = 'none';
    };

    chrome.storage.sync.get(null, (result) => {
        if (!result || !result.items || !result.items.length) {
            showNoItems();
            return;
        }

        const items = result.items.map((item) => {
            return `<div class="item">
                <div class="text">${item}</div>
                <!--<div class="actions">
                    <button class="copy">✔ Copy</button>
                    <button class="delete">❌ Trash</button>
                </div>-->
            </div>`;
        });
        clipboard.innerHTML = items.join('');

        clearButton.onclick = function () {
            if (confirm('Are you sure you want to clear all items?')) {
                chrome.storage.sync.set({ items: [] }, () => {
                    showNoItems();
                });
            }
        };
    });

    optionsButton.onclick = function () {
        chrome.runtime.openOptionsPage();
    };
};
