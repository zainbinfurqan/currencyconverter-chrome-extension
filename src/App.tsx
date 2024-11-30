import { useEffect, useRef, useState } from 'react';
import { RxCross1 } from "react-icons/rx";
import { FaBook } from "react-icons/fa";

import { BottomInput } from './components/ButtomInput';
import ChatMessage from './components/ChatMessage';
// import ReactGA from 'react-ga4';  // Import react-ga4
import { io, Socket} from 'socket.io-client';
import { LocalStorageFn } from './localStorage/localStorageFn';
// const socket: Socket = io('http://localhost:3001/',{
  const socket: Socket = io('https://ai-content-reader-5740f739981e.herokuapp.com/',{
  transports: ['polling', 'websocket']  // Make sure both transports are supported
});

const eBooksList = [
  {id:'2344214324342', name:'React js'},
  {id:'2346673745632', name:'Angular js'},
  {id:'5462424778565', name:'Vue js'},
  {id:'5677676352345', name:'Software Architecture'},
]

function App() {

  const messagesEndRef = useRef<any>(null);
  const [isEbookSelected, setIsEbookSelected] = useState<any>(null);
  const [inputFieldText, setInputFieldText] = useState<any>('');
  const [chat, setChat] = useState <any>([])
  const [islanguageSelectDropDownOpen, setIslanguageSelectDropDownOpen] = useState<any>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null)
  const [isAIProcessing, setIsAIProcessing] = useState<any>(false)
  const [aiId, setAiId] = useState<any>(0)
  const [count,setCount] = useState<any>(0)

  useEffect(()=>{
    const localStorage =  LocalStorageFn.getItem('92332')
    if(chat.length > 0 && aiId != 0 && localStorage != undefined) {
      let newChat: any = localStorage
      let messageObj = ''
      socket.on('answer-by-ai-model',(data: any)=>{
        if(!data.isError){
          if(!data.isEnd) {
            messageObj = messageObj + data.data
          }
          if(data.isEnd) {
            const aiChatMessageIndex = newChat.findIndex((item:any)=>item.id ==  aiId)
            newChat[aiChatMessageIndex].isProcessing = false
            newChat[aiChatMessageIndex].message = messageObj
            setChat(newChat)
          }
        } 
        if(data.isError){
          const aiChatMessageIndex = newChat.findIndex((item:any)=>item.id ==  aiId)
          newChat[aiChatMessageIndex].isProcessing = false
          newChat[aiChatMessageIndex].message = 'something went wrong can you please try again.!'
          setChat(newChat)
        }
      })
  }
  },[chat,aiId,count])

  const addMessageToChat = () => {
    const aiId = Math.floor(Math.random() * 10000000)
    setAiId(aiId)
    const humanMessageObj = {
      id: Math.floor(Math.random() * 10000000),
      user:'human',
      message:inputFieldText
    }
    const aiMessageObj = {
      id:aiId,
      user: 'ai',
      message:'',
      isProcessing: true
    }
    const newChat = [...chat, humanMessageObj, aiMessageObj]
    setChat(newChat)
    setInputFieldText('')
    socket.emit('ask-ai-model',{
      bookId : isEbookSelected.id,
      query: inputFieldText,
      language:selectedLanguage
    })
    LocalStorageFn.setItem('92332',newChat)
  }

  // useEffect(() => {
    // Initialize Google Analytics
    // ReactGA.initialize('G-7DGEWVXQE8');
    // Optionally track page view when the extension is opened
  //   ReactGA.send('pageview');
  // }, []);

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
            {/* <button id="dropdownDefaultButton" onClick={()=>setIslanguageSelectDropDownOpen(!islanguageSelectDropDownOpen)} data-dropdown-toggle="dropdown" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">{selectedLanguage != null ? selectedLanguage  : 'Languages'}
              <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
            </button> */}
            {/* <div id="dropdown" className={`z-10 w-32 ${islanguageSelectDropDownOpen ? 'block' : 'hidden'} absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
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
            </div> */}
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
