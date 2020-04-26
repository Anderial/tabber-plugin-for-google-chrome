import { MegaMegaMessage, ITabInfo, IWindowInfo } from './../model'
import { EvetnHandlerWorcer,  } from './../core'

//  >>>>>>>>>   Defining onCommand event
chrome.commands.onCommand.addListener(function (command: string) {
    var testData = {
        event: "onCommand",
        command_: command
    };
    MegaMegaMessage(testData);
});