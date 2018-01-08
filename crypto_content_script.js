// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log('crypto content loaded.');
// The background page is asking us to find an address on the page.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      fillTotals();
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
    });
  
  // Search the text nodes for a US-style mailing address.
  // Return null if none is found.
  var fillTotals = function() {
    var buyTotalButton = document.getElementById('buy-total-amount');
    buyTotalButton.click();

    var buypriceField = document.getElementById('buyprice');
    var buynettotalField = document.getElementById('buynettotal');

    var curr_data = {curr_price: buypriceField.value, curr_totalbtc: buynettotalField.value};
    chrome.runtime.sendMessage(curr_data, handleResponse);    
  }
  
  var handleResponse = async function(response) {
    var buypriceField = document.getElementById('buyprice');
    var buynettotalField = document.getElementById('buynettotal');   

    buypriceField .value = parseFloat(response.priceToPay).toFixed(8);
    buynettotalField .value = parseFloat(response.btc).toFixed(9);
    
    var eve = new Event('change');
    
    buynettotalField.dispatchEvent(eve);

    await sleep(1000);

    if(response.buy === true) {
        document.getElementById('buysubmit').click();
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  