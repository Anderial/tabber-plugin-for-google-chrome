import { ITabInfo, IWindowInfo, MegaMegaMessage, nameof } from './model';

/** 
 * Event handler
 * @param {number} targetWindowId Target window id
 * @param {number} targetTabId Target tab id
 * @param {Function} eventFunction Event function to be executed
 */
export function EvetnHandlerWorcer(targetWindowId: number, targetTabId: number, eventFunction: Function) {
    connectDB((dbContext: IDBDatabase) => {
        var dbTransaction = dbContext.transaction([storeName], "readwrite");

        var storageWindowInfo = dbTransaction.objectStore(storeName);

        var getWindowInfoRequest = storageWindowInfo.get(targetWindowId);

        getWindowInfoRequest.onsuccess = () => {
            var windowInfo: IWindowInfo = getWindowInfoRequest.result;

            if (windowInfo == undefined) {
                windowInfo = {
                    id: targetWindowId,
                    tabs: []
                };
            }
    
            var changedWindowInfo = eventFunction(windowInfo, targetTabId);
    
            if (changedWindowInfo != undefined) {
                storageWindowInfo.put(changedWindowInfo);
            }
        }
    });
}

var indexedDB = window.indexedDB,
    baseName = "TabberPluginDataBase",
    storeName = "WindowInfoStore";

function logerr(error: any) {
    alert("Error in DB !!!!!!!! ")
    MegaMegaMessage(error);
}

function connectDB(otherFunction: Function) {
    var request = indexedDB.open(baseName, 1);

    request.onerror = logerr;

    request.onsuccess = function () {
        otherFunction(request.result);
    }

    request.onupgradeneeded = function (e) {
        var objectStoreParameters: IDBObjectStoreParameters = {
            autoIncrement: false,
            keyPath: nameof<IWindowInfo>("id")
        };
        request.result.createObjectStore(storeName, objectStoreParameters);
        connectDB(otherFunction);
    }
}