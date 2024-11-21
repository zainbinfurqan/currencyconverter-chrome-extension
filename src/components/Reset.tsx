const Reset = ({setChatInActive, setFile, setStep, chatInActive}: any) => {
return <p onClick={()=>{
    setChatInActive(!chatInActive)
    setFile(null)
    setStep(0)}} 
    className='text-black font-["Outfit"] justify-self-center text-xs cursor-pointer text-center px-4 p-2 border border-gray-100 w-fit rounded-full'>want to translate more?</p>
}

export default Reset