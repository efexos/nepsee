const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const username = require("username");
const { BrowserWindow, ipcMain } = require("electron");

var stocksAbbr = [];
var stocksId = [];
var spider = false;

// Remove Or PoP elements from array.
function pop(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}

// Start The Scraping spiderFunction
async function startScraping() {
  if (spider === true) {
    await axios({
      method: "get",
      url: "http://www.nepalstock.com/",
      timeout: 5000
    })
      .then(res => {
        var $ = cheerio.load(res.data);
        var index = $(".current-index")
          .text()
          .replace(/[^0-9%,.-]/g, " ")
          .replace(/ +(?= )/g, "")
          .split(/[ ]+/);
        var pointchange = $(".point-change")
          .text()
          .replace(/[^0-9%,.-]/g, " ")
          .replace(/ +(?= )/g, "")
          .split(/[ ]+/);
        for (var loop = 0; loop < index.length; loop++) {
          if (index[loop] == "") {
            pop(index, index[loop]);
            pop(pointchange, pointchange[loop]);
          }
        }
        BrowserWindow.getAllWindows()[0].webContents.send(
          "indexinit",
          index,
          pointchange
        );
      })
      .catch(error => {
        console.log(error.code);
      });
    for (let page = 0; page < stocksId.length; page++) {
      var stock = stocksAbbr[stocksId.indexOf(stocksId[page])];
      BrowserWindow.getAllWindows()[0].webContents.send(
        "progressinit",
        page,
        stocksId.length
      );
      await axios({
        method: "get",
        url: "http://www.nepalstock.com/marketdepthofcompany/" + stocksId[page],
        timeout: 5000
      })
        .then(res => {
          BrowserWindow.getAllWindows()[0].webContents.send(
            "progressinit",
            page + 1,
            stocksId.length
          );
          var $ = cheerio.load(res.data);
          var prices = $(".depthIndex")
            .text()
            .replace(/[^0-9%,.-]/g, " ")
            .replace(/ +(?= )/g, "")
            .split(/[ ]+/);
          for (var loop = 0; loop < prices.length; loop++) {
            if (prices[loop] == "" || prices[loop] == ".") {
              pop(prices, prices[loop]);
            }
          }
          var orders = $(".orderTable")
            .text()
            .replace(/[^0-9%,.-]/g, " ")
            .replace(/ +(?= )/g, "")
            .split(/[ ]+/);
          if (orders.length != 1) {
            for (var loop = 0; loop < orders.length; loop++) {
              if (orders[loop] == "" || orders[loop] == ".") {
                pop(orders, orders[loop]);
              }
            }
            var f_orders = [
              orders.slice(0, 3).concat(orders.slice(15, 18)),
              orders.slice(3, 6).concat(orders.slice(18, 21)),
              orders.slice(6, 9).concat(orders.slice(21, 24)),
              orders.slice(9, 12).concat(orders.slice(24, 27)),
              orders.slice(12, 15).concat(orders.slice(27, 30))
            ];
          } else {
            var f_orders = [
              ["---", "---", "---", "---", "---", "---"],
              ["---", "---", "---", "---", "---", "---"],
              ["---", "---", "---", "---", "---", "---"],
              ["---", "---", "---", "---", "---", "---"],
              ["---", "---", "---", "---", "---", "---"]
            ];
          }
          BrowserWindow.getAllWindows()[0].webContents.send(
            "tablesinit",
            stock,
            prices,
            f_orders
          );
        })
        .catch(error => {
          console.log(error.code);
        });
    }
    startScraping();
  }
}

// Save to Cache File
module.exports = {
  save: function saveToCache() {
    if (process.platform === "linux") {
      var cacheFile =
        "/home/" + username.sync() + "/.cache/nepsee/stocks.nepsee";
    } else if (process.platform === "win32") {
      var cacheFile =
        "C:/Users/" + username.sync() + "/Documents/nepsee/stocks.nepsee";
    } else {
      ipcRenderer.send("open-error-dialog", "Err", "Os Not Supported", "");
    }
    fs.writeFile(cacheFile, "", error => {
      if (error) {
        console.log(error.message);
      }
    });
    for (var loop = 0; loop < stocksAbbr.length; loop++) {
      fs.appendFile(
        cacheFile,
        stocksAbbr[loop] + "," + stocksId[loop] + "\n",
        error => {
          if (error) {
            console.log(error.message);
          }
        }
      );
    }
  }
};

// Spider Catch Events
//
// Start Spider Event
ipcMain.on("startspider", (e) => {
  spider = true;
  startScraping();
});

// Stop Spider Event
ipcMain.on("stopspider", e => {
  spider = false;
});

// Add To Spider Event
ipcMain.on("addtospider", (e, stockId, stockAbbr) => {
  stocksId.push(stockId);
  stocksAbbr.push(stockAbbr);
});

// Remove From Spider Event
ipcMain.on("removefromspider", (e, stockAbbr) => {
  var index = stocksAbbr.indexOf(stockAbbr);
  pop(stocksId, stocksId[index]);
  pop(stocksAbbr, stocksAbbr[index]);
});
