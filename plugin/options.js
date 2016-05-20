/**
 * Purpose: Manage user settings
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

var debug = false;

var options = {"wikipedia-coords": {"default": true,
                                    "info": "Wikipedia coordinates"},
               "google-search": {"default": false,
                                 "info": "Google searches (BETA)"}};

function logit(str) {
  if (debug == false) {
    return;
  }
  var l = document.getElementById("debug-data");
  if (l === null) {
    return;
  }
  l.appendChild(document.createElement("br"));
  l.appendChild(document.createTextNode(str));
}

function save_options() {
  for (var id in options) {
    var cb = document.getElementById(id);
    if (cb !== null) {
      options[id]["state"] = cb.checked;
    }
  }
  chrome.storage.sync.set(options,
                          function() {
                            logit("Saved:");
                            for (var o in options) {
                              logit(o + ": " + options[o]["state"]);
                            }
                            logit("--");
                          });
}

function restore_options(callback) {
  logit(Object.keys(options));
  chrome.storage.sync.get(Object.keys(options), function (opts) {
    logit("Loading...");
    for (var id in opts) {
      if (options[id] !== undefined) {
        options[id]["state"] = opts[id]["state"];
        logit(id + ": " + options[id]["state"]);
      } else {
        logit("no luck: " + id);
      }
    }
    logit("done.");
    if (callback !== undefined) {
      callback(options);
    }
  });
}

function set_defaults() {
  var defaultCount = 0;
  for (var k in options) {
    var opt = document.getElementById(k);
    if (opt === null) {
      continue;
    }
    opt.checked = options[k]["default"];
    defaultCount++;
  }
  logit(defaultCount + " defaults loaded.")
}
