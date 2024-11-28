import { SiConvertio } from "react-icons/si";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({item, index, messagesEndRef }: any) => {
  console.log("item",item)
  return (
      <div className={`flex w-full ${item.user=== 'human' && 'float-right'} ${item.user==='ai' && 'float-end'}`}>
        <div className={`w-[90%] m-2 flex row animate-[tada_1s_ease-in-out] ${item.user=== 'human' && 'justify-end'} ${item.user==='ai' && 'justify-start'}`}>
          {item.message != '' && item.user==='human' && <p className={`font-["Outfit"] border text-xs p-2 w-fit m-2 rounded-md text-black`}>{item.message}</p>}
          {item?.isProcessing && <p className="text-black">processing....</p>}
          {item.message != '' && item.user==='ai' && 
            <div className="flex flex-col w-full text-black">
              <ReactMarkdown children={item.message}
                 components={{
                   // Custom renderer for code blocks
                   code({ node, inline, className, children, ...props }: any) {
                     if (inline) {
                       // Inline code block: `<code>code</code>`
                       return <code {...props} className={className}>{children}</code>;
                     }
                     // Multiline code block (with syntax highlighting)
                     const language = className ? className.replace('language-', '') : 'javascript';
                     return (
                       <SyntaxHighlighter style={solarizedlight} language={language} {...props}>
                         {String(children).replace(/\n$/, '')}
                       </SyntaxHighlighter>
                     );
                   },
                 }}
              />
            </div>}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    );
}

export default ChatMessage;