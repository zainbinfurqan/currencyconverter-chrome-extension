chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCartAmount') {
    console.log('Received cart amount:', message.amount);
    // You can store the amount in chrome.storage, or handle it as needed
    chrome.storage.local.set({ cartAmount: message.amount });
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  const element = document?.getElementById('url-display') 
  const priceTag = document.getElementsByClassName('s-item__price');
  if(priceTag != null && element != null){
    console.log("priceTag",priceTag)
  }
});