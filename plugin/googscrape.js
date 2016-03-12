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
      // find the <ol> element that is the infobox
      var elt = mapImg;
      while (elt !== null && elt.tagName.toLowerCase() != "ol") {
        elt = elt.parentElement;
      }
      if (elt === null) {
        alert("couldn't back out to the infobox");
      }
      var modElts = elt.getElementsByClassName("mod");
      // the third mod elt is the name in large text in the box
      var scenediv = document.createElement("div");
      scenediv.className = "mod";
      scenediv.id = "_scenerizer_link";
      scenediv.appendChild(lnk);
      modElts[3].parentElement.insertBefore(scenediv, modElts[3]);
    });
    observer.observe(document, {"childList": true, "attributes": true,
                                "characterData": true, "subtree": true});
  } else {
    observer.observe(document, {"childList": true, "attributes": true,
                                "characterData": true, "subtree": true});
  }
}

mkLink(watcher);
