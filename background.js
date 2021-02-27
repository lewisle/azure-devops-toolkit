const menuItems = {
    AZURE_DEVOPS_TOOLKIT: 'AZURE_DEVOPS_TOOLKIT',
    CREATE_FEATURE_BRANCH_NAME: 'CREATE_FEATURE_BRANCH_NAME',
    CREATE_FIX_BRANCH_NAME: 'CREATE_FIX_BRANCH_NAME',
};

chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
        id: menuItems.AZURE_DEVOPS_TOOLKIT,
        title: 'Azure DevOps Toolkit',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: menuItems.CREATE_FEATURE_BRANCH_NAME,
        parentId: menuItems.AZURE_DEVOPS_TOOLKIT,
        title: 'Create Git Feature Branch Name',
        contexts: ['selection'],
    });
    chrome.contextMenus.create({
        id: menuItems.CREATE_FIX_BRANCH_NAME,
        parentId: menuItems.AZURE_DEVOPS_TOOLKIT,
        title: 'Create Git Fix Branch Name',
        contexts: ['selection'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!info.selectionText || !info.selectionText.trim()) {
        return;
    }

    if (info.menuItemId === menuItems.CREATE_FEATURE_BRANCH_NAME) {
        createBranchName(info.selectionText, 'feature-prefix');
    }

    if (info.menuItemId === menuItems.CREATE_FIX_BRANCH_NAME) {
        createBranchName(info.selectionText, 'fix-prefix');
    }
});

function createBranchName(text, prefixKey) {
    chrome.storage.sync.get(null, (result) => {
        const storage = result || {};
        const team = storage['team-prefix'] || '';
        const prefix = storage[prefixKey] || '';
        const branchName = team + prefix + formatBranchName(text);
        const items = [branchName, ...(storage.items || [])];
        chrome.storage.sync.set({ items });
    });
}

function formatBranchName(text) {
    return text
        .trim()
        .replace(/\s\s+/g, ' ') // replace all spaces with one space
        .replaceAll(' ', '-')
        .replace(/[^\w\s]/gi, '-') // replace all special characters with dashes
        .replace(/[-]+/g, '-') // replace mutiple dashes with one dash
        .toLowerCase();
}
