if (typeof process !== 'undefined' && process.env) {
  const apiKey = process.env.REACT_APP_EXCHANGE_RATE_API_KEY; // This should be bundled via Webpack
  chrome.runtime.onInstalled.addListener(() => {
    console.log('API Key from background: ', apiKey);
  });
}
chrome.runtime.onInstalled.addListener(() => {
  // Send a pageview when the extension is installed
  if (typeof ReactGA !== 'undefined') {
    ReactGA.initialize('G-2Q2P0KWDK4'); // Use your GA4 Tracking ID
    ReactGA.send('pageview', { dp: '/extension-install' }); // Custom page path
  }
});
