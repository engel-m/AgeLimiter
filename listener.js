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
const urlfilter = {urls: [
  "*://*.google.com/search?*",
  "*://*.google.co.jp/search?*",
  "*://*.google.co.uk/search?*", 
  "*://*.google.es/search?*", 
  "*://*.google.ca/search?*",
  "*://*.google.it/search?*",
  "*://*.google.fr/search?*",
  "*://*.google.com.au/search?*",
  "*://*.google.com.tw/search?*",
  "*://*.google.nl/search?*",
  "*://*.google.com.br/search?*",
  "*://*.google.com.tr/search?*",
  "*://*.google.be/search?*",
  "*://*.google.com.gr/search?*",
  "*://*.google.co.in/search?*",
  "*://*.google.com.mx/search?*",
  "*://*.google.dk/search?*",
  "*://*.google.com.ar/search?*",
  "*://*.google.ch/search?*",
  "*://*.google.cl/search?*",
  "*://*.google.at/search?*",
  "*://*.google.co.kr/search?*",
  "*://*.google.ie/search?*",
  "*://*.google.com.co/search?*",
  "*://*.google.pl/search?*",
  "*://*.google.pt/search?*",
  "*://*.google.com.pk/search?*"
], types: ['main_frame', 'sub_frame']}
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

