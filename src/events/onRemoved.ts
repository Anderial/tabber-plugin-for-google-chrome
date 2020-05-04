import { ITabInfo, IWindowInfo, MegaMegaMessage } from './../model'
import { EvetnHandlerWorcer } from './../core'

//  >>>>>>>>>   Defining onRemoved event
chrome.tabs.onRemoved.addListener(function (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) {
    var targetWindowId = removeInfo.windowId;
    var targetTabId = tabId;
    //  Start function that will give data about our window and having executed function passed, will save changes
    EvetnHandlerWorcer(targetWindowId, targetTabId, onRemovedFunction);
});

/**
 *  OnRemoved event handler
 * @param {WindowInfo} targetWindowInfo Information about browser window and tabs
 * @param {number} targetTabId Id target tab
 */
export function onRemovedFunction(targetWindowInfo: IWindowInfo, targetTabId: number): IWindowInfo {
    //  Search 'targetTabId' and remove in 'targetWindowInfo'
    for (var index = 0; index < targetWindowInfo.tabs.length; index++) {
        const tabInfo = targetWindowInfo.tabs[index];
        if (tabInfo.id == targetTabId) {
            targetWindowInfo.tabs.splice(index, 1);
            return targetWindowInfo;
        }
    }
    return undefined;
}