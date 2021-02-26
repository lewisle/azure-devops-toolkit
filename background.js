const menuItems = {
    CREATE_FEATURE_BRANCH_NAME: 'CREATE_FEATURE_BRANCH_NAME',
};

chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
        id: menuItems.CREATE_FEATURE_BRANCH_NAME,
        title: 'Create Git Feature Branch Name',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!info.selectionText || !info.selectionText.trim()) {
        return;
    }

    if (info.menuItemId === menuItems.CREATE_FEATURE_BRANCH_NAME) {
        chrome.storage.sync.get(null, (result) => {
            const branchName = info.selectionText
                .trim()
                .replace(/\s\s+/g, ' ') // replace all spaces with one space
                .replaceAll(' ', '-')
                .replace(/[^\w\s]/gi, '-') // replace all special characters with dashes
                .replace(/[-]+/g, '-') // replace mutiple dashes with one dash
                .toLowerCase();
            const items = [branchName, ...(result.items || [])];
            console.log(items);
            chrome.storage.sync.set({ items });
        });
    }

    // var url = info.pageUrl;
    // var buzzPostUrl = 'https://www.google.com/search?';
    // if (info.selectionText) {
    //     buzzPostUrl += 'q=' + encodeURI(info.selectionText);
    // }
    // if (info.mediaType === 'image') {
    //     buzzPostUrl += 'imageurl=' + encodeURI(info.srcUrl) + '&';
    // }
    // if (info.linkUrl) {
    //     // The user wants to buzz a link
    //     url = info.linkUrl;
    // }
    // buzzPostUrl += 'url=' + encodeURI(url);
    // Open the page up
    // chrome.tabs.create({ url: buzzPostUrl });
});
