chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendTabUrl') {
    // If you're using a React popup, or background to content communication,
    // you can store or pass the data here as needed.
    
    // Example: Sending the ecommerce data to a popup or React component
    // You can set state here if necessary (you may need to use a store or state manager)
    sendResponse({ status: 'success' });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  alert('onInstalled')
  // Create a context menu item when the extension is installed
  chrome.contextMenus.create({
    id: "addLink", // ID of the menu item
    title: "Insert Link Here", // Title of the context menu item
    contexts: ["page"] // Only show on page (not on selection, image, etc.)
  });
});

// Listen for clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addLink") {
    // Inject the script to insert a link into the current page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: ()=>{
        alert('ok injected')
      }
    });
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));