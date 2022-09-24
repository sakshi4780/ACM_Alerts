let previous_events;
let current_events;
// current year , URL , headers for fetching the data
let year = new Date().getFullYear();

const url = new URL(
  `http://localhost:8888/acm-new/admin/blogadmin/api.php/?q=readAllEvent&year=${year}`
);

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// if Extension is Installed or Updated then redirecting it to some page
let installURL = "";
let updateURL = "";
let uninstallURL = "";

chrome.runtime.setUninstallURL(uninstallURL, () => {});

let installReason = (details) => {
  if (details.reason === "install") {
    // chrome.tabs.create({
    //   url: installURL,
    // });

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        // use of local storage
        chrome.storage.local.set({ numberOfEvents: data[0].length });
      });
  } else if (details.reason === "update") {
    // chrome.notifications.onClicked.addListener(onClickNotification);
    notification();
  }
};
function onClickNotification() {
  chrome.tabs.create({
    url: updateURL,
  });
}
chrome.runtime.onInstalled.addListener((details) => {
  installReason(details);
});

// function to show the update extension notification
function notification() {
  //   console.log(12121212);
  chrome.notifications.create({
    title: "ACM Alerts",
    message: "ACM got a New Update!",
    iconUrl: "./assets/logo.png",
    type: "basic",
  });
}

// fetching the data

function countNumberOfEvents() {
  // fetch number of events before fetching again
  chrome.storage.local.get(["numberOfEvents"], (numberOfEvents) => {
    previous_events = numberOfEvents.numberOfEvents;
  });
  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      // use of local storage
      chrome.storage.local.set({ numberOfEvents: data[0].length });
      current_events = data[0].length;

      if (current_events > previous_events) {
        console.log("New event Happened");
      }
    });
}

setInterval(function () {
  countNumberOfEvents();
}, 5000);
