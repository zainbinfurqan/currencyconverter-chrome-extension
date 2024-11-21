const List = ({ code, amount, isAvailable, imageCode }) => {
  return (
    <div className="h-fit m-3 cursor-pointer block max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <img src={`${process.env.REACT_APP_SINGLE_FALG_IMAGE_BASE_URL}${imageCode}.png`} className="m-auto" />
      <div className="flex row  justify-between items-center m-2">
        <h5 className="m-0 text-xl font-medium tracking-tight text-gray-900 dark:text-white font-Outfit">{code}</h5>
      </div>
      {isAvailable && <p className="mx-2 font-normal text-gray-700 dark:text-gray-400">{amount}</p>}
    </div>
  );
};

export default List;
