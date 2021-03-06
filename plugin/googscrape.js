/**
 * Purpose: Detect locations on Google sites and insert a link
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

var latlon = /\/maps\/.*@([-0-9.]+),([-0-9.]+),[0-9]+z/

var watcher = null;
var changeTimer = null;

function docChanged(records, observer) {
  chrome.runtime.sendMessage({action: "earlyIcon"}, function (response) {});
  if (changeTimer !== null) {
    clearTimeout(changeTimer);
  }
  changeTimer = setTimeout(mkLink(observer), 1000);
}

function mkLink(observer) {
  var mapImg = document.getElementById("lu_map");
  if (document.getElementById("_scenerizer_link") !== null || mapImg === null) {
    chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
    return;
  }
  // find the link with a coord
  var pos = latlon.exec(mapImg.parentElement.href);
  if (pos !== null) {
    mkScenesLink(pos[1], pos[2], function(lnk, obj) {
      var mapImg = document.getElementById("lu_map");
      if (document.getElementById("_scenerizer_link") !== null
          || mapImg === null) {
        chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
        return;
      }
      // There is a race condition where we've kicked off mkScenesLink() and the
      //  page has changed (eg. due to the user's typing) before it has finished
      //  the scenes query and called the callback. In that case, we could add
      //  an incorrect scenes link. So we check to make sure the current infobox
      //  map is for the same location as the callback is for.
      var newPos = latlon.exec(mapImg.parentElement.href);
      if (newPos !== null && (newPos[1] != pos[1] || newPos[2] != pos[2])) {
        chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
        return;
      }

      // find the <ol> element that is the infobox
      var elt = mapImg;
      while (elt !== null && elt.tagName.toLowerCase() != "ol") {
        elt = elt.parentElement;
      }
      if (elt === null) {
        // couldn't back out to the infobox. I actually haven't seen this
        //  happen, but I'm not 100% sure that it never will.
        chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
        return;
      }
      var modElts = elt.getElementsByClassName("mod");
      // the third mod elt is the name in large text in the box
      var scenediv = document.createElement("div");
      scenediv.className = "mod";
      scenediv.id = "_scenerizer_link";
      scenediv.appendChild(lnk);
      modElts[3].parentElement.insertBefore(scenediv, modElts[3]);
      chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
    });
  } else {
    chrome.runtime.sendMessage({action: "lateIcon"}, function (response) {});
  }
}

restore_options(function(options) {
  if (options["google-search"]["state"] === true) {
    chrome.runtime.sendMessage({action: "earlyIcon"}, function (response) {});
    watcher = new MutationObserver(docChanged);
    watcher.observe(document, {"childList": true, "attributes": true,
                               "characterData": true, "subtree": true});
    mkLink(watcher);
  }
});
