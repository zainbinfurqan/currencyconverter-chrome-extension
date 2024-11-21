// import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useEffect, useRef, useState } from 'react';
import { ReactSVG } from "react-svg";
import { RxCross1 } from "react-icons/rx";

import { BottomInput } from './components/ButtomInput';
import { BottomFileSelector } from './components/BottomFileSelector';
import ChatMessage from './components/ChatMessage';
import Category from './components/Category';
import Reset from './components/Reset';
import ReactGA from 'react-ga4';  // Import react-ga4

function App() {

  const [userChat, setUserChat] = useState<any>([])
  const [translateVia, setTranslateVia] = useState<any>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<any>('')
  const [text, setText] = useState<any>('');
  const [isLoadingChat, setIslLoadingChat] = useState<any>(false)
  const [file, setFile] = useState<any>(null);
  const messagesEndRef = useRef<any>(null);

  const [step, setStep] = useState<any>(0);
  const [chatInActive, setChatInActive] = useState<any>(true);
  const [currentId, setCurrentId] = useState<any>(0);

  const handleFileChange = async (e:any) => {
      if (e && e.target.files && e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1] == 'mp3' && e.target.files[0].size <= 1048576) {
      setFile(e.target.files);
      uploadVideos(e.target.files)
  }
  };

  useEffect(() => {
    // Initialize Google Analytics
    // ReactGA.initialize('G-7DGEWVXQE8');
    
    // Optionally track page view when the extension is opened
    ReactGA.send('pageview');
  }, []);

  const uploadVideos =  async(files:any) => {
    const formData = new FormData();
    
    formData.append("file", files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET as string);

    const cloudinaryResponse  = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_USERNAME}/video/upload`,{
      method: "POST",
      body: formData,
    })
    const response = await cloudinaryResponse.json()
    handleTranslateThroughFile(files[0].name, response.secure_url)
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
    }
  }, [userChat]);

  useEffect(()=>{
    if(isLoadingChat){
      const newChat = [...userChat,{hasLoading:true, user:'other',message:'Processing...'}]
      setUserChat(newChat)
    }
    if(!isLoadingChat){
      const newChat = userChat.filter((item:any) => !item.hasLoading);
      setUserChat(newChat)
    }
  },[isLoadingChat])

  const handleTranslateThroughFile = async (fileName:any,url:any) => {
    if(step === 1){
      setUploadedVideoUrl(url)
      setUserChat((previous:any)=>[...previous,{ id:currentId+1, user:'you',message:text},{user:'other',message:`in which language you want to translate file ${fileName}`, inputFlag:'true'}])
      setCurrentId(currentId+1)
       setStep(step+1)
    }
  }

  const inputToAI = async () => {
    setUserChat((previous:any)=>[...previous,{ id:currentId+1, user:'you', message:text },{ user:'other', message:'in which language you want to translate', inputFlag:'true' }])
    setText('')
    setCurrentId(currentId+1)
    setStep(step+1)
  }

  const getTranslationFromAI = async (item:any,index:any) =>  {
    setIslLoadingChat(true)
    let newChat:any = []
    if(translateVia === 'file') {
        try {
          const response = await fetch(`https://language-translator-server.netlify.app/api/hello?language=${item.language}&url=${uploadedVideoUrl}`) 
       console.log("response",response)
          const response_ = await response.json()
       console.log("response_",response_)
        newChat = [...userChat,{user:'other',message:response_}]
        userChat[index].inputFlag = false
      }catch(error){
        console.log(error)
      }
    }
       else{
        try {
          const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_KEY as string);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `convert this text ${userChat.filter((item:any)=>item?.id && item.id === currentId)[0].message} to ${item.language} language `;
          const result = await model.generateContent(prompt);
          newChat = [...userChat,{user:'other',message:result.response.text()}]
          userChat[index].inputFlag = false
       setStep(step+1)
        } catch (error:any) {
          console.log("error",error.message)
          // newChat = [...userChat,{user:'other',message:error}]
        }
      }
      setUserChat(newChat)
      setChatInActive(!chatInActive)
      setIslLoadingChat(false)
  }

  const selectTranslateCategory = async (category:any) => {
    setTranslateVia(category)
    setChatInActive(!chatInActive)
    setStep(0)
  }
  

  return (
    <div className="App flex  h-screen w-full"> 
    <div className="w-[100%] h-[100%] bg-white border border-gray-100 rounded-lg shadow dark:bg-gray-800 dark:border-gray-100 mt-4">
      <div className='h-[80%] overflow-scroll flex flex-col'>
        <div className='w-fit'>
          {translateVia != null && <p onClick={()=>{
            setUserChat([])
            // setChatInActive(false)
            setTranslateVia(null)}
          } className='font-["Outfit"] p-1 px-3h-fit m-2 cursor-pointer rounded-lg'>
            <RxCross1 size={'1.3rem'} className='mr-1' color='black'/>
          </p>}
        </div>
      {translateVia === null && 
        <div className='flex w-full h-full'>
          <Category selectTranslateCategory={selectTranslateCategory} text='Translate via text' type='text' />
          {/* <Category selectTranslateCategory={selectTranslateCategory} text='Translate via audio file' type='file' /> */}
        </div>
        }
      
        <div className=' flex-row overflow-scroll py-10 ' ref={messagesEndRef}>
          {userChat.map((item:any,index:any)=>{
            return(
              <ChatMessage item={item} userChat={userChat} setUserChat={setUserChat} getTranslationFromAI={getTranslationFromAI} index={index}/>)
          })}
          <div ref={messagesEndRef}></div>
          {console.log(chatInActive,translateVia,step)}
          {step>1 && userChat.length >0 && <Reset chatInActive={chatInActive} setChatInActive={setChatInActive} setFile={setFile} setStep={setStep} />}
        </div>
      </div>

      {translateVia != null && 
      <div className='h-[12%] content-center'>
        {translateVia === 'file' && 
          <BottomFileSelector handleFileChange={handleFileChange} step={step} file={file}/>}
        {translateVia === 'text' && 
          <BottomInput inputText={setText} inputToAI={inputToAI} step={step} text={text}/>}
      </div>}
    </div>
  </div>
  );
}

export default App;
