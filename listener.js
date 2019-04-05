'use strict';

// Create "About" option in right-click menu
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
      title: "About/Contact",
      contexts: ["browser_action"],
      onclick: function() {
        window.open("about.html","_blank");
      }
});

// Setting global var to retreive user settings
var searchSetting; 
chrome.storage.sync.get("ageValue", function (setting) {
  if (setting.ageValue && setting.ageValue != 'any') {
    searchSetting = 'qdr:' + setting.ageValue;     
  }   
});

// Callback function for request listener
function queryChanger(request) {
  if (searchSetting) {    
    let urlObject = new URL(request.url);
    urlObject.searchParams.set('tbs', searchSetting);
    return {redirectUrl: urlObject.href};
  }
  else {
    let urlObject = new URL(request.url);
    urlObject.searchParams.delete('tbs');
    return {redirectUrl: urlObject.href};
  }
}

// Options inserted into request listener
const urlfilter = {urls: ["https://www.google.com/search?*"], types: ['main_frame', 'sub_frame']}
const opt_extraInfoSpec = ["blocking"];

// The request listener
chrome.webRequest.onBeforeRequest.addListener(
  queryChanger,  
  urlfilter,
  opt_extraInfoSpec
);

// Listener for changes to user settings in storage
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area == "sync" && changes.ageValue.newValue && changes.ageValue.newValue != 'any') {
    searchSetting = 'qdr:' + changes.ageValue.newValue;
  }
  else {
    searchSetting = '';
  }
});

