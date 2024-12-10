if(typeof process !== 'undefined' && process.env){
const apiKey = process.env.REACT_APP_GOOGLE_GEMINI_KEY;  // This should be bundled via Webpack
chrome.runtime.onInstalled.addListener(() => {
  console.log("API Key from background: ", apiKey);
});
}

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'sendTabUrl') {
//     // If you're using a React popup, or background to content communication,
//     // you can store or pass the data here as needed.
    
//     // Example: Sending the ecommerce data to a popup or React component
//     // You can set state here if necessary (you may need to use a store or state manager)
//     sendResponse({ status: 'success' });
//   }
// });

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
