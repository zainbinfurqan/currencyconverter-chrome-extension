import { useEffect,  useState } from 'react';
function App() {
  const [ecommerceObj, setEcommerce] = useState<any>([])
  const currency_:any = {
    au:'AUD',
    de:'EUR',
    USD: 'USD',
  }

  useEffect(() => {
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
      try {
        console.log(message.action)
        console.log(message.ecommerceObj)
      if (message.action === 'sendEcommerceData') {
        const priceRange = /\$(\d+\.\d{2})\s+to\s+\$(\d+\.\d{2})/;
        const currency:any  = message.ecommerceObj.curr == 'com' ? 'USD': message.ecommerceObj.curr
        console.log("currency",currency)
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/pair/${currency_[currency]}/USD`)
        const res = await response.json()
        if(res.result == 'success'){
          let convertedPrice = []
          convertedPrice = message.ecommerceObj.eco.map((item:any)=>{
            console.log("item.price.match(priceRange)",item.price.match(priceRange))
            if(item.price.match(priceRange)){
              const from: any = parseFloat(item.price.match(priceRange)[1])
              const to: any = parseFloat(item.price.match(priceRange)[2])
              return ({...item, price: (parseFloat(from) * res.conversion_rate).toFixed(2) + ' to ' + (parseFloat(to) * res.conversion_rate).toFixed(2)})
            } else{
              let price:any = message.ecommerceObj.curr != 'com' ? parseFloat(item.price.split(' ')[1]) : parseFloat(item.price.split('$')[1])
              console.log("price",price)
              return ({...item, price: (parseFloat(price) * res.conversion_rate).toFixed(2)})
            }
         })
         console.log("convertedPrice",convertedPrice)
          setEcommerce(convertedPrice);
        }
      }
    } catch (error) {
        console.log("error",error)
    }
    });
  }, []);

  const handle = async () => {
    chrome.tabs.query({ active: true, currentWindow: true },(tab) => {
      const activeTab = tab[0]; 
      if (activeTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (tab) => {
            try {
              let result_ = {}
            let ecommerceObj_: any = []
            const priceTags = document.querySelectorAll('.s-item__price');
            const titleTags = document.querySelectorAll('.s-item__title');
                if(priceTags != null){
                  priceTags.forEach((priceTag:any) => {
                    ecommerceObj_.push({price:priceTag.textContent.trim()});
                  });
                }
                if(titleTags != null){
                  titleTags.forEach((title:any,index) => {
                    ecommerceObj_[index].title = title.textContent.trim();
                  });
                }
                let curr_ = null;
                const regex = /ebay\.(\w+)(\/)/;
                if(tab.url){
                  const match = tab.url?.match(regex);
                    if (match) {
                      curr_= match[1];  // This will return the word before the first "/"
                    } else {
                      curr_= null;  // No match found
                    }
                }
            result_ = {eco: ecommerceObj_, curr: curr_}
            chrome.runtime.sendMessage({
              action: 'sendEcommerceData',
              ecommerceObj: result_,
            });
          } catch (error) {
            console.log("error",error);
          }
          },
          args: [
            activeTab,  // apiUrl parameter
          ]
        }).then(() => {
          console.log("Script executed successfully.");
          
        }).catch((err) => {
          console.error("Error executing script:", err);
        });
        
      }
    });
  }

  console.log("ecommerceObj",ecommerceObj)
  return (
    <div className="App flex  h-screen w-full"> 
      <div className="w-[100%] h-[100%] bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-100 mt-4">
        <div className='h-[80%] overflow-scroll flex flex-col'>
          <p className='text-black' id='url-display'></p>
          <button onClick={handle} className='text-black'>click me</button>
          <div className='flex flex-row flex-wrap '>
            {ecommerceObj?.map((item:any)=>{
              return(
                <div className='flex flex-col w-24 m-3'>
                  <p className='text-black text-sm'>{item.title}</p>
                  <p className='text-black text-xm'>{item.price}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
  </div>
  );
}

export default App;
