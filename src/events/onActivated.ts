import { ITabInfo, IWindowInfo } from './../model';
import { EvetnHandlerWorcer } from './../core'

//  >>>>>>>>>   Defining tab activation event
chrome.tabs.onActivated.addListener(function (activTab) {
    var targetWindowId = activTab.windowId;
    var targetTabId = activTab.tabId;
    //  Start function that will give data about our window and having executed function passed, will save changes
    EvetnHandlerWorcer(targetWindowId, targetTabId, onActivatedFunction);
});

/**
 *  OnActivated event handler
 * @param {WindowInfo} targetWindowInfo Information about browser window and tabs
 * @param {number} targetTabId Id target tab
 */
function onActivatedFunction(targetWindowInfo: IWindowInfo, targetTabId: number): IWindowInfo {
    var activTab: ITabInfo;

    var index_ActivatedTab = targetWindowInfo.tabs.findIndex(tab => tab.id == targetTabId);
    
    if (index_ActivatedTab > -1) {
        activTab = targetWindowInfo.tabs[index_ActivatedTab];
        targetWindowInfo.tabs.splice(index_ActivatedTab, 1);
    } else {
        activTab = {
            id: targetTabId,
            favIconUrl: undefined,
            title: undefined,
            url: undefined,
            targetWindowId: targetWindowInfo.id
        }
    }
    
    targetWindowInfo.tabs.unshift(activTab);
    
    return targetWindowInfo;
}