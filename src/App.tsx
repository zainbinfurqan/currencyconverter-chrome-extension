import './App.css';
// import { useEffect, useState } from 'react';
// import JSONPretty from 'react-json-pretty';
// import 'react-json-pretty/themes/monikai.css';
// import { JSONTree } from 'react-json-tree';
import ReactJson from 'react-json-view'

function App() {
  // const data_ = {}

  // const [data, setData] = useState<any>({});
  // const [data_, setData_] = useState<any>({});
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [key, setKey] = useState('');
  // const [value, setValue] = useState('');
  // const [isvValueObject, setIsvValueObject] = useState(false)
  // const [isvValueString, setIsvValueString] = useState(false)
  // const [isvValueNumber, setIsvValueNumber] = useState(false)
  // const [nestedKey, setNestedKey] = useState('')

  // const AddField = () => {
  //     const newData = {...data};
  //     if(nestedKey !== ''){
  //     if(isvValueObject){
  //       newData[nestedKey] = {...newData[nestedKey], [key]: JSON.parse('{}')};
  //     }
  //     if(isvValueNumber && /^\d+(\.\d+)?$/.test(value)) {
  //       newData[nestedKey] =  {...newData[nestedKey], [key]: Number(value)};
  //     }
  //     if(isvValueString) {
  //       newData[nestedKey] = {...newData[nestedKey], [key]:value};
  //     }
  //   } else {
  //       if(isvValueObject){
  //         newData[key] = JSON.parse('{}');
  //       }
  //       if(isvValueNumber && /^\d+(\.\d+)?$/.test(value)) {
  //         newData[key] = Number(value);
  //       }
  //       if(isvValueString) {
  //         newData[key] = value;
  //       }
  //     }
  //       setIsvValueNumber(false)
  //       setIsvValueString(false)
  //       setIsvValueObject(false)
  //       setValue('')
  //       setKey('')
  //       setData(newData)
  //       setIsModalOpen(!isModalOpen)
  //       setNestedKey('')
  // }

  // const onAdd = (data) => {
    // console.log("data",data)
    // setNestedKey(data)
    // setIsModalOpen(!isModalOpen)
  //   setKey(Object.keys(data.new_value)[0])
  //  setIsModalOpen(!isModalOpen)
  //   return false
  // }

  // const RenderNestedObject = ({item, index}) => {
  //   {console.log("data[item] typeof data[item] === 'object'",typeof data[item] === 'object')}
  //   {console.log("data[item] data[item] !== null",data[item] !== null)}
  //   {console.log("data[item] !Array.isArray(data[item])",!Array.isArray(data[item]))}
  //   return <div key={index} className='flex flex-row'>
  //     <p className='text-black'>{item}&nbsp;:&nbsp;</p> 
     
  //     {typeof data[item] === 'object' && data[item] !== null && !Array.isArray(data[item]) 
  //       && (
  //         <>
  //           <p className='text-black text-lg self-center cursor-pointer' onClick={()=>onAdd(item)}>+</p>
  //         </>
  //       ) 
  //     }
  //     {typeof data[item] === 'object' && data[item] !== null && !Array.isArray(data[item]) && Object.keys(data[item]).map((item_,index_)=>{
  //       return <RenderNestedObject item={item_} index={index_} />
  //     })}
  //   </div>
    
  // }
   
    const enableClipboardForRoot = (node) => {
      // Root object will have no `name` or an empty `name`
      return node && node.name === undefined;
    };

  return (
    <div className="App font-Outfit px-2">
      <div>
       <p className='text-black text-md text-center py-4'>Create JSON Object</p>
      </div>
      {/* {Object.keys(data).keys.length == 0 && <div onClick={()=>setIsModalOpen(!isModalOpen)} className="text-black text-center">Add Field</div>} */}
    {/*  */}
    {/* <div id="default-modal" tabIndex={-1} aria-hidden="true" className={`${isModalOpen ? 'display' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
      <div className="relative p-4 w-full ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className='flex flex-row p-2'>
              <button onClick={()=>setIsModalOpen(!isModalOpen)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
              </button>
            </div>
              <div className='p-2 flex flex-row justify-start'>
                <div className='w-11/12 flex flex-row'>
                <div className='text-left mr-4 '>
                  <p className='text-black py-2'>Key</p>
                  <input value={key} onChange={(e)=>setKey(e.target.value)} className='border text-black p-2' />
                </div>
                <div className='text-left'>
                  <p className='text-black py-2'>Value</p>
                  <input value={value} onChange={(e)=>setValue(e.target.value)} disabled={isvValueObject} className='border text-black  p-2' />
                  <div className='flex flex-row py-2'>
                    <div className='flex flex-row py-2 mr-2'>
                      <input type='checkbox' disabled={isvValueString || isvValueNumber} checked={isvValueObject} onChange={()=>setIsvValueObject(!isvValueObject)}/>
                      <p className='text-black text-xs ml-2'>Object</p>
                    </div>
                    <div className='flex flex-row py-2 mr-2'>
                      <input type='checkbox' disabled={isvValueObject || isvValueNumber} checked={isvValueString} onChange={()=>setIsvValueString(!isvValueString)}/>
                      <p className='text-black text-xs ml-2'>String</p>
                    </div>
                    <div className='flex flex-row py-2'>
                      <input type='checkbox' disabled={isvValueObject || isvValueString} checked={isvValueNumber} onChange={()=>setIsvValueNumber(!isvValueNumber)}/>
                      <p className='text-black text-xs ml-2'>Number</p>
                    </div>
                  </div>
                </div>
                </div>
                <div className={`w-1/12 self-center ${isvValueNumber || isvValueObject || isvValueString && key && value ? 'display' : 'hidden'}`}>
                  <p onClick={AddField} className='text-black text-lg cursor-pointer'>+</p>
                </div>
              </div>
          </div>
      </div>
    </div> */}
    {/*  */}

      <div>
        {/* {Object.keys(data).length > 0 &&
          <div>
            {Object.keys(data).map((item,index)=>{
              return(
                <RenderNestedObject item={item} index={index} />
              )
            })}
          </div>
        } */}
        <ReactJson
         style={{textAlign:'start'}} 
          src={{}}       // Bind the state here
          onAdd={()=>true}        // Update state when a new key is added
          onEdit={()=>true}      // Update state when a key is edited
          onDelete={()=>true}  // Update state when a key is deleted
          enableClipboard={enableClipboardForRoot}
        />
      </div>

    </div>
  );
}

export default App;
