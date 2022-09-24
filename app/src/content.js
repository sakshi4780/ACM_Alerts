function checkNumberOfEvents() {
  localStorage.getItem("numberOfEvents");
  console.log(numberOfEvents);
  chrome.storage.local.get(["numberOfEvents"], (numberOfEvents) => {
    console.log(numberOfEvents.numberOfEvents);
    // console.log(numberOfEvents.numberOfEvents);
  });
}

// when DOM is fully loaded
window.addEventListener("DOMContentLoaded", (event) => {
  setInterval(function () {
    checkNumberOfEvents();
  }, 1000);
});
