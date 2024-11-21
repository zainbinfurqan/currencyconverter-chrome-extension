import { SiConvertio } from "react-icons/si";


export const BottomInput = ({inputText, inputToAI, step, text}: any) => {
    console.log("step",step)
    return <div className="relative flex px-2 justify-evenly">
    <div className='w-[85%]'>
      <textarea aria-required={true} disabled={ step > 0 ? true : false }  placeholder='Enter text here...' onChange={(e)=>inputText(e.target.value)} value={text} typeof="search" id="default-search" className="w-full block p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
    </div>
    {step ==0 &&<div onClick={inputToAI} className='w-[10%] cursor-pointer justify-items-center self-center px-2  py-2.5 rounded-full'>
      <SiConvertio size='1.3rem' className='' color='#000'/>         
    </div>}
  </div>

}