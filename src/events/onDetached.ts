import { EvetnHandlerWorcer } from './../core'
import { onRemovedFunction } from './onRemoved'

//  >>>>>>>>>   Defining onDetached event
chrome.tabs.onDetached.addListener(function (tabId: number, detachInfo: chrome.tabs.TabDetachInfo) {
    var oldWindowId = detachInfo.oldWindowId;
    var targetTabId = tabId;
    //  Start function that will give data about our window and having executed function passed, will save changes
    EvetnHandlerWorcer(oldWindowId, targetTabId, onRemovedFunction);
});