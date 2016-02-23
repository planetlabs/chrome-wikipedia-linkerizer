var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*params=([\d_NSEW\.]+)/;
var angleFrac = /(\d+)_(\d+)_(\d+)_([NS])_(\d+)_(\d+)_(\d+)_([EW])/;
var angleDec = /(\d+\.\d+)_([NS])_(\d+\.\d+)_([EW])/;
var scenesUrl = "https://www.planet.com/scenes/#/zoom/13/acquired/0/geometry/"
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

var links = document.getElementsByTagName("a");

var locCount = 0;
for (i = 0; i < links.length; i++) {
  var matches = latlonUrl.exec(links[i]);
  if (matches !== null) {
    var loc = parseLoc(matches[1]);
    var ln = document.createElement('a');
    ln.setAttribute('href', scenesUrl + "POINT(" + loc[1] + "%20" + loc[0] + ")"
                            + "/center/" + loc[1] + "," + loc[0]);
    ln.appendChild(document.createTextNode("(scenes)"));
    var par = links[i].parentElement;
    if (links[i].nextSibling === null) {
      par.appendChild(ln);
    } else {
      par.insertBefore(ln, links[i].nextSibling);
    }
    par.insertBefore(document.createTextNode("  "), ln);
    locCount++;
  }
}

chrome.runtime.sendMessage({action: "showIcon",
                            urls: links.length,
                            locs: locCount}, function(response) {});
