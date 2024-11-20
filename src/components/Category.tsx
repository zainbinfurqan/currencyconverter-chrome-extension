 const Category = ({selectTranslateCategory, text, type}: any) => {
 
    return <div onClick={()=>selectTranslateCategory(type)} className='w-full text-center self-center border border-gray-100 p-5 py-10 m-2 rounded-xl shadow-md cursor-pointer'>
    <p className='font-["Outfit"] text-black'>{text}</p>
  </div>
}

export default Category