import { ITabInfo, IWindowInfo, MegaMegaMessage, ConvertTabInfo } from './model'
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
        chrome.tabs.get(tabInfo.id, (tab: chrome.tabs.Tab) => {
            tabInfo = ConvertTabInfo(tab);
            var shortSiteName = tabInfo.url.split('//')[1].split('/')[0];
            if (shortSiteName.startsWith('www.')) {
                shortSiteName = shortSiteName.replace(/^.{4}/, '');
            }
            if (shortSiteName.indexOf('.') == -1) {
                shortSiteName = tabInfo.title;
            }else{
                shortSiteName = `${shortSiteName} ${tabInfo.title}`;
            }
            var element = `
                <div class="list-group-item list-group-item-action rounded-0 ${index == 0 ? 'active' : ''}">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="text-truncate">${shortSiteName}</h5>
                        ${tabInfo.favIconUrl != undefined && tabInfo.favIconUrl != '' ? `<small><img src="${tabInfo.favIconUrl}" width="18" height="18" /></small>` : ''}
                    </div>
                    <p class="col-10 text-truncate" style="padding: 0; margin-bottom: 0;" >${tabInfo.url}</p>
                </div>`
            parentHtmlElement.innerHTML += element;
        });
    }

    return undefined;
}