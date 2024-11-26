export const FilterButton = ({ currencyCode, checkValidFilterInputField, filter, error }) => {
  return (
    <div className="max-w-md mx-auto my-3">
      <div className="flex">
        <div className="relative w-full">
          <input
            value={currencyCode}
            onChange={e => checkValidFilterInputField(e.target.value.toUpperCase())}
            type="search"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 rounded-lg  border border-gray-600 focus:outline-none focus:border-blue-600 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-300"
            placeholder="Enter Currency Code(s)"
            required
          />
          <button
            onClick={filter}
            type="submit"
            className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-600 rounded-e-lg border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-600 dark:bg-blue-600 dark:hover:bg-blue-300 dark:focus:ring-blue-300"
          >
            <p>Filter</p>
          </button>
        </div>
      </div>
      <p className="w-fit text-xs ml-3 text-gray-500">use "," after every Currency Code in text box</p>
      {error.currencyCode != null && <p className="text-red-500 text-xs text-left">{error.currencyCode}</p>}
    </div>
  );
};
