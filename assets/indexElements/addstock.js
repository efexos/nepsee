const path = require("path");
const { ipcRenderer } = require("electron");
const { ipcMain, BrowserWindow } = require("electron").remote;

const addstock = document.getElementById("addstock");

let addWin = null;

// Create Add Stock Window
function createAddWin() {
  const addWinOptions = {
    maxWidth: 500,
    maxHeight: 250,
    minWidth: 500,
    minHeight: 250,
    width: 500,
    height: 250,
    title: "Nepsee: Add",
    webPreferences: { nodeIntegration: true }
  };
  if (process.platform === "linux") {
    addWinOptions.icon = path.join(
      __dirname,
      "../../assets/app-icon/png/512.png"
    );
  }
  addWin = new BrowserWindow(addWinOptions);
  addWin.removeMenu();
  addWin.loadURL(
    path.join("file://", __dirname, "../../sections/addstock.html")
  );
  addWin.on("closed", () => {
    addWin = null;
  });
}

// Add Selected Stock to the Tables
function addToTables(stockAbbr) {
  const prices = document.getElementById("prices");
  const orders = document.getElementById("orders");

  // Add Stock in Prices Table
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  tbody.setAttribute("id", "prices_" + stockAbbr);
  for (var loop = 0; loop < 9; loop++) {
    const td = document.createElement("td");
    td.setAttribute("class", "has-text-black");
    td.setAttribute("id", "prices_" + stockAbbr + loop);
    if (loop == 0) {
      td.setAttribute("style", "cursor: pointer;");
      td.setAttribute("class", "has-text-black");
      td.innerText = stockAbbr;
      td.addEventListener("click", () => {
        ipcRenderer.send("sharesansar", stockAbbr);
      });
    }
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
  prices.appendChild(tbody);

  // Add Stock in Orders Table
  const tbody_2 = document.createElement("tbody");
  tbody_2.setAttribute("id", "orders_" + stockAbbr);
  for (var loop = 0; loop < 5; loop++) {
    const tr = document.createElement("tr");
    tr.setAttribute("id", "orders_" + stockAbbr + loop);
    if (loop == 0) {
      const td = document.createElement("td");
      td.setAttribute("rowspan", "5");
      td.setAttribute("class", "has-text-black");
      td.setAttribute("id", "orders_" + stockAbbr + loop + 0);
      td.innerText = stockAbbr;
      tr.appendChild(td);
    }
    for (var loop_2 = 1; loop_2 < 7; loop_2++) {
      const td = document.createElement("td");
      td.setAttribute("class", "has-text-black");
      td.setAttribute("id", "orders_" + stockAbbr + loop + loop_2);
      tr.appendChild(td);
    }
    tbody_2.appendChild(tr);
  }
  orders.appendChild(tbody_2);
}

// Click Events
addstock.addEventListener("click", () => {
  createAddWin();
});

// Renderer Processes events
ipcMain.on("confirmadd", (e, stockId, stockAbbr, isLast) => {
  addToTables(stockAbbr);
  ipcRenderer.send("addtospider", stockId, stockAbbr);
  if (isLast == true) {
    addWin.close();
  }
});

ipcMain.on("canceladd", () => {
  addWin.close();
});

ipcRenderer.on("confirmadd", (e, stockId, stockAbbr) => {
  addToTables(stockAbbr);
  ipcRenderer.send("addtospider", stockId, stockAbbr);
});

ipcRenderer.on("addmenu", () => {
  addstock.click();
});
