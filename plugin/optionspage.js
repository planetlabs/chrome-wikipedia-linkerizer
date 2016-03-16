document.addEventListener('DOMContentLoaded',
                          function () {
                            set_defaults();
                            restore_options(initOptionsPage);
                          });

function initOptionsPage(options) {
  var ul = document.getElementById("options-list");
  for (k in options) {
    var cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    cb.id = k;
    if (options[k]["state"] !== undefined) {
      if (options[k]["state"] === true) {
        cb.checked = true;
      } else {
        cb.checked = false;
      }
    } else if (options[k]["default"] === true) {
      cb.checked = true;
    } else {
      cb.checked = false;
    }
    cb.onclick = save_options;

    var label = document.createElement("label");
    label.appendChild(cb);
    label.appendChild(document.createTextNode(options[k]["info"]));
    var li = document.createElement("li");
    li.appendChild(label);
    ul.appendChild(li);
  }
}
