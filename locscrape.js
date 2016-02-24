var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*params=([\d_NSEW\.-]+)/;
var locSplit = /([\d\._-]+)_([NS])_([\d\._-]+)_([EW])/;
var scenesUrl = "https://www.planet.com/scenes/#/zoom/12/acquired/0/geometry/";
var apiUrl = "https://api.planet.com/v0/scenes/ortho/?intersects=";

function parseLoc(str) {
  // str eg 16_44_13_N_169_31_26_W
  //     or 16_44.25_N_169_31.48_W
  //     or 16.746_N_169.52_W
  var parts = locSplit.exec(str);
  if (parts === null || parts.length < 5) {
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
  var places = str.split("_");
  var retval = 0;
  var frac = 1.0;
  for (i = 0; i < places.length; i++) {
    retval += parseFloat(places[i]) / frac;
    frac *= 60.0;
  }
  return retval;
}

function scenesLink(lat, lon, elt, scenecount) {
  var ln = document.createElement('a');
  ln.setAttribute('href', scenesUrl + "POINT(" + lon + "%20" + lat + ")"
                          + "/center/" + lon + "," + lat);
  ln.appendChild(document.createTextNode("(" + scenecount + " scenes)"));
  var par = elt.parentElement;
  if (elt.nextSibling === null) {
    par.appendChild(ln);
  } else {
    par.insertBefore(ln, elt.nextSibling);
  }
  par.insertBefore(document.createTextNode("  "), ln);
}

function sceneify(ln, i) {
  if (i >= ln.length) {
    // set the new icon
    chrome.runtime.sendMessage({action: "lateIcon",
                                urls: links.length,
                                locs: locCount,
                                scenes: sceneCount}, function(response) {});
    return;
  }
  var matches = latlonUrl.exec(ln[i]);
  if (matches === null) {
    sceneify(ln, i + 1);
  }
  var loc = parseLoc(matches[1]);

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var sceneDat = JSON.parse(req.responseText);
      scenesLink(loc[0], loc[1], ln[i], sceneDat.count);
      sceneCount += sceneDat.count;
      sceneify(ln, i + 1);
    }
  };
  req.open("GET", apiUrl + "POINT(" + loc[1] + "%20" + loc[0] + ")", true);
           //true, authkey, authkey);
  req.setRequestHeader("Authorization", "Basic " + btoa(authkey + ":" + authkey));
  req.send(null);
}

var links = document.getElementsByTagName("a");

var locCount = 0;
for (i = 0; i < links.length; i++) {
  var matches = latlonUrl.exec(links[i]);
  if (matches !== null) {
    locCount++;
  }
}

chrome.runtime.sendMessage({action: "earlyIcon",
                            urls: links.length,
                            locs: locCount}, function(response) {});

var sceneCount = 0;
sceneify(links, 0);
