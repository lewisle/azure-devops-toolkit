window.onload = function () {
    const itemsContainer = document.getElementById('clipboard');
    const clearButton = document.getElementById('clear');
    const optionsButton = document.getElementById('options');
    const notificationContainer = document.getElementById('notification');

    optionsButton.onclick = () => chrome.runtime.openOptionsPage();
    chrome.storage.sync.get(null, renderItems);

    function renderItems(result) {
        itemsContainer.innerHTML = '';

        if (!result || !result.items || !result.items.length) {
            showNoItems();
            return;
        }

        result.items.forEach((item, index, items) => {
            const text = createElement('div', 'text', [createText(item)]);

            const copyButton = createButton('copy', 'Copy to clipboard', '✅', () => {
                if (!navigator || !navigator.clipboard) {
                    return;
                }

                navigator.clipboard.writeText(item).then(
                    () => {
                        setNotification('Copied 👍', 2000);
                    },
                    (err) => {
                        console.error('ADOT: Could not copy text: ', err);
                    },
                );
            });

            const trashButton = createButton('trash', 'Trash', '❌', () => {
                items.splice(index, 1);
                const newItems = { items };
                chrome.storage.sync.set(newItems);
                renderItems(newItems);
            });

            const actionsContainer = createElement('div', 'actions', [copyButton, trashButton]);
            const itemContainer = createElement('div', 'item');
            itemContainer.append(text, actionsContainer);
            itemsContainer.append(itemContainer);
        });

        clearButton.onclick = function () {
            if (confirm('Are you sure you want to clear all items?')) {
                chrome.storage.sync.set({ items: [] }, () => showNoItems());
            }
        };
    }

    function setNotification(message, timeout) {
        notificationContainer.innerHTML = message;
        notificationContainer.className = 'on';

        window.setTimeout(() => {
            notificationContainer.className = '';
            notificationContainer.innerHTML = '';
        }, timeout);
    }

    function showNoItems() {
        itemsContainer.innerHTML = '<div class="item">No items found ¯(°_o)/¯</div>';
        clearButton.style.display = 'none';
    }

    function createButton(className, title, value, onClickHandler) {
        const button = createElement('button', className, [createText(value)]);
        button.setAttribute('title', title);
        button.onclick = onClickHandler;
        return button;
    }

    function createText(value) {
        return document.createTextNode(value);
    }

    function createElement(tagName, className, children) {
        const element = document.createElement(tagName);
        element.className = className;
        if (children) {
            element.append(...children);
        }
        return element;
    }
};
