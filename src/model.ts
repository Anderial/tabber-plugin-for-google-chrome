/**
 * Browser window info
 */
export interface IWindowInfo {
    id: number;
    tabs: ITabInfo[];
}

/**
 * Browser page info
 */
export interface ITabInfo {
    id: number;
    title: string;
    url: string;
    favIconUrl: string;
    targetWindowId: number;
}

/** 
 * Converting object unknown type received by onCreated event
 * @param {chrome.tabs.Tab} chromeTabInfo Chrom type
 */
export function ConvertTabInfo(chromeTabInfo: chrome.tabs.Tab) : ITabInfo {
    return {
        id: chromeTabInfo.id,
        title: chromeTabInfo.title,
        favIconUrl: chromeTabInfo.favIconUrl,
        url: chromeTabInfo.url,
        targetWindowId: chromeTabInfo.windowId
    };
}

export function nameof<T>(key: keyof T, instance?: T): keyof T {
    return key;
}

/** 
 * Display all field object -> "Attention! Here fucking alert(0_0)"
 * @param {*} otherObject Any object
 */
export function MegaMegaMessage(otherObject: any) {
    alert(JSON.stringify(otherObject, null, 4));
}