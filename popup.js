'use strict';

chrome.storage.sync.get('ageValue', function(data) {
  if (data.ageValue) {
    let radiobox = document.getElementById(data.ageValue);
    radiobox.checked = true;
  }
});

const searchAge = document.querySelector("#ageForm");
searchAge.addEventListener('change', (event) => {
  let selected = event.target.value;
  chrome.storage.sync.set({ageValue: selected});
});

const resetButton = document.querySelector("#resetButton");
resetButton.addEventListener('click', (event) => {
  chrome.storage.sync.get('ageValue', function(data) {
    if (data.ageValue) {
      let radiobox = document.getElementById(data.ageValue);
      radiobox.checked = false;
      chrome.storage.sync.remove('ageValue');
    }
  });
});


