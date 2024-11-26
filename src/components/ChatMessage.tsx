import { SiConvertio } from "react-icons/si";

const ChatMessage = ({item, index, messagesEndRef }: any) => {
  return (
      <div className={`flex ${item.user=== 'human' && 'justify-end'} ${item.user==='ai' && 'justify-start'}`}>
        <div className='border rounded-full m-2 flex row animate-[tada_1s_ease-in-out]'>
          <p className={`font-["Outfit"] text-xs px-4 w-fit m-2 rounded-full text-black`}>{item.message}</p>
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    );
}

export default ChatMessage;