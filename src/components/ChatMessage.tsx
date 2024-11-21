import { SiConvertio } from "react-icons/si";

const ChatMessage = ({item,userChat,setUserChat,getTranslationFromAI,index }: any) => {
  console.log(userChat[index].language)
  return (
        <div className={`flex ${item.user=== 'you' && 'justify-end'} ${item.user==='other' && 'justify-start'}`}>
                  <div className='flex row animate-[tada_1s_ease-in-out]'>
                  <p className={`font-["Outfit"] p-2 px-4 w-fit m-2 rounded-full text-black`}>{item.message}</p>
                  {item.user=== 'other' && item?.inputFlag && item?.inputFlag && 
                  <div className='flex p-2 w-fit h-fit rounded-xl border border-gray-100  -ml-24 mt-10'>
                    <input type='text' required={true} placeholder='Enter text here' className='text-black font-["Outfit"] border-0 outline-none' value={userChat[index].language} onChange={(e)=>{
                      const newChat = [...userChat]
                      newChat[index].language = e.target.value
                      setUserChat(newChat)
                    }} />
                    <div onClick={userChat[index].language && userChat[index].language !=='' &&  item?.inputFlag && item?.inputFlag ? () => getTranslationFromAI(item,index): () => {}}>
                      <SiConvertio  size={'1.3rem'} className='' color='#000'/> 
                    </div>
                    </div>}
                  </div>
                </div>
    );
}

export default ChatMessage;