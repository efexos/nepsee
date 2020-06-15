const { ipcRenderer } = require("electron");

const nepse = document.getElementById("nepse");
const sense = document.getElementById("sense");

ipcRenderer.on("indexinit", (e, index, pointchange) => {
  for (var loop = 0; loop < index.length; loop++) {
    if (loop == 0) {
      if (pointchange[loop][0] == "-") {
        nepse.setAttribute("class", "title has-text-danger");
        nepse.innerHTML = index[loop];
      } else if (pointchange[loop] == "0.00") {
        nepse.setAttribute("class", "title has-text-info");
        nepse.innerHTML = index[loop];
      } else {
        nepse.setAttribute("class", "title has-text-success");
        nepse.innerHTML = index[loop];
      }
    } else {
      if (pointchange[loop][0] == "-") {
        sense.setAttribute("class", "subtitle has-text-danger");
        sense.innerHTML = index[loop];
      } else if (pointchange[loop] == "0.00") {
        sense.setAttribute("class", "subtitle has-text-info");
        sense.innerHTML = index[loop];
      } else {
        sense.setAttribute("class", "subtitle has-text-success");
        sense.innerHTML = index[loop];
      }
    }
  }
});
