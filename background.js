var price = 25;
var buy = 10;
var is_buy = false;

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
        if(key == "price")
            price = storageChange.newValue;
        else if (key == "buy")
            buy = storageChange.newValue;
    }
  });

  function getSavedPreferences(url, callback) {
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
    // for chrome.runtime.lastError to ensure correctness even when the API call
    // fails.
    chrome.storage.sync.get(url, (items) => {
      callback(chrome.runtime.lastError ? null : items[url]);
    });
  }

  function savePreferences(pricePercentage, balancePercentage) {
    if(pricePercentage === "")
        pricePercentage = 25;
    if(balancePercentage === "")
        balancePercentage = 10;
        
    console.log('Saving preferences...');
    price = pricePercentage;
    buy = balancePercentage;
    chrome.storage.sync.set({price: pricePercentage, buy: balancePercentage});
    console.log('Price:', pricePercentage);
    console.log('Buy:', balancePercentage);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      
        sendResponse(calculatePriceAndBtc(request));
    });

function calculatePriceAndBtc(data) {
    var curr_price = parseFloat(data.curr_price);
    var curr_totalbtc = parseFloat(data.curr_totalbtc);

    var final_price = parseFloat(curr_price + (curr_price * (price/100))).toFixed(8);
    var final_btc = parseFloat(curr_totalbtc * (buy/100)).toFixed(8);

    return { priceToPay: final_price,  btc: final_btc, buy: is_buy };
}

function execute(isbuy) {
    console.log('order bought');
    is_buy = isbuy;

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            if(response)
                console.log(response.farewell);
        });
      });
}




