var latlonUrl = /https:\/\/tools.wmflabs.org\/\S*=([\d_NSEW]*)/
var locExp = /(\d+)_(\d+)_(\d+)_([NS])_(\d+)_(\d+)_(\d+)_([EW])/

function parseLoc(str) {
  // str eg 16_44_13_N_169_31_26_W
  parts = str.exec(locExp);
  lat = parseInt(parts[1]) + (parseInt(parts[2]) / 60.0);
  lat += parseInt(parts[3]) / 3600.0;
  if (parts[4] === "S") {
    lat *= -1;
  }

  lon = parseInt(parts[5]) + (parseInt(parts[6]) / 60.0);
  lon += parseInt(parst[7]) / 3600.0;
  if (parts[8] === "W") {
    lon *= -1;
  }

  return [lat, lon];
}

var links = document.getElementsByTagName("a");

var locCount = 0;
for (i = 0; i < links.length; i++) {
  if (latlonUrl.test(links[i])) {
    locCount++;
  }
}

chrome.runtime.sendMessage({action: "showIcon",
                            urls: links.length,
                            locs: locCount}, function(response) {});
