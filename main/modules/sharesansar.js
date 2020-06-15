const { ipcMain, BrowserWindow } = require("electron");

let sharesansarWin = null;

ipcMain.on("sharesansar", (e, stock) => {
  sharesansarWin = new BrowserWindow({
    width: 1080,
    height: 680
  });
  sharesansarWin.removeMenu();
  sharesansarWin.on("closed", () => {
    sharesansarWin = null;
  });
  sharesansarWin.loadURL("https://www.sharesansar.com/company/" + stock);
  sharesansarWin.show();
});
