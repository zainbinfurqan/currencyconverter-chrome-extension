export const SearchInput = ({ checkValidCurrencyInputField, convertCurrency, defaultSelectedCurrency }) => {
  return (
    <div className="relative w-full">
      <div>
        <p className="absolute top-0 bg-blue-600 -left-1 border border-blue-600 h-full p-2.5 text-sm font-medium text-white  rounded-l-lg border ">
          {defaultSelectedCurrency}
        </p>
      </div>
      <input
        type="search"
        onChange={e => checkValidCurrencyInputField(e.target.value)}
        className="block p-2.5 pl-14 w-full z-20 text-sm text-gray-900 rounded-lg  border border-gray-600 focus:outline-none focus:border-blue-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-300"
        placeholder="Enter amount"
        required
      />
      <button
        onClick={() => convertCurrency(defaultSelectedCurrency)}
        type="submit"
        className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-600 rounded-e-lg border border-blue-600 hover:bg-blue-600  focus:outline-none dark:outline-none  dark:hover:outline-none  dark:focus:outline-none "
      >
        <p>Convert</p>
      </button>
    </div>
  );
};
