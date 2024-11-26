import './App.css';
import { useEffect, useState } from 'react';
import { Audio } from 'react-loader-spinner';
import ReactGA from 'react-ga4'; // Import react-ga4
import List from './components/List';
import { ConvertButton } from './components/ConvertButton';
import { FilterButton } from './components/FilterButton';
import { SearchInput } from './components/SearchInlut';
import { SelectCurrencyModal } from './components/SelectCurrencyModal';
import { localStorageFn } from './functions/local.storage.fn';

const CURRENCYCONVERTEROBJ = {
  amount : 0,
  currencyCode: '',
  cryptoCurrencyCode: '',
  cryptoCurrencyAmount : 0
}
const TRACKING_ID = 'G-2Q2P0KWDK4';
const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'LTC', 'DOT', 'LINK']
const LOCAL_STORAGE_ID = Math.floor(Math.random() * 10000)

function App() {
  const [filterCurrencyCodes, setFilterCurrencyCode] = useState<any>(''); //for filter currency code input
  const [isLoading, setIsLoading] = useState<any>(false); // loading state
  const [amount, setAmount] = useState<any>(''); // amount for currency conversion
  const [conversionToAllCurrencyList, setConversionToAllCurrencyList] = useState<any>({}); // conversion rates for all currency
  const [countryCodeWithNames, setCountryCodeWithNames ] = useState<any>({}); // country code with names
  const [defaultSelectedCurrencyCode, setDefaultSelectedCurrency] = useState<any>('USD'); //default currency code
  const [isCurrencyCodeDropDownVisible, setIsCurrencyCodeDropDownVisible] = useState<any>(false);
  const [filteredCurrencyConvertedList, setFilteredCurrencyConvertedList] = useState<any>({}); // filtered currency list
  const [cryptoCurrencyConvertList, setCryptoCurrencyConvertList] = useState<any>({}); // crypto currency list
  const [selectedCryptoError, setSelectedCryptoError] = useState<any>({
    error: false,
    message: ''
  })
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
  const [readyToFetchCrypto, setReadyToFetchCrypto] = useState<any>(false);

  useEffect(() => {
    localStorageFn.setItem(LOCAL_STORAGE_ID,CURRENCYCONVERTEROBJ)
    ReactGA.initialize(TRACKING_ID)
    ReactGA.send('pageview');
  }, []);

  const getAllCoins = async (item?:any) => {
    try {
      const localStorage = localStorageFn.getItem(LOCAL_STORAGE_ID)
      if(localStorage) {
        setIsLoading(true);
        const fsyms = CRYPTO_CURRENCIES.join(',');

        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsyms}&tsyms=${localStorage.cryptoCurrencyCode}&api_key=${process.env.REACT_APP_CRYPTO_EXCHANGE_API_KEY}`);
        const res = await  response.json();
        const conversions = {};

        if(res.Response == 'Error') {
          setSelectedCryptoError({error:true, message:'Can`t be converted at the moment'})
          const message  = res.Message.split(/\(([^)]+)\)/)
          const matches = message.filter((_, index) => index % 2 === 1).map(part => part.trim());
        setIsLoading(false);
        } else{
          CRYPTO_CURRENCIES.forEach(coin => {
              const price = res[coin]?.[localStorage.cryptoCurrencyCode]; // Get the price in USD
              if (price) {
                conversions[coin] = (localStorage.cryptoCurrencyAmount / price).toFixed(6); // Convert USD to cryptocurrency amount
              }
            });
            setSelectedCryptoError({error:false, message:''})
          setIsLoading(false);
        }

        setCryptoCurrencyConvertList(conversions)
        setIsModalOpenForCrypto(!isModalOpenForCrypto)
      setReadyToFetchCrypto(false)
    } 
      
      else {
        setIsModalOpenForCrypto(!isModalOpenForCrypto)
    }
    } catch (error) {
     console.log(error) 
    }

  }

  const checkValidCurrencyInputField = (value: any) => {
    if (/^[1-9][0-9]*(\.[0-9]+)?$/.test(value)) {
      setAmount(value)
    } else {
      setAmount(value)
  }
  };

  const checkValidFilterInputField = (value: any) => {
    if (/^([A-Z]{3})(,([A-Z]{3}))*$/.test(value)) {
      setFilterCurrencyCode(value);
      resetError()
    } else {
      setFilterCurrencyCode(value);
      setError({
        amount: null,
        currencyCode: 'Please enter valid currency code',
      });
    }
  };
  const resetError = () => {
    setError({ amount: null, currencyCode: null });
  }

  const checkIsAllowToFetch = (item: any) => {
    try {
      let isFetchAllow = false;
      const localStorage = localStorageFn.getItem(LOCAL_STORAGE_ID)
      if(localStorage && error.amount == null && amount !== '' && /^[1-9][0-9]*(\.[0-9]+)?$/.test(amount)){
        isFetchAllow =  localStorage.currencyCode != item || localStorage.amount != amount ? true : false
        localStorageFn.setItem(LOCAL_STORAGE_ID,{
          ...localStorage,
          amount: amount,
          currencyCode: item
        })

        setReadyToFetch(isFetchAllow)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const checkIsAllowToFetchCrypto = (item: any, amount:any) => {
    let isFetchAllowForCrypto = false
    const localStorage = localStorageFn.getItem(LOCAL_STORAGE_ID)
    if(localStorage && error.amount == null && amount !== '' && /^[1-9][0-9]*(\.[0-9]+)?$/.test(amount)){
      isFetchAllowForCrypto = localStorage.cryptoCurrencyCode != item ? true : false
      if(localStorage.cryptoCurrencyCode == item){
        setIsModalOpenForCrypto(!isModalOpenForCrypto)
      }
      localStorageFn.setItem(LOCAL_STORAGE_ID,{
        ...localStorage,
        cryptoCurrencyCode: item,
        cryptoCurrencyAmount: amount
      })

      setReadyToFetchCrypto(isFetchAllowForCrypto)
    }
  }

  useEffect(()=>{
    readyToFetch && convertCurrency()
    readyToFetchCrypto && getAllCoins()
  },[readyToFetch, readyToFetchCrypto])

  const convertCurrency = async (item?: any) => {
    try {
      const localStorage = localStorageFn.getItem(LOCAL_STORAGE_ID)
      if(localStorage) {
        setIsLoading(true);
        const currencyConvertApiResponse = await fetch(`${process.env.REACT_APP_EXCHANGE_BASE_URL}${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/${localStorage.currencyCode}`);
        const res = await currencyConvertApiResponse.json();
        const countriesFlag = await fetch(process.env.REACT_APP_FLAG_IMAGES_URL || '');
        const countries = await countriesFlag.json();
        let convertedCurrencyResponse: any = {};

        countries.forEach((country: any) => {
          const currencies = country.currencies;
          if (currencies) {
            for (const [code, currency] of Object.entries(currencies)) {
              convertedCurrencyResponse[code] = {
                code: country.cca2.toLowerCase(),
                fullName: country.name.common,
              }; // cca2 is the country code
            }
          }
        });
        setCountryCodeWithNames(convertedCurrencyResponse);
        setFilteredCurrencyConvertedList(convertedCurrencyResponse);
        const conversionToAllCurrency: any = {};
        Object.keys(res?.conversion_rates).map((item: any) => {
          conversionToAllCurrency[item] = res?.conversion_rates[item] * amount;
        });
        setConversionToAllCurrencyList(conversionToAllCurrency);
        resetError()
        setFilterCurrencyCode('')
        setIsFilter(false)
        localStorageFn.setItem(LOCAL_STORAGE_ID,{...CURRENCYCONVERTEROBJ, amount: amount, currencyCode: defaultSelectedCurrencyCode})
       
      setReadyToFetch(false)
    }
      else {
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const filter = () => {
    if (/^([A-Z]{3})(,([A-Z]{3}))*$/.test(filterCurrencyCodes)) {
      resetError()
      setIsLoading(true);
      const userSelectedCurrencyCode = filterCurrencyCodes.split(',');
      const filteredCurrencyConvertedList: any = {};
      userSelectedCurrencyCode.map((item: any) => {
        filteredCurrencyConvertedList[item.toUpperCase()] = conversionToAllCurrencyList[item.toUpperCase()];
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
                amount={amount}
                checkValidCurrencyInputField={checkValidCurrencyInputField}
                convertCurrency={checkIsAllowToFetch}
                defaultSelectedCurrencyCode={defaultSelectedCurrencyCode}
              />
            {Object.keys(conversionToAllCurrencyList).length > 0 && (
              <ConvertButton setIsCurrencyCodeDropDownVisible={setIsCurrencyCodeDropDownVisible} isCurrencyCodeDropDownVisible={isCurrencyCodeDropDownVisible} />
            )}
          </div>
          {error.amount != null && <p className="text-red-500 text-xs text-left">{error.amount}</p>}
        </div>
        {Object.keys(conversionToAllCurrencyList).length > 0 && (
          <FilterButton currencyCode={filterCurrencyCodes} checkValidFilterInputField={checkValidFilterInputField} filter={filter} error={error} />
        )}
      </div>
      {<div className="flex flex-wrap overflow-scroll h-[77vh]">
        {Object.keys(conversionToAllCurrencyList).length > 0 && countryCodeWithNames &&
          Object.keys(isFilter ? filteredCurrencyConvertedList : conversionToAllCurrencyList).map((item, key) => {
            return (
              countryCodeWithNames[item] !== undefined && (
                <List
                  key={key}
                  getAllCoins={checkIsAllowToFetchCrypto}
                  code={item}
                  amount={conversionToAllCurrencyList[item]}
                  isAvailable={conversionToAllCurrencyList[item]}
                  imageCode={countryCodeWithNames[item].code}
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
            setIsModalOpenForCrypto(!isModalOpenForCrypto)
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
                  getAllCoins={Object.keys(conversionToAllCurrencyList).length > 0 ? checkIsAllowToFetch : null}
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
            conversionToAllCurrencyList={conversionToAllCurrencyList}
            setDefaultSelectedCurrency={setDefaultSelectedCurrency}
            convertCurrency={checkIsAllowToFetch}
            setCurrencyCode={setFilterCurrencyCode}
            setShowTooleTip={setShowTooleTip}
            countryCodeWithNames={countryCodeWithNames}
            showTooleTip={showTooleTip}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
