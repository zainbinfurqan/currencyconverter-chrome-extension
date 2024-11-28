import { useEffect, useRef, useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import { FaBook } from "react-icons/fa";

import { BottomInput } from './components/ButtomInput';
import ChatMessage from './components/ChatMessage';
// import ReactGA from 'react-ga4';  // Import react-ga4
import { io, Socket} from 'socket.io-client';
const socket: Socket = io('http://localhost:3001',{
  transports: ['polling', 'websocket']  // Make sure both transports are supported
});

const eBooksList = [
  {id:'#2344214324342', name:'React js'},
  {id:'#2346673745632', name:'Angular js'},
  {id:'#5462424778565', name:'Vue js'},
  {id:'#5677676352345', name:'Software Architecture'},
]

function App() {

  const messagesEndRef = useRef<any>(null);
  const [isEbookSelected, setIsEbookSelected] = useState<any>(null);
  const [inputFieldText, setInputFieldText] = useState<any>('');
  const [chat, setChat] = useState <any>([])
  const [islanguageSelectDropDownOpen, setIslanguageSelectDropDownOpen] = useState<any>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null)
  const [isAIProcessing, setIsAIProcessing] = useState<any>(false)

  useEffect(()=>{

    // socket.connect();  // .connect() should be valid here
    // console.log("effect")
    // socket.on('connect', () => {
    //   console.log('Connected to server');
    // });
    
    // socket.on('disconnect', () => {
    //   console.log('Disconnected from server');
    // });
    
  },[])

  const addMessageToChat = () => {
    const aiId =  Math.floor(Math.random() * 10000000)
    const messageObj = {
      id: Math.floor(Math.random() * 10000000),
      user:'human',
      message:inputFieldText
    }
    const newChat = [...chat, messageObj,{
      id:aiId,
      user: 'ai',
      message:'',
      isProcessing: true
    }]
    setChat(newChat)
    setInputFieldText('')
    setIsAIProcessing(!isAIProcessing)
    setIslanguageSelectDropDownOpen(false)
    setTimeout(() => {
      queryToServerAi(newChat,aiId)
    }, 3000);

  }
  const queryToServerAi = async (chat:any,aiId:any) => {
    let messageObj = ''
    // console.log("chat queryToServerAi",chat)
    socket.emit('ask-ai-model',{
      bookId : isEbookSelected.id,
      query: inputFieldText,
      language:selectedLanguage
    })
    socket.on('answer-by-ai-model',(data)=>{
      // console.log("answer-by-ai-model",data)
      if(!data.isEnd) {
        messageObj = messageObj + data.data
        const newChat = chat.filter((item:any)=>item.id ==  aiId)
      }
      if(data.isEnd) {
        const aiChatMessageIndex = chat.findIndex((item:any)=>item.id ==  aiId)
        // aiChatMessage.isProcessing = false
        // aiChatMessage.message = messageObj
        chat[aiChatMessageIndex].isProcessing = false
        chat[aiChatMessageIndex].message = messageObj
        const newChat = [...chat]
        setChat(newChat)
      }
    })
    // const response = await fetch('http://localhost:3001/api/askai',{
    //   method:'POST',
    //   headers:{
    //     'Content-Type':'application/json'
    //   },
    //   body:JSON.stringify({
    //     bookId : isEbookSelected.id,
    //     query: inputFieldText,
    //     language:selectedLanguage
    //   })
    // })
    // const res = await response.json()
    // console.log(res)
    //   const messageObj = {
    //     user:'ai',
    //     message:res
    //   }
    //   const newChat = [...chat, messageObj]
    // setChat(newChat)
    // setIsAIProcessing(!isAIProcessing)
  }


  // useEffect(() => {
  //   // Initialize Google Analytics
  //   // ReactGA.initialize('G-7DGEWVXQE8');
    
  //   // Optionally track page view when the extension is opened
  //   ReactGA.send('pageview');
  // }, []);

  // const getTranslationFromAI = async (item:any,index:any) =>  {
  //   setIslLoadingChat(true)
  //   let newChat:any = []
  //   if(translateVia === 'file') {
  //       try {
  //         const response = await fetch(`https://language-translator-server.netlify.app/api/hello?language=${item.language}&url=${uploadedVideoUrl}`) 
  //      console.log("response",response)
  //         const response_ = await response.json()
  //      console.log("response_",response_)
  //       newChat = [...userChat,{user:'other',message:response_}]
  //       userChat[index].inputFlag = false
  //     }catch(error){
  //       console.log(error)
  //     }
  //   }
  //      else{
  //       try {
  //         const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY as string);
  //         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  //         const prompt = `convert this text ${userChat.filter((item:any)=>item?.id && item.id === currentId)[0].message} to ${item.language} language `;
  //         const result = await model.generateContent(prompt);
  //         newChat = [...userChat,{user:'other',message:result.response.text()}]
  //         userChat[index].inputFlag = false
  //      setStep(step+1)
  //       } catch (error:any) {
  //         console.log("error",error.message)
  //         // newChat = [...userChat,{user:'other',message:error}]
  //       }
  //     }
  //     setUserChat(newChat)
  //     setChatInActive(!chatInActive)
  //     setIslLoadingChat(false)
  // }

  

  return (
    <div className="App flex  h-screen w-full"> 
    <div className="w-[100%] h-[100%] bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-100 mt-4">
      <div className='h-[80%] overflow-scroll flex flex-col'>
        <div className='w-full p-2'>
          {isEbookSelected != null && 
          <div className='flex flex-row justify-between'>
            <p onClick={()=>{
              setIsEbookSelected(null)
              setChat([])
            }} 
              className='font-["Outfit"] h-fit m-2 cursor-pointer rounded-lg'>
              <RxCross1 size={'1.3rem'} className='mr-1' color='black'/>
            </p>
            <div>
            <button id="dropdownDefaultButton" onClick={()=>setIslanguageSelectDropDownOpen(!islanguageSelectDropDownOpen)} data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{selectedLanguage != null ? selectedLanguage  : 'Languages'}
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button>
            <div id="dropdown" className={`z-10 w-32 ${islanguageSelectDropDownOpen ? 'block' : 'hidden'} absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
              <ul className="py-2 h-80  text-sm overflow-scroll text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                {['urdu','english','french','chines','german','turkish','japanese','spanish','arabic'].map((item, index)=>{
                  return(
                  <li>
                    <p onClick={()=>{
                      setIslanguageSelectDropDownOpen(!islanguageSelectDropDownOpen)
                      setSelectedLanguage(item)
                      }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item}</p>
                  </li>
                  )})}
              </ul>
            </div>
            </div>
          </div>
          }
        </div>
        {isEbookSelected == null && <div className='mt-20'>
          <p className='text-black font-Outfit py-3'>Please select ebook</p>
        <div className='flex flex-wrap '>
          {eBooksList.map((item, index)=>{
            return(
              <div onClick={()=>{setIsEbookSelected({...item})
              console.log("effect")
              socket.on('connect', () => {
                console.log('Connected to server');
              });
              socket.emit('book-selected', {
                bookId:item.id
              })
              
              socket.on('disconnect', () => {
                console.log('Disconnected from server');
              });
              }} className='flex shadow-md px-5 cursor-pointer rounded flex-col justify-between items-center m-2 p-3 border border-gray-200'>
                <FaBook size={'1.5rem'} className='mr-1' color='black'/>
                <p className='text-black font-light py-3'>{item.name}</p>
              </div>
            )
          })}
        </div>
        </div>}
        <div className=' flex-row overflow-scroll py-10  my-3' ref={messagesEndRef}>
          {console.log("chat",chat)}
          {chat.map((item:any,index:any)=>{
            return(
              <ChatMessage messagesEndRef={messagesEndRef} item={item} userChat={chat} index={index}/>)
          })}
        </div>
      </div>
      {isEbookSelected !==null && <BottomInput addMessageToChat={addMessageToChat} inputText={inputFieldText} setInputFieldText={setInputFieldText}/>}
    </div>
  </div>
  );
}

export default App;
