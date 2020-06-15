const { ipcRenderer } = require("electron");
const progress = document.getElementById("progress");

ipcRenderer.on("progressinit", (e, perc, total) => {
  progress.setAttribute("value", (perc * 100) / total);
});
