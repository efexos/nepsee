const { ipcMain, BrowserWindow } = require("electron");

let chartWin = null;

function createChartWin() {
  chartWin = new BrowserWindow({
    width: 1080,
    height: 680
  });
  chartWin.on("closed", () => {
    chartWin = null;
  });
  chartWin.removeMenu();
  chartWin.loadURL("https://chart.nepsechart.com");
  chartWin.show();
}

ipcMain.on("openchart", () => {
  createChartWin();
});
