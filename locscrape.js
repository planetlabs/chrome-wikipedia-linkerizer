var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*params=([\d_NSEW\.]+)/;
var angleFrac = /(\d+)_(\d+)_(\d+)_([NS])_(\d+)_(\d+)_(\d+)_([EW])/;
var angleDec = /(\d+\.\d+)_([NS])_(\d+\.\d+)_([EW])/;
var scenesUrl = "https://www.planet.com/scenes/#/zoom/13/acquired/0/geometry/";
var apiUrl = "https://api.planet.com/v0/scenes/ortho/?intersects=";
// TODO locations can also be nn_nn_N_nn_nn_W and nn_n.nn_N_nn_n.nn_W
//       so I need a better parser

function parseLoc(str) {
  // str eg 16_44_13_N_169_31_26_W
  parts = angleFrac.exec(str);
  if (parts === null || parts.length < 8) {
    return parseDecLoc(str);
  }
  lat = parseInt(parts[1]) + (parseInt(parts[2]) / 60.0);
  lat += parseInt(parts[3]) / 3600.0;
  if (parts[4] === "S") {
    lat *= -1;
  }

  lon = parseInt(parts[5]) + (parseInt(parts[6]) / 60.0);
  lon += parseInt(parts[7]) / 3600.0;
  if (parts[8] === "W") {
    lon *= -1;
  }

  return [lat, lon];
}

function parseDecLoc(str) {
  // str eg 16.32_N_169.559_W
  parts = angleDec.exec(str);
  if (parts === null) {
    return [0, 0];
  }
  lat = parseFloat(parts[1]);
  if (parts[2] === "S") {
    lat *= -1;
  }
  lon = parseFloat(parts[3]);
  if (parts[4] === "W") {
    lon *= -1;
  }

  return [lat, lon];
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
    return 0;
  }
  var matches = latlonUrl.exec(ln[i]);
  if (matches === null) {
    return sceneify(ln, i + 1);
  }
  var loc = parseLoc(matches[1]);

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var sceneDat = JSON.parse(req.responseText);
      scenesLink(loc[0], loc[1], ln[i], sceneDat.count);
      return(sceneify(ln, i + 1) + sceneDat.count);
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

var sceneCount = sceneify(links, 0);

// currently doesn't work, not actually returning sceneCount properly
//chrome.runtime.sendMessage({action: "lateIcon",
//                            urls: links.length,
//                            locs: locCount,
//                            scenes: sceneCount}, function(response) {});
