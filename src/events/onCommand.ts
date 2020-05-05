import { MegaMegaMessage, ITabInfo, IWindowInfo, INextMoveTargetTab, ConvertTabInfo } from './../model'
import { connectDB, storageNameWindowInfo, storageNameNextMoveTargetTab } from './../core'

//  >>>>>>>>>   Defining onCommand event
chrome.commands.onCommand.addListener(function (command: string) {
    var commands = chrome.runtime.getManifest().commands;

    switch (command) {
        case commands.Ctrl_Shift_Z.description:
            SerchNextCursor();
            break;
        case commands.Ctrl_Shift_X.description:
            MoveNextTargetTab();
            break;
        default:
            alert("Сommand not defined!");
            break;
    }
});

function SerchNextCursor() {
    chrome.tabs.getSelected((tab: chrome.tabs.Tab) => {
        var targetWindowId = tab.windowId;
        var targetTabId = tab.id;

        connectDB((dbContext: IDBDatabase) => {
            var dbTransaction = dbContext.transaction([storageNameWindowInfo, storageNameNextMoveTargetTab], "readwrite");

            var storageWindowInfo = dbTransaction.objectStore(storageNameWindowInfo);
            var storageNextMoveTargetTab = dbTransaction.objectStore(storageNameNextMoveTargetTab);

            var getWindowInfo_Request = storageWindowInfo.get(targetWindowId);

            getWindowInfo_Request.onsuccess = () => {
                var windowInfo: IWindowInfo = getWindowInfo_Request.result;

                if (windowInfo == undefined) {
                    windowInfo = {
                        id: targetWindowId,
                        tabs: []
                    };
                }

                var storageNextMoveTargetTab_Request = storageNextMoveTargetTab.get(targetWindowId)

                storageNextMoveTargetTab_Request.onsuccess = () => {
                    var nextMoveTargetTab: INextMoveTargetTab = storageNextMoveTargetTab_Request.result;

                    if (nextMoveTargetTab == undefined) {
                        nextMoveTargetTab = {
                            targetWindowId: targetWindowId,
                            nextTargetTabId: undefined
                        };
                    }

                    if (nextMoveTargetTab.nextTargetTabId != undefined) {
                        nextMoveTargetTab.nextTargetTabId = GetNextNextTabId(nextMoveTargetTab.nextTargetTabId, windowInfo);
                    } else {
                        nextMoveTargetTab.nextTargetTabId = GetNextNextTabId(targetTabId, windowInfo);
                    }

                    storageNextMoveTargetTab.put(nextMoveTargetTab).onsuccess = () => {
                        chrome.tabs.get(nextMoveTargetTab.nextTargetTabId, (tab: chrome.tabs.Tab) => {
                            var tabInfo: ITabInfo = ConvertTabInfo(tab);
                            tabInfo.id = undefined;
                            tabInfo.targetWindowId = undefined;
                            tabInfo.favIconUrl = undefined;
                            MegaMegaMessage(tabInfo);
                        });
                    };
                }
            }
        });
    });
}

function GetNextNextTabId(currentTabId: number, windowInfo: IWindowInfo): number {
    if (currentTabId == windowInfo.tabs[windowInfo.tabs.length - 1].id) {
        return windowInfo.tabs[0].id;
    }

    for (let index = 0; index < windowInfo.tabs.length; index++) {
        const element = windowInfo.tabs[index];

        if (currentTabId == element.id) {
            return windowInfo.tabs[index + 1].id;
        }
    }
}

function MoveNextTargetTab() {
    chrome.tabs.getSelected((tab: chrome.tabs.Tab) => {
        var targetWindowId = tab.windowId;
        var targetTabId = tab.id;
        connectDB((dbContext: IDBDatabase) => {
            var dbTransaction = dbContext.transaction([storageNameNextMoveTargetTab, storageNameWindowInfo], "readonly");

            var nextTargetTabId: number;

            dbTransaction.oncomplete = () => {
                MoveNextTab(nextTargetTabId)
            };

            var storageWindowInfo = dbTransaction.objectStore(storageNameWindowInfo);

            var storageNextMoveTargetTab = dbTransaction.objectStore(storageNameNextMoveTargetTab);

            var storageNextMoveTargetTab_Request = storageNextMoveTargetTab.get(targetWindowId)

            storageNextMoveTargetTab_Request.onsuccess = () => {
                var nextMoveTargetTab: INextMoveTargetTab = storageNextMoveTargetTab_Request.result;

                if (nextMoveTargetTab != undefined) {
                    nextTargetTabId = nextMoveTargetTab.nextTargetTabId;
                }

                if (nextTargetTabId == undefined) {
                    var storageWindowInfo_requesr = storageWindowInfo.get(targetWindowId);

                    storageWindowInfo_requesr.onsuccess = () => {
                        var windowInfo: IWindowInfo = storageWindowInfo_requesr.result;

                        nextTargetTabId = GetNextNextTabId(targetTabId, windowInfo);
                    }
                }
            }
        });
    });
}

function MoveNextTab(nextTargetTabId: number) {
    var updateProperties: chrome.tabs.UpdateProperties = {
        selected: true,
        active: true,
        highlighted: true
    }

    chrome.tabs.update(nextTargetTabId, updateProperties);
}