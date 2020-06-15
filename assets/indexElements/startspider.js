const { ipcRenderer } = require("electron");
const startspider = document.getElementById("startspider");

// Start Spider Click Event
startspider.addEventListener("click", () => {
  startspider.setAttribute(
    "class",
    "button is-fullwidth has-text-black is-danger is-loading"
  );
  startspider.setAttribute("disabled", "");
  ipcRenderer.send("startspider");
});

ipcRenderer.on("startspidermenu", () => {
  startspider.click();
});
