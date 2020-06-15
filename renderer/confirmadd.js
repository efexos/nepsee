const { ipcRenderer } = require("electron");
const confirm = document.getElementById("confirm");
const stocksInput = document.getElementById("stocksInput");
const stockSelect = document.getElementById("stockSelect");

// Get stock from stockSelect
function getStocks(stock, isLast) {
  var stockAbbr = stock.toUpperCase();
  for (var loop = 0; loop < stockSelect.length; loop++) {
    if (stockSelect[loop].text == stockAbbr) {
      var stockId = stockSelect[loop].value;
      break;
    }
  }
  if (loop == 400) {
    ipcRenderer.send(
      "open-error-dialog",
      "Err Not Found",
      'No Stock "' + stockAbbr + '" found !!!'
    );
  } else {
    ipcRenderer.send("confirmadd", stockId, stockAbbr, isLast);
  }
}

// Check inputs for errors
function checkStock() {
  if (stockSelect.selectedIndex != 0 && stocksInput.value == "") {
    var stockId = stockSelect[stockSelect.selectedIndex].value;
    var stockAbbr = stockSelect[stockSelect.selectedIndex].text;
    ipcRenderer.send("confirmadd", stockId, stockAbbr, true);
  } else if (stockSelect.selectedIndex == 0 && stocksInput.value != "") {
    if (stocksInput.value.split(",").length == 1) {
      getStocks(stocksInput.value, true);
    } else {
      for (
        var loop_2 = 0;
        loop_2 < stocksInput.value.split(",").length;
        loop_2++
      ) {
        if (loop_2 == stocksInput.value.split(",").length - 1) {
          getStocks(stocksInput.value.split(",")[loop_2], true);
        } else {
          getStocks(stocksInput.value.split(",")[loop_2], false);
        }
      }
    }
  } else if (stockSelect.selectedIndex == 0 && stocksInput.value == "") {
    ipcRenderer.send(
      "open-error-dialog",
      "Err NULL Input",
      "Both inputs are empty !!!"
    );
  } else {
    ipcRenderer.send(
      "open-error-dialog",
      "Err Input Conflict",
      "Both inputs are used !!!"
    );
  }
}

// Add Stock Confirm Event
confirm.addEventListener("click", () => {
  checkStock();
});
