import { useEffect, useRef, useState } from 'react';
import { LoaderContainer } from "react-global-loader";

function App() {
  const [items, setItems] = useState<any>({});

  useEffect(()=>{
    const locastorage = localStorage.getItem('amazon_tiktok_data');
    if(locastorage){
      setItems(JSON.parse(locastorage));
    }
  },[])

  useEffect(()=>{
    if (typeof chrome !== "undefined" && chrome.runtime) {
    chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
      try {
      if (message.action === 'sendTabDetails') {
        if(message.obj_) {
          const regex = /(?<=dp\/)([^\/?&]+)/;
          const match = message.obj_.url.match(regex);
          let localStorageState: any = JSON.parse(localStorage.getItem('amazon_tiktok_data') as string);
          localStorageState = {...localStorageState , [match[0]]:message.obj_ }
          localStorage.setItem('amazon_tiktok_data', JSON.stringify(localStorageState));
          setItems(localStorageState)

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

  useEffect(()=>{
    const localStorageState = localStorage.getItem('amazon_tiktok_data');
    if(localStorageState == undefined){
      localStorage.setItem('amazon_tiktok_data', JSON.stringify({}));
    }
   
  },[])

  const handleGetTabDetails = () => {
    try {
      chrome.tabs.query({ active: true, currentWindow: true },(tab) => {
        const activeTab = tab[0]; 
        if (activeTab.id) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: (tab)=>{
              try {
                // alert(tab.url)
                let aboutProduct = ''
                let imagesUrl:any = []
                const regex = /^https:\/\/(?:www|smile)\.amazon\.[a-z]{2,6}/;
                if(document!== null && document.readyState === 'complete' && regex.test(tab.url || '')) {
                  const productTitle = document?.getElementById('productTitle')?.textContent;
                  const price = document?.querySelector('.a-price span')?.textContent;
                  const msqs_ = document.querySelectorAll('.swatchSelect');
                  const msqs = document.querySelectorAll('.swatchAvailable');
                  const selectElement = document.querySelector('select[name="quantity"]');
                  const quantity = selectElement?.querySelectorAll('option');
                  const images = document.querySelectorAll('.a-spacing-small.item.imageThumbnail.a-declarative span span span span img');
                  const desciption = document.querySelectorAll('ul.a-unordered-list.a-vertical.a-spacing-mini li');
                  desciption.forEach(element => {
                    aboutProduct = aboutProduct + ' ' + element.textContent;
                  });
                  images.forEach((element:any) => {
                    let url = element.currentSrc
                    let parts = url.split('._');
      
                    // If we have more than 1 part (i.e., the pattern exists)
                    if (parts.length > 1) {
                        parts[1] = parts[1].split('_.')[1] || '';  // Remove everything after '_.'
                        url = parts.join('.');
                    }
                    imagesUrl.push(url)
                  });
                  chrome.runtime.sendMessage({
                    action: 'sendTabDetails',
                    obj_: {url:tab.url, productTitle, price,sku: msqs_.length + msqs.length, quantity: Object.keys(quantity || {}).length, aboutProduct, imagesUrl},
                  });
              }
              } catch (error) {
                alert(error)
              }
             }, // Function that will run in the tab
             args: [activeTab]
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

  async function  __func  (items:any) {
    alert(items)
    console.log("items",items)
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return 'items'
}

function doSomeWork() { // remove async from here
  async function doSomeWork1() {
    alert("doSomeWork1") // add async here
    console.log("starting");
    console.log("weird, this is never seen");
  }
  doSomeWork1()
}

const getItem = () => items
  

  const inject = (_ : any) => {
    const item = items[_];
    const localstorage:any = JSON.parse(localStorage.getItem('amazon_tiktok_data') as string);
// console.log(localstorage)
console.log(item)
    chrome.tabs.query({ active: true, currentWindow: true },(tab) => {
      const activeTab = tab[0]; 
      if (activeTab.id) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (activeTab, item, localstorage)=> {
            // alert(item.imagesUrl[0])
            // const inputElement:any = document.querySelector('input[data-id="product.publish.product_name"]');
            //     if (inputElement) {
            //         // Add a click event listener to the input element
            //         inputElement.addEventListener('click', () => {
            //             // Set a new value for the input element
            //             inputElement.value = item.productTitle;

            //             console.log('Value set to:', inputElement.value);
            //         });

            //         console.log('Click event listener added.');
            //     } else {
            //         console.log('Input element not found.');
            //     }
               
            alert('else')
                  item.imagesUrl.forEach((item:any, index:any) => {
                    const fileInput:any = document.querySelector('input[type="file"][accept*=".jpg"], input[type="file"][accept*=".png"], input[type="file"][accept*=".jpeg"]');
                    // alert(item)
                        fetch(item)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch image at ${item}`);
                                }
                                return response.blob();
                            })
                            .then((blob) => {
                                alert("Blob fetched for image: " + item);

                                // Create a DataTransfer object to simulate file uploads
                                const dataTransfer = new DataTransfer();

                                // Create a file from the blob
                                const file = new File([blob], `image${index + 1}.jpg`, { type: blob.type });

                                // Add the file to DataTransfer
                                dataTransfer.items.add(file);

                                // Assign the files to the file input
                                fileInput.files = dataTransfer.files;

                                // Trigger the 'change' event to simulate user action
                                fileInput.dispatchEvent(new Event('change', { bubbles: true }));

                                alert(`File for ${item} added to input`);
                            })
                            .catch((error) => {
                                console.error("Error handling image:",item, error);
                            });
                    });
              // fetch(item.imagesUrl[0]).then((_) => {
              //   alert("fetch")
              //  _.blob().then((__) => {
              //   alert("blob")
              //   const dataTransfer = new DataTransfer();
              //   const file = new File([__], `image${2}.jpg`, { type: __.type });
              //   dataTransfer.items.add(file);
              //   fileInput.files = dataTransfer.files;
              //   fileInput.dispatchEvent(new Event('change', { bubbles: true }));
              //   })
              // })
            },
          // func:   (tab, item, localstorage)=> {
        // Call the async function inside the func
              // Your async logic here (e.g., fetching data, waiting for some task)
              // const response = await fetch('https://example.com');
              // const data = await response.json();
              // console.log(data);
            // }
            // const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            // const data = await response.json();
            // return data;
            // asyncOperation(tab,item,localstorage);
          // }, 
          // (tab,item,localstorage)=>{
            // try {
              // const regex = /seller-us\.tiktok/;
            //     alert("all good - ")
                // if(document!== null && document.readyState === 'complete' && regex.test(tab.url || '')) {
                // const titleElement :any = document.querySelector(`input[data-id="product.publish.product_name"]`)
                // const b:any = document.querySelector(`.ProseMirror p`)
            //     // a.value = item.productTitle;
            //     // image upload method 
            //     alert("all good -0 ")
                // const fileInput:any = document.querySelector('input[type="file"][accept*=".jpg"], input[type="file"][accept*=".png"], input[type="file"][accept*=".jpeg"]');
            //     alert("all good -1 ")
            //     if (!fileInput) {
            //       alert("all good -2")
            //         console.error("File input not found");
            //     }
            //     const dataTransfer = new DataTransfer();

            //     for (let i = 0; i < item.imagesUrl.length; i++) {
            //       const url = item.imagesUrl[i];
            //       try {
            //           const response =  fetch(url);
            //           const blob = await response.blob(); 
            //           const file = new File([blob], `image${i + 1}.jpg`, { type: blob.type });
            //           dataTransfer.items.add(file);  // Add the file to the DataTransfer object
            //       } catch (error) {
            //           console.error(`Failed to download image at ${url}`, error);
            //       }
            //     }
                // fileInput.files = dataTransfer.files;
                // fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                // image upload method
                // b.textContent = item.aboutProduct;
            //     alert("all good")
          // return fileInput.outerHTML
            // }
            // } catch (error) {
              // alert(error)
            // }
          //  }, // Function that will run in the tab
           args: [activeTab, item, localstorage]
        }).then((_:any) => {
          // a.value = item.productTitle;
          // console.log("item",item)
          console.log("a",JSON.parse(_?.result))
          console.log("Script executed successfully.----");
          
        }).catch((err) => {
          console.error("Error executing script:", err);
        });
        
      }
    });

  }

  return (
    <div className="App flex h-screen w-full flex-col">
      <div className='p-2 w-full'>
        <p onClick={handleGetTabDetails} className='font-Outfit cursor-pointer text-black rounded-sm px-4 py-2 shadow-md'>Add to favorite</p>
      </div> 
      <div>
        {Object.keys(items).map((item)=>{
          return (
            <div className='w-full flex flex-col shadow-md my-2'>
              <div className='w-full flex flex-row'>
                <div className='w-1/3'>
                  <img src='https://m.media-amazon.com/images/I/51sWjlt1qXL.jpg' alt='product' className='w-1/2 h-1/2'/>
                </div>
                <div className='w-2/3'>
                  <p className='text-black'>Product Title</p>
                  <p className='text-black'>Price</p>
                  <p className='text-black'>SKU</p>
                  <p className='text-black'>Quantity</p>
                  <p className='text-black'>About Product</p>
                  <p className='text-black'>Images</p>
                  <p onClick={()=>inject(item)} className='text-black'>Inject</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
  </div>
  );
}

export default App;
