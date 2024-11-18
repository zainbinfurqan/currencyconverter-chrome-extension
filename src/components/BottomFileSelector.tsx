import { TiAttachmentOutline } from "react-icons/ti";


export const BottomFileSelector = ({handleFileChange, step, file}: any) => {
    return <div className='h-[40%] py-1 px-2 content-center flex justify-end cursor-pointer'>
    <div className='p-1 px-2 w-fit rounded-full flex self-center cursor-pointer'>
    <input disabled={ step == 1 ? false: true } id="file" type="file" value={file? file.name: ''} onChange={(e)=>handleFileChange(e)} className='cursor-pointerfont-["Outfit"] -mx-5 opacity-0 relative w-5 z-10' />
      <TiAttachmentOutline size={'1.3rem'} className='' color='#000'/>
  </div>
  </div>

}