const path = require("path");
const { ipcRenderer } = require("electron");
const { ipcMain, BrowserWindow } = require("electron").remote;

const removestock = document.getElementById("removestock");

let removeWin = null;

// Create Remove Stock Window
function createRemoveWin() {
  const removeWinOptions = {
    maxWidth: 500,
    maxHeight: 200,
    minWidth: 500,
    minHeight: 200,
    width: 500,
    height: 200,
    title: "Nepsee: Remove",
    webPreferences: { nodeIntegration: true }
  };
  if (process.platform === "linux") {
    removeWinOptions.icon = path.join(
      __dirname,
      "../../assets/app-icon/png/512.png"
    );
  }
  removeWin = new BrowserWindow(removeWinOptions);
  removeWin.removeMenu();
  removeWin.loadURL(
    path.join("file://", __dirname, "../../sections/removestock.html")
  );
  removeWin.on("closed", () => {
    removeWin = null;
  });
}

// Click Events
removestock.addEventListener("click", () => {
  createRemoveWin();
});

// Renderer Processes events
ipcMain.on("confirmremove", (e, stockAbbr, isLast) => {
  stockAbbr = stockAbbr.toUpperCase();
  const stockPricesTbody = document.getElementById("prices_" + stockAbbr);
  const stockOrdersTbody = document.getElementById("orders_" + stockAbbr);
  if (stockPricesTbody != null) {
    stockPricesTbody.parentNode.removeChild(stockPricesTbody);
    stockOrdersTbody.parentNode.removeChild(stockOrdersTbody);
    ipcRenderer.send("removefromspider", stockAbbr);
  } else {
    ipcRenderer.send(
      "open-error-dialog",
      "Err Not Found",
      'No Stock "' + stockAbbr + '" found !!!'
    );
  }
  if (isLast == true) {
    removeWin.close();
  }
});

ipcMain.on("cancelremove", () => {
  removeWin.close();
});

ipcRenderer.on("removemenu", () => {
  removestock.click();
});
