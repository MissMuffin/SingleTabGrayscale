var state = 0;
//0 means all tabs are in original color.
//1 means all tabs turn to black-white color

function changeToGray(tabId) {
    //Sends the current state to the tab having the provided tabID.
    browser.tabs.sendMessage(
        tabId,
        { state: state },
    ).then(response => {
        console.log('Tab ' + tabId + ' ' + response.info);
    });
}

function click() {
    if (state == 0) state = 1;
    else state = 0;
    browser.tabs.query({ active: true, currentWindow: true}).then((tabs) => {
        //should only ever return one tab in chrome and firefox
        // https://stackoverflow.com/questions/49463077/can-browser-tabs-queryactive-true-currentwindow-true-ever-return-more-tha
        let tab = tabs[0];
        if (tab) {
            
            browser.tabs.sendMessage(
                tab.id,
                {state: state}
            ).then(response => {
                console.log('Tab ' + tabId + ' ' + response.info);
            });

        } else {
            console.log('more than one active tab');
        }
    });
}
function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log("Update tab " + tabId);
    changeToGray(tabId);
}
function handleAttached(tabId, attachInfo) {
    console.log("Attach tab " + tabId);
    changeToGray(tabId);
}

browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onAttached.addListener(handleAttached);
browser.browserAction.onClicked.addListener(click);