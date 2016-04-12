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
