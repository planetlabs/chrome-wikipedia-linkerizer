chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      switch (request.action) {
        case "earlyIconWithInfo":
          chrome.pageAction.setTitle({tabId: sender.tab.id,
                                      title: ("urls: " + request.urls +
                                              " locs: " + request.locs)});
          // fallthrough
        case "earlyIcon":
          chrome.pageAction.setIcon({tabId: sender.tab.id, path: "start.png"});
          chrome.pageAction.show(sender.tab.id);
          break;
        case "lateIconWithInfo":
          chrome.pageAction.setTitle({tabId: sender.tab.id,
                                      title: ("urls: " + request.urls +
                                              " locs: " + request.locs +
                                              " scenes: " + request.scenes)});
          // fallthrough
        case "lateIcon":
          chrome.pageAction.setIcon({tabId: sender.tab.id, path: "complete.png"});
          chrome.pageAction.show(sender.tab.id);
          break;
        case "debugIcon":
          chrome.pageAction.setIcon({tabId: sender.tab.id, path: "complete.png"});
          chrome.pageAction.show(sender.tab.id);
          chrome.pageAction.setTitle({tabId: sender.tab.id,
                                      title: ("urls: " + request.urls +
                                              " locs: " + request.locs +
                                              " scenes: " + request.scenes +
                                              " api: " + request.apitime +
                                              " js: " + request.jstime)});
          break;
      }
    });

