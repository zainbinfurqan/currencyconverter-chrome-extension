import './App.css';
import Finance from './assets/finance.png';
import AI from './assets/AI.png';
import Ecommerce from './assets/E-Commerce.png';
import ContentReader from './assets/ContentReader.png';
import CurrencyConverter from './assets/CurrencyConverter.png';
import SaveIt from './assets/SaveIt.png';
import LanguageTranslator from './assets/languageTranslator.png';

function App() {
 
  return (
    <div className="App font-Outfit ">

      <div className='py-3 bg-black px-4'>
        <p className='text-white text-2xl text-left'>Chrome Extensions by Zain Ahmed</p>
      </div>
      <div className='px-32 py-14'>
        <div className='py-9'>
          <div className='flex self-center p-2'>
            <div>
              <img alt='' rel="noreferrer" height={30} width={30} src={AI} />
            </div>
            <p className='text-black text-lg self-center'>AI</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank" href='https://chromewebstore.google.com/detail/content-reader/mcapgbonkmlfkkfbofiodakkiibfhhne'>
              <div className='shadow-md p-4 w-fit mr-2'>
                <img alt='' rel="noreferrer" height={60} width={60} src={ContentReader} />
              </div>
            </a>
            <a target="_blank" href='https://chromewebstore.google.com/detail/language-translator/cccbggfgjgfihkneaigmjlbmppngecjn'>
              <div className='shadow-md p-4 w-fit'>
                <img alt='' rel="noreferrer" height={60} width={60} src={LanguageTranslator} />
              </div>
            </a>
          </div>
        </div>

        <div className='py-9'>
          <div className='flex self-center p-2'>
            <div>
              <img alt='' rel="noreferrer" height={30} width={30} src={Finance} />
            </div>
            <p className='text-black text-lg self-center'>Finance</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank" href='https://chromewebstore.google.com/detail/currency-converter-extens/dmclabfilpimdfkififkfndpgfkffbkm'>
              <div className='shadow-md p-4 w-fit'>
                <img alt='' rel="noreferrer" height={60} width={60} src={CurrencyConverter} />
              </div>
            </a>
          </div>
        </div>

        <div className='py-9'>
          <div className='flex self-center p-2'>
            <div>
              <img alt='' rel="noreferrer" height={30} width={30} src={Ecommerce} />
            </div>
            <p className='text-black text-lg self-center'>E-commerce</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank" href='https://chromewebstore.google.com/detail/bookmark-your-favorites/mokpojcmdpjdgnfcgplidpmpanmloaoc'>
            <div className='shadow-md p-4 w-fit'>
              <img alt='' rel="noreferrer" height={60} width={60} src={SaveIt} />
            </div>
            </a>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default App;
