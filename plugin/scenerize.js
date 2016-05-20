/**
 * Purpose: Fetch the scene count and create a link
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
