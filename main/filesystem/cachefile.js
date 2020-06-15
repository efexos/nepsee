const fs = require("fs");
const username = require("username");
const { ipcRenderer, ipcMain } = require("electron");

var stockFile = "/stocks.nepsee";

if (process.platform === "linux") {
  var cacheDir = "/home/" + username.sync() + "/.cache/nepsee";
} else if (process.platform === "win32") {
  var cacheDir = "C:/Users/" + username.sync() + "/Documents/nepsee";
} else {
  console.log("Bull Shit"); //////////////// BUll shit
}

function chkFolder() {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdir(cacheDir, error => {
      if (error) {
        console.log(error.message);
      }
    });
  }
}

function chkStockFile() {
  if (!fs.existsSync(cacheDir + stockFile)) {
    fs.writeFile(cacheDir + stockFile, "", error => {
      if (error) {
        console.log(error.message);
      }
    });
  }
}

chkFolder();
chkStockFile();
