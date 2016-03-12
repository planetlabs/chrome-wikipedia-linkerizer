var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*params=([\d_NSEW\.-]+)/;
var locSplit = /([\d\._-]+)_([NS])_([\d\._-]+)_([EW])/;

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
      done.action = "lateIcon";
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

var links = document.getElementsByTagName("a");
var sceneCount = 0;

if (debug) {
  debug.apiTime = 0;
  debug.jsTime = 0;

  debug.sceneStart = null;
}

var locCount = 0;
for (i = 0; i < links.length; i++) {
  if (latlonUrl.exec(links[i]) !== null) {
    locCount++;
  }
}

chrome.runtime.sendMessage({action: "earlyIcon",
                            urls: links.length,
                            locs: locCount}, function(response) {});

sceneify(links, 0);
