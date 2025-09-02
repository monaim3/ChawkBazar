// import SearchIcon from "@components/icons/search-icon";
// import React from "react";
// import cn from "classnames";
// import { useTranslation } from "next-i18next";
// import { IoCloseOutline } from "react-icons/io5";

// type SearchProps = {
//   className?: string;
//   onSubmit: (e: React.SyntheticEvent) => void;
//   onClear: (e: React.SyntheticEvent) => void;
//   onChange: (e: React.FormEvent<HTMLInputElement>) => void;
//   name: string;
//   value: string;
// };

// const SearchBox = React.forwardRef<HTMLInputElement, SearchProps>(
//   ({ className, onSubmit, onClear, ...rest }, ref) => {
//     const { t } = useTranslation("forms");
//     return (
//       <form
//         className={cn(
//           "relative  rtl:pl-12 rtl:md:pl-14 bg-white overflow-hidden rounded-md w-[50%]",
//           className
//         )}
//         noValidate
//         role="search"
//         onSubmit={onSubmit}
//       >
//         <label htmlFor="search" className="flex items-center py-0.5">
//           <span className="flex items-center justify-center flex-shrink-0 w-12 h-full cursor-pointer md:w-14 focus:outline-none">
//             <SearchIcon color="text-heading" className="w-4 h-4" />
//           </span>
//           <input
//             id="search"
//             className="w-full h-12 text-sm placeholder-gray-400 outline-none text-heading lg:h-14 lg:text-base"
//             placeholder={t("placeholder-search")}
//             aria-label="Search"
//             autoComplete="off"
//             ref={ref}
//             {...rest}
//           />
//         </label>
//         {/* <button
//           type="button"
//           className="absolute top-0 flex items-center justify-center w-12 h-full text-2xl text-gray-400 transition duration-200 ease-in-out outline-none md:text-3xl ltr:right-0 rtl:left-0 md:w-14 hover:text-heading focus:outline-none"
//           onClick={onClear}
//         >
//           <IoCloseOutline className="w-6 h-6" />
//         </button> */}
//       </form>
//     );
//   }
// );

// SearchBox.displayName = "SearchBox";
// export default SearchBox;


import SearchIcon from "@components/icons/search-icon";
import React from "react";
import cn from "classnames";
import { useTranslation } from "next-i18next";

type SearchProps = {
  className?: string;
  onSubmit: (e: React.SyntheticEvent) => void;
  onClear: (e: React.SyntheticEvent) => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  name: string;
  value: string;
};

const SearchBox = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onSubmit, ...rest }, ref) => {
    const { t } = useTranslation("forms");

    return (
      <form
        className={cn(
          "relative w-[300px] md:w-[300px]",
          className
        )}
        noValidate
        role="search"
        onSubmit={onSubmit}
      >
        <input
          id="search"
          className="w-full h-10 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
          placeholder={t("placeholder-search") || "Search for products..."}
          aria-label="Search"
          autoComplete="off"
          ref={ref}
          {...rest}
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">
          <SearchIcon className="w-4 h-4" />
        </span>
      </form>
    );
  }
);

SearchBox.displayName = "SearchBox";
export default SearchBox;
