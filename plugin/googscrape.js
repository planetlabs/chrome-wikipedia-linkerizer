var latlon = /\/maps\/.*@([-0-9.]+),([-0-9.]+),[0-9]+z/

var watcher = new MutationObserver(docChanged);
var changeTimer = null;

function docChanged(records, observer) {
  if (changeTimer !== null) {
    clearTimeout(changeTimer);
  }
  changeTimer = setTimeout(mkLink(observer), 1000);
}

function mkLink(observer) {
  var mapImg = document.getElementById("lu_map");
  if (document.getElementById("_scenerizer_link") !== null || mapImg === null) {
    return;
  }
  observer.disconnect();
  // find the link with a coord
  var pos = latlon.exec(mapImg.parentElement.href);
  if (pos !== null) {
    mkScenesLink(pos[1], pos[2], function(lnk, obj) {
      var mapImg = document.getElementById("lu_map");
      if (document.getElementById("_scenerizer_link") !== null
          || mapImg === null) {
        return;
      }
      // There is a race condition where we've kicked off mkScenesLink() and the
      //  page has changed (eg. due to the user's typing) before it has finished
      //  the scenes query and called the callback. In that case, we could add
      //  an incorrect scenes link. So we check to make sure the current infobox
      //  map is for the same location as the callback is for.
      var newPos = latlon.exec(mapImg.parentElement.href);
      if (newPos[1] != pos[1] || newPos[2] != pos[2]) {
        return;
      }

      // find the <ol> element that is the infobox
      var elt = mapImg;
      while (elt !== null && elt.tagName.toLowerCase() != "ol") {
        elt = elt.parentElement;
      }
      if (elt === null) {
        // couldn't back out to the infobox. I actually haven't seen this
        //  happen, but I'm not 100% sure that it never will.
        return;
      }
      var modElts = elt.getElementsByClassName("mod");
      // the third mod elt is the name in large text in the box
      var scenediv = document.createElement("div");
      scenediv.className = "mod";
      scenediv.id = "_scenerizer_link";
      scenediv.appendChild(lnk);
      modElts[3].parentElement.insertBefore(scenediv, modElts[3]);
    });
  }
  observer.observe(document, {"childList": true, "attributes": true,
                              "characterData": true, "subtree": true});
}

mkLink(watcher);
