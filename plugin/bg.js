/**
 * Purpose: Background task keeping the icon up to date.
 *
 * Copyright 2016, Planet Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

