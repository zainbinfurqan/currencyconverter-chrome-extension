export const SelectCurrencyModal = ({
  setShowCurrencyDropDown,
  showCurrencyDropDown,
  conversionToAllCurrency,
  setDefaultSelectedCurrency,
  convertCurrency,
  setCurrencyCode,
  setShowTooleTip,
  currencyToCountryCode,
  showTooleTip,
}) => {
  return (
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
      <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600">
        <p className="font-bold mx-2 text-black">Select country code</p>
        <button
          onClick={() => setShowCurrencyDropDown(!showCurrencyDropDown)}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-wrap row text-black">
        {Object.keys(conversionToAllCurrency).map((item, index) => (
          <p
            onClick={() => {
              setShowCurrencyDropDown(!showCurrencyDropDown);
              setDefaultSelectedCurrency(item);
              setCurrencyCode('');
              convertCurrency(item);
            }}
            onMouseOver={() => {
              currencyToCountryCode[item] &&
                setShowTooleTip({
                  index,
                  content: currencyToCountryCode[item].fullName,
                });
            }}
            onMouseLeave={() => setShowTooleTip({ index: null, content: '' })}
            className="m-0  w-fit cursor-pointer px-2 self-center py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            {item}
            {currencyToCountryCode[item] != undefined && index === showTooleTip.index && (
              <span className="shadow px-2 font-bold absolute bg-white -mx-2 -my-3 ">{showTooleTip.content}</span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
};
