import { useEffect, useRef, useState } from 'react';
import { LoaderContainer } from "react-global-loader";

function App() {

  const [items, setItems] = useState<any>({});
  const [isLoader, setIsLoader] = useState<boolean>(false);

  useEffect(()=>{
    const localStorageState = localStorage.getItem('dominsUrl_fav_002');
    const allUrls = localStorage.getItem('dominsUrl_fav_all_urls');
    const saveFavCount = localStorage.getItem('dominsSave_fav_count');
    if(localStorageState == undefined){
      localStorage.setItem('dominsUrl_fav_002', JSON.stringify({}));
    }
    if(allUrls == undefined){
      localStorage.setItem('dominsUrl_fav_all_urls', JSON.stringify([]));
    }
    if(saveFavCount == undefined){
      localStorage.setItem('dominsSave_fav_count', JSON.stringify(0));
    }
  },[])

  useEffect(()=>{
    const locastorage = localStorage.getItem('dominsUrl_fav_002');
    if(locastorage){
      setItems(JSON.parse(locastorage));
    }
  },[])

  const fetchMeta =  async(url:any) => {
    try {
      setIsLoader(true)
      const responseForShopifyCheck = await (await fetch(url)).text()
        if (responseForShopifyCheck.includes('cdn.shopify.com') || responseForShopifyCheck.includes('Shopify') || responseForShopifyCheck.includes('Shopify.store')) {
      // const response = await fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?accept_lang=auto&use_proxy=true&app_id=${process.env.REACT_APP_OPENGRAPH_API_KEY}`);
      const response = await fetch(`https://api.dub.co/metatags?url=${url}`);
      const data = await response.json();
      console.log("data",data)

      const regex =  /(?<=https?:\/\/(?:www\.)?)([^\/:]+)/;;
      const match = url.match(regex);
      
      if (match && Object.keys(data).length > 0 && !data.hasOwnProperty('error')) {
        
        const localStorageState: any = JSON.parse(localStorage.getItem('dominsUrl_fav_002') as string);
        const localStorageAllUrl: any = JSON.parse(localStorage.getItem('dominsUrl_fav_all_urls') as string);
        let localStorageSaveFavCount: any = JSON.parse(localStorage.getItem('dominsSave_fav_count') as string);
        
        if(!localStorageState.hasOwnProperty(String(match[0])) && localStorageSaveFavCount < 5){
          data.url = url
          localStorage.setItem('dominsUrl_fav_002', JSON.stringify({...localStorageState, [match[0]]: [data]}));
          localStorageAllUrl.push(url)
          localStorage.setItem('dominsUrl_fav_all_urls', JSON.stringify(localStorageAllUrl));
          localStorageSaveFavCount = localStorageSaveFavCount + 1;
          localStorage.setItem('dominsSave_fav_count', JSON.stringify(localStorageSaveFavCount));
          setItems({...localStorageState, [match[0]]: [data]});
          setIsLoader(false)
        
        } else {

          const localStoragePreviousUrl = localStorageAllUrl.find((item:any) => item === url);
          
          if(localStoragePreviousUrl){
            setIsLoader(false)
            // nothing will happen
          } else {
          
            const addingNewFav = localStorageState[String(match[0])]
            data.url = url
            addingNewFav.push(data)
            localStorage.setItem('dominsUrl_fav_002',JSON.stringify({...localStorageState,[match[0]]: addingNewFav}))
            localStorageAllUrl.push(url)
            localStorage.setItem('dominsUrl_fav_all_urls', JSON.stringify(localStorageAllUrl));
            localStorageSaveFavCount = localStorageSaveFavCount + 1;
            localStorage.setItem('dominsSave_fav_count', JSON.stringify(localStorageSaveFavCount));
            setItems({...localStorageState, [match[0]]: addingNewFav});
            setIsLoader(false)
        
          }
        }
      } else {
        console.log("No match found");
        setIsLoader(false)
      }
    }else{
      console.log("not a shopify site");
      setIsLoader(false)
    }
    } catch (error) {
      console.error('Error fetching meta data', error);
      setIsLoader(false)
    }
  }

  useEffect(()=>{
    if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
      try {
      if (message.action === 'sendTabUrl') {
        if(message.url && message.url !== '') {
         await  fetchMeta(message.url)
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

  const removeFav = (domain: any, value: any) =>{ 
    setIsLoader(true)
    let localStorageState: any = JSON.parse(localStorage.getItem('dominsUrl_fav_002') as string);
    let localStorageAllUrl: any = JSON.parse(localStorage.getItem('dominsUrl_fav_all_urls') as string);
    let afterDelete = localStorageState[domain].filter((item:any)=> item.hybridGraph.url !== value.hybridGraph.url);
   
    if(afterDelete.length == 0){
    
      localStorageAllUrl = localStorageAllUrl.filter((item:any)=> item !== value.hybridGraph.url);
      localStorage.setItem('dominsUrl_fav_all_urls', JSON.stringify(localStorageAllUrl));
      delete localStorageState[domain];
      localStorage.setItem('dominsUrl_fav_002', JSON.stringify(localStorageState));
      setItems(localStorageState)
    
    } else {
      localStorageState[domain] =  afterDelete
      localStorage.setItem('dominsUrl_fav_002', JSON.stringify(localStorageState));
      setItems(localStorageState)

    }
    setIsLoader(false)
  }
  const handleSearch = (e:any) => {
    console.log("e",e)
    console.log("e == ''",e == '')
    // Convert input to lowercase for case-insensitive search
  const query = e.toLowerCase();
  
  // Use Object.keys to loop through the keys of the data object
  const results = Object.keys(items)
    .filter(key => key.toLowerCase().includes(query)) // Check if key matches
    .reduce((acc:any, key) => {
      acc[key] = items[key];  // Add key-value pair to accumulator object
      return acc;
    }, {}); 
    if(e == '') {
      const localStorage_ = JSON.parse(localStorage.getItem('dominsUrl_fav_002') as string);
      console.log(localStorage_);
      setItems(localStorage_)
    } else {
        setItems(results)
      }
  }

  return (
    <div className="App flex h-screen w-full">
      {isLoader && <LoaderContainer  defaultShow={true}/>}
      <div className='p-2 w-full'>
        <p onClick={handleGetTabDetails} className='font-Outfit cursor-pointer text-black rounded-sm px-4 py-2 shadow-md'>Add to favorite</p>
          <div className='flex'>
            <input onChange={(e)=>handleSearch(e.target.value)} className='focus:border-none font-Outfit text-black border shadow-md w-full my-2 p-2' placeholder='Search'/>
          </div>
          <div className='w-full overflow-scroll overflow-x-hidden overflow-y-scroll'>
          {Object.keys(items).map((item_:any,index:number)=>{
            return (
              <div key={index} className='flex flex-col rounded-md my-5'>
                <p className='text-md font-bold text-black font-Outfit'>{item_}</p>
                <div className='flex flex-col'>
                  {items[item_].map((item:any,index:number)=>{
                    return (
                      <div key={index} className='flex flex-row w-full p-3 border-2 border-gray-200 rounded-md shadow-md my-2'>
                        <a  target="_blank" rel="noopener noreferrer" href={item?.url} className='flex flex-row w-[90%]'>
                          <div className='self-center'>
                            <img src={item.image} height={35} width={35}/>
                          </div>
                          <div className='flex  flex-col px-2 self-center'>
                            <p className='text-left text-xm font-bold text-[12px] text-black font-Outfit'>{item?.title.length > 45 ? item?.title.substring(0, 35) + '...' : item?.title}</p>
                            {item?.description && item?.description != '' && <p className='text-left text-[10px] font-Outfit text-black'>{item?.description.length > 100 ? item?.description.substring(0, 100) + '...' : item?.description}</p>}
                          </div>
                        </a>
                        <div className='flex flex-row w-[10%] text-center self-center justify-center'>
                          <p onClick={()=>removeFav(item_,item)} className='cursor-pointer text-sm font-bold text-black'>X</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          </div>
      </div> 
  </div>
  );
}

export default App;
