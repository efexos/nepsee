require("update-electron-app");
({ logger: require("electron-log") });

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const username = require("username");
const { app, BrowserWindow, Menu } = require("electron");

const debug = /--debug/.test(process.argv[2]);

if (process.mas) {
  app.setName("Nepsee");
}

let mainWin = null;
const mainMenu = [
  {
    label: "Stocks",
    submenu: [
      {
        label: "Add Stock",
        click() {
          mainWin.webContents.send("addmenu");
        }
      },
      {
        label: "Remove Stock",
        click() {
          mainWin.webContents.send("removemenu");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        role: "close"
      }
    ]
  },
  {
    label: "nSee",
    submenu: [
      {
        label: "Start nSee",
        click() {
          mainWin.webContents.send("startspidermenu");
        }
      },
      {
        label: "Stop nSee",
        click() {
          mainWin.webContents.send("stopspidermenu");
        }
      },
      {
        type: "separator"
      },
      {
        label: "Open Chart",
        click() {
          mainWin.webContents.send("openchartmenu");
        }
      },
      {
        label: "Notify Me",
        click() {
          mainWin.webContents.send("notifyme");
        }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        role: "undo"
      },
      {
        role: "redo"
      },
      {
        type: "separator"
      },
      {
        role: "cut"
      },
      {
        role: "copy"
      },
      {
        role: "paste"
      }
    ]
  },
  {
    label: "View",
    submenu: [
      {
        role: "reload"
      },
      {
        type: "separator"
      },
      {
        role: "resetzoom"
      },
      {
        role: "zoomin"
      },
      {
        role: "zoomout"
      },
      {
        type: "separator"
      },
      {
        role: "togglefullscreen"
      }
    ]
  },
  {
    label: "Window",
    submenu: [
      {
        role: "minimize"
      }
    ]
  }
];

function initApp() {
  makeSingleInstance();
  loadPages();
  function createMainWin() {
    const mainWinOptions = {
      width: 1080,
      minWidth: 1080,
      height: 630,
      minHeight: 580,
      title: app.getName(),
      webPreferences: { nodeIntegration: true }
    };
    if (process.platform === "linux") {
      mainWinOptions.icon = path.join(
        __dirname,
        "/assets/app-icon/png/512.png"
      );
    }
    mainWin = new BrowserWindow(mainWinOptions);
    mainWin.loadURL(path.join("file://", __dirname, "index.html"));
    mainWin.setMenu(Menu.buildFromTemplate(mainMenu));
    if (debug) {
      mainWin.webContents.toggleDevTools();
      mainWin.maximize();
      require("devtron").install();
    }
    mainWin.on("close", () => {
      require("./main/modules/spider").save();
    });
    mainWin.on("closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    mainWin.on("ready-to-show", () => {
      mainWin.show();
    });
    mainWin.webContents.on("did-finish-load", () => {
      if (process.platform === "linux") {
        var cacheFile =
          "/home/" + username.sync() + "/.cache/nepsee/stocks.nepsee";
      } else if (process.platform === "win32") {
        var cacheFile =
          "C:/Users/" + username.sync() + "/Documents/nepsee/stocks.nepsee";
      } else {
        console.log("No Joke"); // Bullshit
      }
      if (fs.existsSync(cacheFile)) {
        let stocks = fs.readFileSync(cacheFile, "utf8").split("\n");
        stocks.forEach(stock => {
          if (stock.split(",").length == 2) {
            let [Abbr, Id] = stock.split(",");
            mainWin.webContents.send("confirmadd", Id, Abbr);
          }
        });
      }
    });
  }
  app.on("ready", createMainWin);
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", () => {
    if (mainWin === null) {
      createMainWin();
    }
  });
}

function makeSingleInstance() {
  if (process.mas) {
    return;
  }
  app.requestSingleInstanceLock();
  app.on("second-instance", () => {
    if (mainWin) {
      if (mainWin.isMinimized()) {
        mainWin.restore();
      }
      mainWin.focus();
    }
  });
}

function loadPages() {
  const files = glob.sync(path.join(__dirname, "main/**/*.js"));
  files.forEach(file => {
    require(file);
  });
}

initApp();
