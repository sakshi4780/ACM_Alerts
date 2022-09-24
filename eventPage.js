// if Extension is Installed or Updated then redirecting it to some page

let installURL = "";
let updateURL = "";
let uninstallURL = "";

chrome.runtime.setUninstallURL(uninstallURL, () => {});

let installReason = (details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: installURL,
    });
  } else if (details.reason === "update") {
    chrome.notifications.onClicked.addListener(onClickNotification);
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

let year = new Date().getFullYear();

const url = new URL(
  `http://localhost:8888/acm-new/admin/blogadmin/api.php/?q=readAllEvent&year=${year}`
);

// use of local storage
let length = 6;
chrome.storage.local.set({ len: length });
chrome.storage.local.get(["len"], (data) => {
  //   document.write(data.len);
  //   console.log(data.len);
});

let headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

fetch(url, {
  method: "GET",
  headers: headers,
})
  .then((response) => response.json())
  .then((data) => console.log(data[0].length));
