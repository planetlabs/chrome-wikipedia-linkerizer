chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "showIcon") {
        chrome.pageAction.setTitle({tabId: sender.tab.id,
                                    title: ("urls: " + request.urls +
                                            " locs: " + request.locs)});
      }
    });

