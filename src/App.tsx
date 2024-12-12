import './App.css';
import Finance from './assets/finance.png';
import AI from './assets/AI.png';
import Ecommerce from './assets/E-Commerce.png';
import ContentReader from './assets/ContentReader.png';
import CurrencyConverter from './assets/CurrencyConverter.png';
import SaveIt from './assets/SaveIt.png';
import LanguageTranslator from './assets/languageTranslator.png';
import ReactTooltip from 'react-tooltip';

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
              <img alt='' height={30} width={30} src={AI} />
            </div>
            <p className='text-black text-lg self-center'>AI</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank"  rel="noreferrer" href='https://chromewebstore.google.com/detail/content-reader/mcapgbonkmlfkkfbofiodakkiibfhhne'>
              <div className='shadow-md p-4 mr-2 h-40 flex flex-col w-36'>
                <ReactTooltip/>
                <img alt='' height={75} width={75} src={ContentReader} className='self-center mb-2' />
                <p data-tip="Ask your query to AI from specific E-books" className='text-black text-xs'>Content Reader</p>
              </div>
            </a>
            <a target="_blank"  rel="noreferrer" href='https://chromewebstore.google.com/detail/language-translator/cccbggfgjgfihkneaigmjlbmppngecjn'>
              <div className='shadow-md p-4 w-36 h-40 flex flex-col'>
                <ReactTooltip/>
                <img alt=''height={75} width={75} src={LanguageTranslator} className='self-center mb-2' />
                <p data-tip="Translate your text from any language to any other language"  className='text-black text-xs'>Language Translator</p>
              </div>
            </a>
          </div>
        </div>

        <div className='py-9'>
          <div className='flex self-center p-2'>
            <div>
              <img alt='' height={30} width={30} src={Finance} />
            </div>
            <p className='text-black text-lg self-center'>Finance</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank" rel="noreferrer" href='https://chromewebstore.google.com/detail/currency-converter-extens/dmclabfilpimdfkififkfndpgfkffbkm'>
              <div className='shadow-md p-4 w-36 h-40 flex flex-col'>
                <img alt='' height={75} width={75} src={CurrencyConverter} className='self-center mb-2'/>
                <p data-for="main" data-iscapture="true" data-tip="Convert currency to all other in single click and  <br/> also get converted in some famous bitcoins"  className='text-black text-xs'>Currency Converter Crypto/Normal</p>
                <ReactTooltip id="main" multiline={true}/>
              </div>
            </a>
          </div>
        </div>

        <div className='py-9'>
          <div className='flex self-center p-2'>
            <div>
              <img alt=''height={30} width={30} src={Ecommerce} />
            </div>
            <p className='text-black text-lg self-center'>E-commerce</p>
          </div>
          <div className='flex flex-wrap m-2'>
            <a target="_blank"  rel="noreferrer" href='https://chromewebstore.google.com/detail/bookmark-your-favorites/mokpojcmdpjdgnfcgplidpmpanmloaoc'>
            <div className='shadow-md p-4 w-36 h-40 flex flex-col'>
                <ReactTooltip/>
              <img alt='' height={75} width={75} src={SaveIt} className='self-center mb-2' />
                <p data-tip="Save your favorite shopify store/product as wishlist"  className='text-black text-xs'>Save your favorite item</p>
            </div>
            </a>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default App;
