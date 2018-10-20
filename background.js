const TURN_ON_GRAYSCALE = "Turn on grayscale";
const TURN_OFF_GRAYSCALE = "Turn on color";

// keep list of a grayed out tabs for persisting state on tab reload
var grayTabs = [];

function toggleGrayscale(tabId, isGrayscale) {
    //Sends the current state to the tab having the provided tabID.
    browser.tabs.sendMessage(
        tabId,
        { isGrayscale: isGrayscale },
        ).then(response => {
            // console.log('Tab ' + tabId + ' ' + response.info);
        });
    }

    function turnOn(id) {
        browser.pageAction.setIcon({tabId: id, path: "icons/on.svg"});
        browser.pageAction.setTitle({tabId: id, title: TURN_OFF_GRAYSCALE});
        grayTabs.push(id);
    }
        
    function turnOff(id) {
        browser.pageAction.setIcon({tabId: id, path: "icons/off.svg"});
        browser.pageAction.setTitle({tabId: id, title: TURN_ON_GRAYSCALE});
        grayTabs.pop(grayTabs.indexOf(id));
    }
    
function click(tab) {

    // persist tab state by using the browser action title as status
    function gotTitle(title) {
        let isGrayscale = (title === TURN_OFF_GRAYSCALE)
        let id = tab.id;
        if (isGrayscale) {
            turnOff(id);
        } else {
            turnOn(id);
        }
        toggleGrayscale(tab.id, isGrayscale);
    }
    var gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
    gettingTitle.then(gotTitle);
}

browser.pageAction.onClicked.addListener(click);

// ON RELOAD
function handleUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        if (grayTabs.indexOf(tabId) != -1) {
            turnOn(tabId);
            toggleGrayscale(tabId);
        }
    }
}
browser.tabs.onUpdated.addListener(handleUpdated);

