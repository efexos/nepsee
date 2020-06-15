const { ipcMain, dialog } = require("electron");

ipcMain.on("open-error-dialog", (event, title, message) => {
  dialog.showErrorBox(title, message);
});
