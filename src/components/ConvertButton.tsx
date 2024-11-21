export const ConvertButton = ({ setShowCurrencyDropDown, showCurrencyDropDown }) => {
  return (
    <div className="flex flex-col mx-2 max-[425px]:my-2 max-[425px]:items-center">
      <button
        onClick={() => setShowCurrencyDropDown(!showCurrencyDropDown)}
        data-dropdown-toggle="dropdown"
        className="w-fit text-white bg-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-300 dark:focus:ring-blue-300"
        type="button"
      >
        Currency
        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
    </div>
  );
};
