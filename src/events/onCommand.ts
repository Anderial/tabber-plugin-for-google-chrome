import { MegaMegaMessage, ITabInfo, IWindowInfo } from './../model'
import { EvetnHandlerWorcer } from './../core'

//  >>>>>>>>>   Defining onCommand event
chrome.commands.onCommand.addListener(function (command: string) {
    chrome.tabs.getSelected((tab: chrome.tabs.Tab) => {
        var testData = {
            event: "onCommand",
            command_: command,
            current_tab_id: tab.id,
            current_window_id: tab.windowId
        };

        MegaMegaMessage(testData);
    });
});

/**
 *  onCommand event handler
 * @param {WindowInfo} targetWindowInfo Information about browser window and tabs
 * @param {number} targetTabId Id target tab
 */
function onCommandFunction(targetWindowInfo: IWindowInfo, targetTabId: number): IWindowInfo {

    return undefined;
}
