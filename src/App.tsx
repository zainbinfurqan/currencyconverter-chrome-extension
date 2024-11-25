import './App.css';
import { useEffect, useState } from 'react';
import { Audio } from 'react-loader-spinner';
import ReactGA from 'react-ga4'; // Import react-ga4
import List from './components/List';
import { ConvertButton } from './components/ConvertButton';
import { FilterButton } from './components/FilterButton';
import { SearchInput } from './components/SearchInlut';
import { SelectCurrencyModal } from './components/SelectCurrencyModal';

const TRACKING_ID = 'G-2Q2P0KWDK4'; // Replace with your GA4 Tracking ID

function App() {
  const [currencyCode, setCurrencyCode] = useState<any>('');
  const [isLoading, setIsLoading] = useState<any>(false);
  const [amount, setAmount] = useState<any>('');
  const [amount_, setAmount_] = useState<any>({
    current:'',
    previous:'',
    forNormalCurrency:false,
    forCryptoCurrency:false
  });
  const [conversionToAllCurrency, setConversionToAllCurrency] = useState<any>({});
  const [currencyToCountryCode, setCurrencyToCountryCode] = useState<any>({});
  const [defaultSelectedCurrency, setDefaultSelectedCurrency] = useState<any>({
    current: 'USD',
    previous: '',
  });
  const [isCurrencyCodeDropDownVisible, setIsCurrencyCodeDropDownVisible] = useState<any>(false);
  const [filteredCurrencyConvertedList, setFilteredCurrencyConvertedList] = useState<any>({});
  const [cryptoCurrencyConvertList, setCryptoCurrencyConvertList] = useState<any>({});
  const [selectedCountryCodeForCrypto, setSelectedCountryCodeForCrypto] = useState<any>({
    current: '',
    previous: ''
  });
  const [selectedCryptoError, setSelectedCryptoError] = useState<any>({
    error: false,
    message: ''
  })
  const [selectedCoinList, setSelectedCoinList] = useState<any>('normal');
  const [error, setError] = useState<any>({
    amount: null,
    currencyCode: null,
  });
  const [isFilter, setIsFilter] = useState<any>(false);
  const [showTooleTip, setShowTooleTip] = useState<any>({
    index: null,
    content: '',
  });
  const [isModalOpenForCrypto, setIsModalOpenForCrypto] = useState<any>(false);
  const [readyToFetch, setReadyToFetch] = useState<any>(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID)
    ReactGA.send('pageview');
  }, []);

  const getAllCoins = async (item:any) => {
    try {
      if (error.amount == null && selectedCountryCodeForCrypto.current !== item) {
        setIsLoading(true);
        const cryptoArray = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'LTC', 'DOT', 'LINK'];
        const currencies = defaultSelectedCurrency; // You can add more currencies if needed
        const fsyms = cryptoArray.join(',');

        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${item}&api_key=${process.env.REACT_APP_CRYPTO_EXCHANGE_API_KEY}`);
        const res = await  response.json();
        const conversions = {};
        if(res.Response == 'Error') {
          setSelectedCryptoError({error:true,message:'Can`t be converted at the moment'})
          const message  = res.Message.split(/\(([^)]+)\)/)
          const matches = message.filter((_, index) => index % 2 === 1).map(part => part.trim());
        setIsLoading(false);
      }else{
          cryptoArray.forEach(coin => {
            const price = res[coin]?.[item]; // Get the price in USD
            if (price) {
              conversions[coin] = (amount_.current / price).toFixed(6); // Convert USD to cryptocurrency amount
            }
          });
          setSelectedCryptoError({error:false, message:''})
        setIsLoading(false);
      }
        setCryptoCurrencyConvertList(conversions)
        setAmount_({
          ...amount_,
          current:amount_.current,
          previous:amount_.current,
          forNormalCurrency: true,
          forCryptoCurrency: true
        })
        setSelectedCountryCodeForCrypto({
          current: item,
          previous: selectedCountryCodeForCrypto.current
        })
        setIsModalOpenForCrypto(!isModalOpenForCrypto)
      } else {
        setIsModalOpenForCrypto(!isModalOpenForCrypto)
    }
    } catch (error) {
     console.log(error) 
    }

  }

  const checkValidCurrencyInputField = (value: any) => {
    if (/^[1-9][0-9]*(\.[0-9]+)?$/.test(value)) {
    setAmount_({
      current:value,
      previous:''
    })
    } else {
    setAmount_({
      current:value,
      previous:''
    })
  }
  };

  const checkValidFilterInputField = (value: any) => {
    if (/^([A-Z]{3})(,([A-Z]{3}))*$/.test(value)) {
      setCurrencyCode(value);
      setError({ amount: null, currencyCode: null });
    } else {
      setCurrencyCode(value);
      setError({
        amount: null,
        currencyCode: 'Please enter valid currency code',
      });
    }
  };

  const convertCurrency = async (item: any) => {
    try {
      if (error.amount == null && amount_.current !== '' && /^[1-9][0-9]*(\.[0-9]+)?$/.test(amount_.current)
      //  && amount_.current !== amount_.previous && defaultSelectedCurrency.current != defaultSelectedCurrency.previous
      ) {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_EXCHANGE_BASE_URL}${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/${item}`);
        const res = await response.json();
        const response_ = await fetch(process.env.REACT_APP_FLAG_IMAGES_URL || '');
        const countries = await response_.json();
        let currencyToCountryCode: any = {};

        countries.forEach((country: any) => {
          const currencies = country.currencies;
          if (currencies) {
            for (const [code, currency] of Object.entries(currencies)) {
              currencyToCountryCode[code] = {
                code: country.cca2.toLowerCase(),
                fullName: country.name.common,
              }; // cca2 is the country code
            }
          }
        });
        setCurrencyToCountryCode(currencyToCountryCode);
        setFilteredCurrencyConvertedList(currencyToCountryCode);
        const conversionToAllCurrency: any = {};
        Object.keys(res?.conversion_rates).map((item: any) => {
          conversionToAllCurrency[item] = res?.conversion_rates[item] * amount_.current;
        });
        setConversionToAllCurrency(conversionToAllCurrency);
        setError({ amount: null, currencyCode: null });
        // await getAllCoins(item)
        setAmount_({
          ...amount_,
          current:amount_.current,
          previous:amount_.current,
          forNormalCurrency: true
        })
        setCurrencyCode('')
        setIsFilter(false)
        // setSelectedCountryCodeForCrypto({
        //   current: item,
        //   previous: selectedCountryCodeForCrypto.current
        // })
      } else {
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const filter = () => {
    if (/^([A-Z]{3})(,([A-Z]{3}))*$/.test(currencyCode)) {
      setError({ amount: null, currencyCode: null });
      setIsLoading(true);
      const userSelectedCurrencyCode = currencyCode.split(',');
      const filteredCurrencyConvertedList: any = {};
      userSelectedCurrencyCode.map((item: any) => {
        filteredCurrencyConvertedList[item.toUpperCase()] = conversionToAllCurrency[item.toUpperCase()];
      });
      setFilteredCurrencyConvertedList(filteredCurrencyConvertedList);
      setIsFilter(true);
      setIsLoading(false);
    } else {
    }
  };
  return (
    <div className="App font-Outfit">
      {isLoading && (
        <div className="loader">
          <Audio height="80" width="80" color="#2463EB" ariaLabel="loading" />
        </div>
      )}
      <div className="p-4">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-row max-[425px]:flex-col ">
            <SearchInput
              amount={amount_.current}
              checkValidCurrencyInputField={checkValidCurrencyInputField}
              convertCurrency={convertCurrency}
              defaultSelectedCurrency={defaultSelectedCurrency.current}
            />
            {Object.keys(conversionToAllCurrency).length > 0 && (
              <ConvertButton setIsCurrencyCodeDropDownVisible={setIsCurrencyCodeDropDownVisible} isCurrencyCodeDropDownVisible={isCurrencyCodeDropDownVisible} />
            )}
          </div>
          {error.amount != null && <p className="text-red-500 text-xs text-left">{error.amount}</p>}
        </div>
        {Object.keys(conversionToAllCurrency).length > 0 && (
          <FilterButton currencyCode={currencyCode} checkValidFilterInputField={checkValidFilterInputField} filter={filter} error={error} />
        )}
      </div>
      {<div className="flex flex-wrap overflow-scroll h-[77vh]">
        {Object.keys(conversionToAllCurrency).length > 0 && currencyToCountryCode &&
          Object.keys(isFilter ? filteredCurrencyConvertedList : conversionToAllCurrency).map((item, key) => {
            return (
              currencyToCountryCode[item] !== undefined && (
                <List
                  key={key}
                  getAllCoins={getAllCoins}
                  code={item}
                  amount={conversionToAllCurrency[item]}
                  isAvailable={conversionToAllCurrency[item]}
                  imageCode={currencyToCountryCode[item].code}
                />
              )
            );
          })}
      </div>}
      <div
        tabIndex={-1}
        aria-hidden="true"
        className={`${isModalOpenForCrypto ? 'display' : 'hidden'}  scroll overflow-x-hidden backdrop-blur-sm bg-white/30 bg-transparent fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full m-auto bg-white top-[30%]">
          <div className='flex flex-row justify-around'>

          <p className="font-bold mx-2 text-black">Crypto Coins</p>
        <button
          onClick={() => {
            // setCryptoCurrencyConvertList({})
            setIsModalOpenForCrypto(!isModalOpenForCrypto)
            // setSelectedCryptoError({error:false,message:''})
          }}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
          </div>
          <div className='flex flex-wrap row text-black'>
            {selectedCryptoError.error && <p className="m-0  w-fit cursor-pointer px-2 self-center py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{selectedCryptoError.message}</p>}
          {Object.keys(cryptoCurrencyConvertList).map((item, key) => {
              return (
                <List
                  key={key}
                  getAllCoins={Object.keys(conversionToAllCurrency).length > 0 ? getAllCoins : null}
                  code={item}
                  amount={cryptoCurrencyConvertList[item]}
                  isAvailable={cryptoCurrencyConvertList[item]}
                  imageCode={undefined}
                />
              )
            })}
          </div>
        </div>
      </div>
      <div
        tabIndex={-1}
        aria-hidden="true"
        className={`${isCurrencyCodeDropDownVisible ? 'display' : 'hidden'}  scroll overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full m-auto">
          <SelectCurrencyModal
            setIsCurrencyCodeDropDownVisible={setIsCurrencyCodeDropDownVisible}
            isCurrencyCodeDropDownVisible={isCurrencyCodeDropDownVisible}
            conversionToAllCurrency={conversionToAllCurrency}
            setDefaultSelectedCurrency={setDefaultSelectedCurrency}
            defaultSelectedCurrency={defaultSelectedCurrency}
            convertCurrency={convertCurrency}
            setCurrencyCode={setCurrencyCode}
            setShowTooleTip={setShowTooleTip}
            currencyToCountryCode={currencyToCountryCode}
            showTooleTip={showTooleTip}
            // setSelectedCoinList={setSelectedCoinList}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
