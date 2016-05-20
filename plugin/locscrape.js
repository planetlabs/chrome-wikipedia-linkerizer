/**
 * Purpose: Detect and parse locations on Wikipedia pages
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

var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*params=([\d_NSEW\.-]+)/;
var locSplit = /([\d\._-]+)_([NS])_([\d\._-]+)_([EW])/;

var links = [];
var sceneCount = 0;
var locCount = 0;

var debug = false;

function parseLoc(str) {
  // str eg 16_44_13_N_169_31_26_W
  //     or 16_44.25_N_169_31.48_W
  //     or 16.746_N_169.52_W
  // returns [lat, lon] as floats, with South or West as negative values
  var parts = locSplit.exec(str);
  if (parts === null || parts.length < 5) {
    // TODO should maybe return null instead?
    return [0, 0];
  }
  var lat = parseAngle(parts[1]);
  if (parts[2] === "S") {
    lat *= -1;
  }

  var lon = parseAngle(parts[3]);
  if (parts[4] === "W") {
    lon *= -1;
  }

  return [lat, lon];
}

function parseAngle(str) {
  // will parse an angle where X_Y_Z means X degrees, Y arcminutes, Z arcseconds
  //  and return as a floating point value for degrees. Handles floating point
  //  input at any position as well.
  var places = str.split("_");
  var retval = 0;
  var frac = 1.0;
  for (i = 0; i < places.length; i++) {
    retval += parseFloat(places[i]) / frac;
    frac *= 60.0;
  }
  return retval;
}

function sceneify(ln, i) {
  if (i >= ln.length) {
    // have tried all links, set the new icon
    var done = {urls: links.length, locs: locCount, scenes: sceneCount};
    if (debug) {
      done.action = "debugIcon";
      done.apitime = debug.apiTime / locCount;
      done.jstime = debug.jsTime / locCount;
    } else {
      done.action = "lateIconWithInfo";
    }
    chrome.runtime.sendMessage(done, function(response) {});
    return;
  }

  var matches = latlonUrl.exec(ln[i]);
  if (matches === null) {
    // not a coordinate link, skip it.
    sceneify(ln, i + 1);
    return;
  }
  var loc = parseLoc(matches[1]);

  if (debug) {
    debug.sceneStart = new Date();
  }
  mkScenesLink(loc[0], loc[1], function (lnk, sceneDat) {
    if (debug) {
      debug.sceneEnd = new Date();
      var totalTime = new Date().getTime() - debug.sceneStart.getTime();
      debug.jsTime += totalTime;
      debug.apiTime += sceneDat.runtime;
      lnk.setAttribute('title', totalTime + " (" + sceneDat.runtime + ") ms");
    }

    var elt = ln[i];
    var par = elt.parentElement;
    if (elt.nextSibling === null) {
      par.appendChild(lnk);
    } else {
      par.insertBefore(lnk, elt.nextSibling);
    }
    par.insertBefore(document.createTextNode("  "), lnk);

    sceneCount += sceneDat.count;
    // will recurse and run the next link after getting the HTTP response
    sceneify(ln, i + 1);
  });
}

// "Real" execution begins here.
restore_options(function(options) {
  if (options["wikipedia-coords"]["state"] === true) {
    links = document.getElementsByTagName("a");

    if (debug) {
      debug.apiTime = 0;
      debug.jsTime = 0;

      debug.sceneStart = null;
    }

    for (i = 0; i < links.length; i++) {
      if (latlonUrl.exec(links[i]) !== null) {
        locCount++;
      }
    }

    chrome.runtime.sendMessage({action: "earlyIconWithInfo",
                                urls: links.length,
                                locs: locCount}, function(response) {});

    sceneify(links, 0);
  }
});
