var debug = false;

function logit(str) {
  if (debug == false) {
    return;
  }
  var l = document.getElementById("debug-data");
  l.appendChild(document.createElement("br"));
  l.appendChild(document.createTextNode(str));
}

function get_options() {
  var opts = document.getElementsByClassName("optcheck");
  var optsState = {};
  for (i = 0; i < opts.length; i++) {
    optsState[opts[i].id] = opts[i].checked;
  }
  return optsState;
}

function save_options() {
  var optsState = get_options();
  chrome.storage.sync.set(optsState,
                          function() {
                            logit("Saved:");
                            for (var o in optsState) {
                              logit(o + ": " + optsState[o]);
                            }
                            logit("--");
                          });
}

function restore_options() {
  var optsState = get_options();
  logit(Object.keys(optsState));
  chrome.storage.sync.get(Object.keys(optsState), function (opts) {
    logit("Loading...");
    for (var id in optsState) {
      if (opts[id] !== undefined) {
        document.getElementById(id).checked = opts[id];
        logit(id + ": " + opts[id]);
      } else {
        logit("no luck: " + optName);
      }
    }
    logit("done.");
  });
}

function set_defaults() {
  var opts = document.getElementsByClassName("optcheck");
  var defaultCount = 0;
  for (var i in opts) {
    var opt = document.getElementById(i);
    if (opt === null) {
      continue;
    }
    for (j = 0; j < opt.classList.length; j++) {
      if (opt.classList[j] == "def-off") {
        opt.checked = false;
        defaultCount++;
      } else if (opt.classList[j] == "def-on") {
        opt.checked = true;
        defaultCount++;
      }
    }
  }
  logit(defaultCount + " defaults loaded.")
}

document.addEventListener('DOMContentLoaded',
                          function () {
                            set_defaults();
                            restore_options();
                          });
var opts = get_options();
for (var opt in opts) {
  document.getElementById(opt).onclick = save_options;
  logit("watching " + opt);
}
