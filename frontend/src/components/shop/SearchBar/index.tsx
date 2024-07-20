import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import CustomInput from '@components/headlessUI/CustomInput';

const SearchBar = () => {
  return (
    <div className="fixed w-9/12 md:w-3/4 sm:top-4 md:top-20 lg:top-4 lg:w-96">
      <div className="relative">
        <div className="relative w-full overflow-hidden text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 sm:text-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          {/* 
            border text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100
          */}
          <CustomInput
            id="search"
            inputClassName="w-full pl-10 pt-2.5 pr-2.5 pb-2.5 text-sm"
            onChange={() => null} // setSearchTerm(event.target.value)
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
