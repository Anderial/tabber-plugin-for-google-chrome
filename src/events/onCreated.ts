import { ITabInfo, IWindowInfo } from './../model'
import { EvetnHandlerWorcer } from './../core'

//  >>>>>>>>>   Defining onCreated event
chrome.tabs.onCreated.addListener((createdTab) => {
    var targetWindowId = createdTab.windowId;
    var targetTabId = createdTab.id;
    //  Start function that will give data about our window and having executed function passed, will save changes
    EvetnHandlerWorcer(targetWindowId, targetTabId, onCreatedFunction);
});

/**
 *  OnCreated event handler
 * @param {WindowInfo} targetWindowInfo Information about browser window and tabs
 * @param {number} targetTabId Id target tab
 */
function onCreatedFunction(targetWindowInfo: IWindowInfo, targetTabId: number): IWindowInfo {
    //  Check, if targetTabId is exist in targetWindowInfo
    var tabInfo: ITabInfo = targetWindowInfo.tabs.find(tab => tab.id == targetTabId);
    if (tabInfo != undefined) {
        return undefined;
    }

    //  Fill new tab info
    tabInfo = {
        id: targetTabId,
        favIconUrl: undefined,
        title: undefined,
        url: undefined,
        targetWindowId: targetWindowInfo.id
    }

    //  Set number elements after which new tab will be added.
    var countFirstItem: number = 2;

    //  Check if number of elements in array is less than or equal to 'countFirstItem', then just add new
    if (targetWindowInfo.tabs.length <= countFirstItem) {
        targetWindowInfo.tabs.push(tabInfo);
        return targetWindowInfo;
    }

    //  Create empty array
    var newTabsArray: ITabInfo[] = [];

    //  Add in 'newTabsArray' first 'countFirstItem' items
    for (var index = 0; index < countFirstItem; index++) {
        const tab = targetWindowInfo.tabs[index];
        newTabsArray.push(tab);
    }

    //  Add information about new tab to new array
    newTabsArray.push(tabInfo);

    //  Add all other elements from the old array.
    for (var index = countFirstItem; index < targetWindowInfo.tabs.length; index++) {
        const tab = targetWindowInfo.tabs[index];
        newTabsArray.push(tab);
    }

    //  Redefine tabs list
    targetWindowInfo.tabs = newTabsArray;

    return targetWindowInfo;
}