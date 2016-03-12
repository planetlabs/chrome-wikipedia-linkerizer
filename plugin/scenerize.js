var scenesUrl = "https://www.planet.com/scenes/#/zoom/12/acquired/0/geometry/";
var apiUrl = "https://9ega98lmsd.execute-api.us-west-2.amazonaws.com/prod?"

function mkScenesLink(lat, lon, callback) {
  // will call callback(link_element, sceneDat_object
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {
      var sceneDat = JSON.parse(req.responseText);
      var lnk = linkify(lat, lon, sceneDat);
      callback(lnk, sceneDat);
    }
  };

  req.open("GET", apiUrl + "lat=" + lat + "&lon=" + lon, true);
  req.send(null);
}

function linkify(lat, lon, sceneObj) {
  // Creates a link to the Planet scenes web app
  var ln = document.createElement('a');
  ln.setAttribute('href', scenesUrl + "POINT(" + lon + "%20" + lat + ")"
                          + "/center/" + lon + "," + lat);
  if (sceneObj.count !== undefined) {
    ln.appendChild(document.createTextNode("(" + sceneObj.count + " scenes)"));
  } else {
    // sometimes we get an error response
    ln.appendChild(document.createTextNode("(scenes link)"));
    ln.setAttribute('title', "API error getting scene count");
  }

  return ln;
}
