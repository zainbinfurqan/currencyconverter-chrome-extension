if(typeof process !== 'undefined' && process.env){
const apiKey = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;  // This should be bundled via Webpack
chrome.runtime.onInstalled.addListener(() => {
  console.log("API Key from background: ", apiKey);
});
}
