chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "earlyIcon") {
        chrome.pageAction.setIcon({tabId: sender.tab.id, path: "start.png"});
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id,
                                    title: ("urls: " + request.urls +
                                            " locs: " + request.locs)});
      } else if (request.action == "lateIcon") {
        chrome.pageAction.setIcon({tabId: sender.tab.id, path: "complete.png"});
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id,
                                    title: ("urls: " + request.urls +
                                            " locs: " + request.locs +
                                            " scenes: " + request.scenes)});
      } else if (request.action == "debugIcon") {
        chrome.pageAction.setIcon({tabId: sender.tab.id, path: "complete.png"});
        chrome.pageAction.show(sender.tab.id);
        chrome.pageAction.setTitle({tabId: sender.tab.id,
                                    title: ("urls: " + request.urls +
                                            " locs: " + request.locs +
                                            " scenes: " + request.scenes +
                                            " api: " + request.apitime +
                                            " js: " + request.jstime)});
	  }
    });

