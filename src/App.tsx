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
  const [conversionToAllCurrency, setConversionToAllCurrency] = useState<any>({});
  const [currencyToCountryCode, setCurrencyToCountryCode] = useState<any>({});
  const [defaultSelectedCurrency, setDefaultSelectedCurrency] = useState<any>('USD');
  const [showCurrencyDropDown, setShowCurrencyDropDown] = useState<any>(false);
  const [filteredCurrencyConvertedList, setFilteredCurrencyConvertedList] = useState<any>({});
  const [validAmount, setValidAmount] = useState<any>(false);
  const [error, setError] = useState<any>({
    amount: null,
    currencyCode: null,
  });
  const [isFilter, setIsFilter] = useState<any>(false);
  const [showTooleTip, setShowTooleTip] = useState<any>({
    index: null,
    content: '',
  });

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize(TRACKING_ID);

    // Optionally track page view when the extension is opened
    ReactGA.send('pageview');
  }, []);

  const checkValidCurrencyInputField = (value: any) => {
    if (/^[1-9][0-9]*(\.[0-9]+)?$/.test(value)) {
      setValidAmount(/^[1-9][0-9]*(\.[0-9]+)?$/.test(value));
      setAmount(value);
      setError({ amount: null, currencyCode: null });
    } else {
      setValidAmount(/^[1-9][0-9]*(\.[0-9]+)?$/.test(value));
      setError({ amount: 'Please enter valid amount', currencyCode: null });
    }
  };

  const checkValidFilterInputField = (value: any) => {
    if (/^([A-Z]{3})(,([A-Z]{3}))*$/.test(value)) {
      setValidAmount(/^([A-Z]{3})(,([A-Z]{3}))*$/.test(value));
      setCurrencyCode(value);
      setError({ amount: null, currencyCode: null });
    } else {
      setCurrencyCode(value);
      setValidAmount(/^([A-Z]{3})(,([A-Z]{3}))*$/.test(value));
      setError({
        amount: null,
        currencyCode: 'Please enter valid currency code',
      });
    }
  };

  const convertCurrency = async (item: any) => {
    try {
      if (validAmount) {
        setError({ amount: null, currencyCode: null });
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
          conversionToAllCurrency[item] = res?.conversion_rates[item] * amount;
        });
        setConversionToAllCurrency(conversionToAllCurrency);
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
              checkValidCurrencyInputField={checkValidCurrencyInputField}
              convertCurrency={convertCurrency}
              defaultSelectedCurrency={defaultSelectedCurrency}
            />
            {Object.keys(conversionToAllCurrency).length > 0 && (
              <ConvertButton setShowCurrencyDropDown={setShowCurrencyDropDown} showCurrencyDropDown={showCurrencyDropDown} />
            )}
          </div>
          {error.amount != null && <p className="text-red-500 text-xs text-left">{error.amount}</p>}
        </div>
        {Object.keys(conversionToAllCurrency).length > 0 && (
          <FilterButton currencyCode={currencyCode} checkValidFilterInputField={checkValidFilterInputField} filter={filter} error={error} />
        )}
      </div>
      <div className="flex flex-wrap overflow-scroll h-[77vh]">
        {Object.keys(conversionToAllCurrency).length > 0 &&
          Object.keys(isFilter ? filteredCurrencyConvertedList : conversionToAllCurrency).map(item => {
            return (
              currencyToCountryCode[item] !== undefined && (
                <List
                  code={item}
                  amount={conversionToAllCurrency[item].toFixed(3)}
                  isAvailable={conversionToAllCurrency[item]}
                  imageCode={currencyToCountryCode[item].code}
                />
              )
            );
          })}
      </div>
      <div
        tabIndex={-1}
        aria-hidden="true"
        className={`${showCurrencyDropDown ? 'display' : 'hidden'}  scroll overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full m-auto">
          <SelectCurrencyModal
            setShowCurrencyDropDown={setShowCurrencyDropDown}
            showCurrencyDropDown={showCurrencyDropDown}
            conversionToAllCurrency={conversionToAllCurrency}
            setDefaultSelectedCurrency={setDefaultSelectedCurrency}
            convertCurrency={convertCurrency}
            setCurrencyCode={setCurrencyCode}
            setShowTooleTip={setShowTooleTip}
            currencyToCountryCode={currencyToCountryCode}
            showTooleTip={showTooleTip}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
