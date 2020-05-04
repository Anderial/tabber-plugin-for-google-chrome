import { ITabInfo, IWindowInfo, MegaMegaMessage } from './model'
import { EvetnHandlerWorcer } from './core'

//  Clean LocalStorage
// window.onload = function CleanLocalStorage() { chrome.storage.local.clear(() => { alert("local storage is cleaned") }); }

window.onload = () => chrome.windows.getCurrent(function (getInfo) {
    var currentWindowId = getInfo.id;
    //  Start function that will give data about our window and having executed function passed, will save changes
    EvetnHandlerWorcer(currentWindowId, 0, windowOnloadEvent);
});

/**
 *  Function draw tabs list 
 * @param {IWindowInfo} currentWindowInfo 
 * @param {number} targetTabId Id target tab
 */
function windowOnloadEvent(targetWindowInfo: IWindowInfo, targetTabId: number) {
    //  Take parent element for the list items
    let parentHtmlElement = document.getElementById("selected_tabs_history");
    //  We clean it
    parentHtmlElement.innerHTML = "";
    //  Add items
    for (let index = 0; index < targetWindowInfo.tabs.length; index++) {
        let tabInfo = targetWindowInfo.tabs[index];
        createDomElement(tabInfo, parentHtmlElement);
    }
    return undefined;
}

/**
 * Function for drawing tab list item
 * @param {ITabInfo} tab_info 
 * @param {*} parent_element 
 */
function createDomElement(tab_info: ITabInfo, parent_element: any) {
    let new_item = document.createElement("li");
    new_item.setAttribute("id", tab_info.id.toString());
    let node = document.createTextNode("Tab id: " + tab_info.id + ", name: " + tab_info.title);
    new_item.appendChild(node);
    parent_element.appendChild(new_item);
}