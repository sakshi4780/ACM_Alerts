let previous_events;
let current_events;
let button1Text;
let button2Text;
let button1Link;
let button2Link;

// current year , URL , headers for fetching the data
let year = new Date().getFullYear();
let yearLink = `https://usict.acm.org/eventYear.php?year=${year}`;

const url = new URL(
  `http://localhost/acm-new/admin/blogadmin/api.php/?q=readAllEvent&year=${year}`
);

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// if Extension is Installed or Updated then redirecting it to some page
let installURL = "";
let updateURL = "";
let uninstallURL = "";

chrome.runtime.setUninstallURL(uninstallURL, () => {
  // chrome.notifications.create({
  //   title: "ACM Alerts",
  //   message: `Extension is Removed Successfully`,
  //   iconUrl: "./assets/logo.png",
  //   type: "basic",
  //   priority: 2,
  // });
});

let installReason = (details) => {
  console.log(details.reason);
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
    chrome.notifications.create({
      title: "ACM Alerts",
      message: `Extension is Added Successfully`,
      iconUrl: "./assets/logo.png",
      type: "basic",
      priority: 2,
    });
  } else if (details.reason === "update") {
    // chrome.notifications.onClicked.addListener(onClickNotification);
    // notification();
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
function notification(eventName) {
  let tapTo;
  if (button2Text !== "" && button1Text !== "") {
    tapTo = "Register";
  } else if (button1Text !== "" && button2Text === "") {
    tapTo = button1Text;
  } else if (button2Text !== "" && button1Text === "") {
    tapTo = button2Text;
  } else {
    tapTo = "View Event";
  }
  // console.log("dfghjj " + eventName);
  chrome.notifications.create({
    title: "ACM Alerts",
    message: `Event : ${eventName} \nTap to ${tapTo}`,
    iconUrl: "./assets/logo.png",
    type: "basic",
    priority: 2,
  });
}
chrome.notifications.onClicked.addListener(function (notifId) {
  // console.log(yearLink);
  // window.open(link, "_blank");

  if (button2Text !== "" && button1Text !== "") {
    if (button1Text.includes("Register")) {
      chrome.tabs.create({
        url: button1Link,
      });
    } else {
      chrome.tabs.create({
        url: button2Link,
      });
    }
  } else if (button1Text !== "" && button2Text === "") {
    chrome.tabs.create({
      url: button1Link,
    });
  } else if (button2Text !== "" && button1Text === "") {
    chrome.tabs.create({
      url: button2Link,
    });
  } else {
    chrome.tabs.create({
      url: yearLink,
    });
  }
});

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

      // console.log(previous_events + " " + current_events);
      let eventName;
      if (current_events > previous_events) {
        eventName = data[0][data[0].length - 1].name;
        button1Text = data[0][data[0].length - 1].button1Text;
        button2Text = data[0][data[0].length - 1].button2Text;
        button1Link = data[0][data[0].length - 1].button1Link;
        button2Link = data[0][data[0].length - 1].button2Link;

        notification(eventName);
      }
    });
}

setInterval(function () {
  countNumberOfEvents();
}, 5000);
