function checkNumberOfEvents() {
  chrome.storage.local.get(["numberOfEvents"], (numberOfEvents) => {
    // document.write(data.len);
    console.log(numberOfEvents);
  });
}

// when DOM is fully loaded
window.addEventListener("DOMContentLoaded", (event) => {
  var intervalId = window.setInterval(function () {
    checkNumberOfEvents();
  }, 1000);
});
