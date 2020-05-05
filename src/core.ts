import { IWindowInfo, MegaMegaMessage, nameof, INextMoveTargetTab } from './model';

/** 
 * Event handler
 * @param {number} targetWindowId Target window id
 * @param {number} targetTabId Target tab id
 * @param {Function} eventFunction Event function to be executed
 */
export function EvetnHandlerWorcer(targetWindowId: number, targetTabId: number, eventFunction: Function) {
    connectDB((dbContext: IDBDatabase) => {
        var dbTransaction = dbContext.transaction([storageNameWindowInfo, storageNameNextMoveTargetTab], "readwrite");

        var storageWindowInfo = dbTransaction.objectStore(storageNameWindowInfo);
        var storageNextMoveTargetTab = dbTransaction.objectStore(storageNameNextMoveTargetTab);

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
                storageWindowInfo.put(changedWindowInfo).onsuccess = () => {
                    var clean_NextMoveTargetTab: INextMoveTargetTab = {
                        targetWindowId: targetWindowId,
                        nextTargetTabId: undefined
                    }
                    storageNextMoveTargetTab.put(clean_NextMoveTargetTab);
                };
            }
        }
    });
}

export var indexedDB = window.indexedDB;
export var baseName = "TabberPluginDataBase";
export var storageNameWindowInfo = "WindowInfoStore";
export var storageNameNextMoveTargetTab = "NextMoveTargetTabStorage";

function logerr(error: any) {
    alert("Error in DB !!!!!!!! ")
    MegaMegaMessage(error);
}

export function connectDB(otherFunction: Function) {
    var request = indexedDB.open(baseName, 1);

    request.onerror = logerr;

    request.onsuccess = function () {
        otherFunction(request.result);
    }

    request.onupgradeneeded = function (e) {
        var objectStoreWindowInfoParameters: IDBObjectStoreParameters = {
            autoIncrement: false,
            keyPath: nameof<IWindowInfo>("id")
        };
        request.result.createObjectStore(storageNameWindowInfo, objectStoreWindowInfoParameters);

        var objectStoreNextMoveTargetTabParameters: IDBObjectStoreParameters = {
            autoIncrement: false,
            keyPath: nameof<INextMoveTargetTab>("targetWindowId")
        };
        request.result.createObjectStore(storageNameNextMoveTargetTab, objectStoreNextMoveTargetTabParameters);

        connectDB(otherFunction);
    }
}