const { ipcRenderer } = require("electron");
const openchart = document.getElementById("openchart");

// Click Event
openchart.addEventListener("click", () => {
  ipcRenderer.send("openchart");
});

ipcRenderer.on("openchartmenu", () => {
  openchart.click();
});
