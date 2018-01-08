/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, tabs => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == "string", "tab.url should be a string");

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function setTestListener() {  
  console.log('Setting test listener...');
  var test = document.getElementById('test');

  test.addEventListener('click', () => { 
    var valuePercentage = document.getElementById('value-percentage').value;
    var balancePercentage = document.getElementById('balance-percentage').value;
    chrome.extension.getBackgroundPage().savePreferences(valuePercentage, balancePercentage);
    chrome.extension.getBackgroundPage().execute(false);
  });
  console.log('...Done');
}

function setBuyListener() {  
  console.log('Setting buy listener...');
  var buy = document.getElementById('buy');

  buy.addEventListener('click', () => {
      var valuePercentage = document.getElementById('value-percentage').value;
      var balancePercentage = document.getElementById('balance-percentage').value;
      chrome.extension.getBackgroundPage().savePreferences(valuePercentage, balancePercentage);
      chrome.extension.getBackgroundPage().execute(true);
      });
  
  console.log('...Done');
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('value-percentage').value = chrome.extension.getBackgroundPage().price;
  document.getElementById('balance-percentage').value = chrome.extension.getBackgroundPage().buy; ;

  getCurrentTabUrl(url => {
    setTestListener();
    setBuyListener();
  });
});