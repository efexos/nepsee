const { ipcRenderer } = require("electron");
const cancel = document.getElementById("cancel");

// Cancel Click Event
cancel.addEventListener("click", () => {
  ipcRenderer.send("cancelremove");
});
