import { useEffect, useState } from 'react';
import './App.css';

function App() {
  
  const [item, setItem] = useState<any>('x9atj66');

  useEffect(()=>{
    const localStorageState = localStorage.getItem('videoLink_1232d2');
    if(localStorageState == undefined){
      localStorage.setItem('videoLink_1232d2', JSON.stringify(''));
    }
  },[])

  useEffect(()=>{
    const localStorageState = localStorage.getItem('videoLink_1232d2');
    if(localStorageState){
      setItem(JSON.parse(localStorageState));
    }
  },[localStorage])

  useEffect(()=>{
    if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
      try {
      if (message.action === 'sendTabUrl') {
        if(message.url && message.url !== '') {
          console.log("message.url",message.url)
          const regexYouTubeURL = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/;
          if(!regexYouTubeURL.test(message.url)){
            return;
          }
          else {
            localStorage.setItem('videoLink_1232d2', JSON.stringify(extractVideoId(message.url)));
            setItem(extractVideoId(message.url));
          }
        }
      }
    } catch (error) {
        console.log("error",error)
    }
    });
  }
  return ()=> {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.onMessage.removeListener(()=>{});
    }
  }
  
  },[])


  function extractVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
  }

  const handleGetTabDetails = () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true },(tab) => {
        const activeTab = tab[0]; 
        if (activeTab.id) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: (tab) => {
              try {
              chrome.runtime.sendMessage({
                action: 'sendTabUrl',
                url: tab.url,
              });
            } catch (error) {
              console.log("error",error);
            }
            },
            args: [
              activeTab
            ]
          }).then(() => {
            console.log("Script executed successfully.");
            
          }).catch((err) => {
            console.error("Error executing script:", err);
          });
          
        }
      });
      
    } catch (error) {
      
    }
  }

  console.log("item",item)

  
  return (
    <div className="App font-Outfit">
      <p onClick={handleGetTabDetails} className='font-Outfit cursor-pointer text-black rounded-sm px-4 py-2 shadow-md'>Continuo Video</p>
      <div>
      <iframe 
        width="100%" 
        height="220" 
        src={`https://www.youtube.com/embed/${item}?rel=0&modestbranding=1&iv_load_policy=3&fs=0&autohide=1`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
        >
      </iframe>
      </div>
    </div>
  );
}

export default App;
