window.onload = function () {
    const itemsContainer = document.getElementById('clipboard');
    const clearButton = document.getElementById('clear');
    const optionsButton = document.getElementById('options');
    const notificationContainer = document.getElementById('notification');
    let notiTimeout;
    let focusTimeout;

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
                        showNotification({ message: 'Copied 👍' });
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
            showNotification({
                message: 'Are you sure?',
                type: 'danger',
                timeout: 10000,
                buttons: [
                    { text: 'Yes', focused: true, onclick: () => clearAllItems() },
                    { text: 'No', onclick: () => hideNotification() },
                ],
            });
        };
    }

    function clearAllItems() {
        hideNotification();
        chrome.storage.sync.set({ items: [] }, () => showNoItems());
    }

    function showNoItems() {
        itemsContainer.innerHTML = '<div class="item">No items found ¯(°_o)/¯</div>';
        clearButton.style.display = 'none';
    }

    function showNotification({ message, type, timeout, buttons }) {
        if (!message) return;
        notificationContainer.innerHTML = '';
        notificationContainer.className = 'on';
        let focusedButton;

        if (type && type === 'danger') {
            notificationContainer.classList.add('danger');
        }

        const messageContainer = createElement('div', '', [createText(message)]);
        notificationContainer.append(messageContainer);

        if (buttons) {
            notificationContainer.classList.add('big');
            const buttonContainer = createElement('div', '');

            buttons.forEach((button) => {
                buttonElement = createButton(button.className, button.title, button.text, button.onclick);
                buttonContainer.append(buttonElement);
                if (button.focused) {
                    focusedButton = buttonElement;
                }
            });
            notificationContainer.append(buttonContainer);
        }

        window.clearTimeout(focusTimeout);
        window.setTimeout(() => focusedButton && focusedButton.focus(), 300);
        window.clearTimeout(notiTimeout);
        notiTimeout = window.setTimeout(() => hideNotification(), timeout || 2000);
    }

    function hideNotification() {
        notificationContainer.className = '';
        notificationContainer.innerHTML = '';
    }

    function createButton(className, title, value, onClickHandler) {
        const button = createElement('button', className, [createText(value)]);
        if (title) {
            button.setAttribute('title', title);
        }
        button.onclick = onClickHandler;
        return button;
    }

    function createText(value) {
        return document.createTextNode(value);
    }

    function createElement(tagName, className, children) {
        const element = document.createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (children) {
            element.append(...children);
        }
        return element;
    }
};
