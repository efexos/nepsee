const confirm = document.getElementById("confirm");
const stocksInput = document.getElementById("stocksInput");
const { ipcRenderer } = require("electron");

// Check Stock in stockInput
function checkStocks() {
  if (stocksInput.value != "") {
    if (stocksInput.value.split(",").length == 1) {
      ipcRenderer.send("confirmremove", stocksInput.value, true);
    } else {
      for (var loop = 0; loop < stocksInput.value.split(",").length; loop++) {
        if (loop == stocksInput.value.split(",").length - 1) {
          ipcRenderer.send(
            "confirmremove",
            stocksInput.value.split(",")[loop],
            true
          );
        } else {
          ipcRenderer.send(
            "confirmremove",
            stocksInput.value.split(",")[loop],
            false
          );
        }
      }
    }
  } else {
    ipcRenderer.send(
      "open-error-dialog",
      "Err NULL Input",
      "Input is empty !!!"
    );
  }
}

// Remove Stock Confirm Evvent
confirm.addEventListener("click", () => {
  checkStocks();
});
