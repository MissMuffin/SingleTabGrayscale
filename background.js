var isGrayscale = false;

function toggleGrayscale(tabId) {
    //Sends the current state to the tab having the provided tabID.
    browser.tabs.sendMessage(
        tabId,
        { isGrayscale: isGrayscale },
    ).then(response => {
        console.log('Tab ' + tabId + ' ' + response.info);
    });
}

function click() {
    // toggle
    isGrayscale = !isGrayscale;

    //send message to content script to add filter
    browser.tabs.query({ active: true, currentWindow: true}).then((tabs) => {
        //should only ever return one tab in chrome and firefox
        // https://stackoverflow.com/questions/49463077/can-browser-tabs-queryactive-true-currentwindow-true-ever-return-more-tha
        let tab = tabs[0];
        if (tab) {
            toggleGrayscale(tab.id);
        } else {
            console.log('more than one active tab');
        }
    });
}
browser.browserAction.onClicked.addListener(click);

browser.browserAction.setBadgeBackgroundColor({color: "red"});
browser.browserAction.onClicked.addListener((tab)=> {
    console.log("change color");
    browser.browserAction.setBadgeBackgroundColor({
      color: "green",
      tabId: tab.id
    });
  });

//onRemoved listener. fired when tab is removed
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log(`The tab with id: ${tabId}, is closing`);
  
    if(removeInfo.isWindowClosing) {
      console.log(`Its window is also closing.`);
    } else {
      console.log(`Its window is not closing`);
    }

    state = 0;
});

function handleUpdated(tabId, changeInfo, tabInfo) {
    console.log("Update tab " + tabId);
    toggleGrayscale(tabId);
}
browser.tabs.onUpdated.addListener(handleUpdated);

function handleAttached(tabId, attachInfo) {
    console.log("Attach tab " + tabId);
    toggleGrayscale(tabId);
}
browser.tabs.onAttached.addListener(handleAttached);

