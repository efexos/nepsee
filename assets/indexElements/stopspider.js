const { ipcRenderer } = require("electron");
const stopspider = document.getElementById("stopspider");

// Stop Spider Click Event
stopspider.addEventListener("click", () => {
  document
    .getElementById("startspider")
    .setAttribute("class", "button is-fullwidth has-text-black is-success");
  document.getElementById("startspider").removeAttribute("disabled");
  ipcRenderer.send("stopspider");
});

ipcRenderer.on("stopspidermenu", () => {
  stopspider.click();
});
