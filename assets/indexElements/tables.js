const { ipcRenderer } = require("electron");

ipcRenderer.on("tablesinit", (e, stock, prices, orders) => {
  for (var loop = 0; loop < prices.length; loop++) {
    var td = document.getElementById("prices_" + stock + (loop + 1));
    if (loop == 2) {
      if (prices[2][0] == "-") {
        document
          .getElementById("prices_" + stock + 0)
          .setAttribute("class", "has-text-black has-background-danger");
      } else if (prices[0] == prices[3]) {
        document
          .getElementById("prices_" + stock + 0)
          .setAttribute("class", "has-text-black has-background-info");
      } else {
        document
          .getElementById("prices_" + stock + 0)
          .setAttribute("class", "has-text-black has-background-success");
      }
    }
    if (td.innerHTML.split(" ")[0] == prices[loop]) {
      td.removeAttribute("class");
      td.innerHTML = prices[loop];
    } else {
      td.innerHTML = prices[loop] + " (" + td.innerHTML.split(" ")[0] + ")";
      td.setAttribute("class", "has-text-black has-text-weight-bold");
    }
  }
  for (var loop = 0; loop < 5; loop++) {
    for (var loopx = 0; loopx < orders[loop].length; loopx++) {
      var tdo = document.getElementById("orders_" + stock + loop + (loopx + 1));
      if (tdo.innerHTML.split(" ")[0] == orders[loop][loopx]) {
        tdo.removeAttribute("class");
        tdo.innerHTML = orders[loop][loopx];
      } else {
        tdo.innerHTML =
          orders[loop][loopx] + " (" + tdo.innerHTML.split(" ")[0] + ")";
        tdo.setAttribute("class", "has-text-black has-text-weight-bold");
      }
    }
  }
});
