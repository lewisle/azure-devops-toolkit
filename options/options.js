window.onload = function () {
    initOption('team-prefix');
    initOption('feature-prefix');
    initOption('fix-prefix');
};

function initOption(prefix) {
    const input = document.getElementById(prefix);

    chrome.storage.sync.get(prefix, (result) => {
        input.value = (result && result[prefix]) || '';
    });

    input.onkeyup = debounce(() => {
        chrome.storage.sync.set({ [prefix]: input.value });
    }, 250);
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
