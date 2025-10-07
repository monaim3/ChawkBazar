

import React, { useRef, useState } from "react";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { useAddActiveScroll } from "@utils/use-add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { FaRegUser } from "react-icons/fa";
import { BiSolidPhoneCall } from "react-icons/bi";
import { useSearchQuery } from "@framework/product/use-search";
import SearchProduct from "@components/common/search-product";
import Scrollbar from "@components/common/scrollbar";
import SearchResultLoader from "@components/ui/loaders/search-result-loader";
import { useCategories } from "@framework/newCategories";
import { useProducts } from "@framework/searchapi";

const AuthMenu = dynamic(() => import("./auth-menu"), { ssr: false });
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

const { site_header } = siteSettings;
const Header: React.FC = () => {
  const { openModal, setModalView, isAuthorized } = useUI();
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const siteHeaderRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useAddActiveScroll(siteHeaderRef);
  const { data: searchResults, isLoading } = useProducts(searchText);

  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  function handleSearchChange(e: React.FormEvent<HTMLInputElement>) {
    setSearchText(e.currentTarget.value);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Handle search submission
    console.log("Search submitted:", searchText);
  }

  function clearSearch() {
    setSearchText("");
    setIsSearchFocused(false);
  }

  function handleSearchFocus() {
    setIsSearchFocused(true);
  }

  function handleSearchBlur() {
    // Delay hiding results to allow clicking on them
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 200);
  }

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="relative z-20 bg-white border-b border-gray-200"
    >
      {/* Top Header Bar */}
      <div className="container mx-auto px-4 md:px-8 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 max-w-[1920px] mx-auto">

          {/* Left Side - Search Bar */}
          <div className="flex-1 max-w-md relative">
            <form
              className="relative w-full"
              noValidate
              role="search"
              onSubmit={handleSearchSubmit}
            >
              <div className="relative flex items-center">

                <input
                  ref={searchInputRef}
                  id="search"
                  className="w-[80%] h-10 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-b-2 border-gray-300  focus:outline-none "
                  placeholder={"Search for products..."}
                  aria-label="Search"
                  autoComplete="off"
                  value={searchText}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <span className="absolute left-3 flex items-center justify-center text-gray-400 z-10">
                  <SearchIcon className="w-4 h-4" />
                </span>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {(isSearchFocused && searchText) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-hidden z-50">
                <Scrollbar className="max-h-96">
                  <div>
                    {isLoading ? (
                      <div className="p-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <SearchResultLoader
                            key={idx}
                            uniqueKey={`search-loader-${idx}`}
                          />
                        ))}
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      searchResults.map((item: any, index: number) => (
                        <div
                          key={item.id || index}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0"
                          onClick={() => {
                            clearSearch();
                            // Handle product click
                          }}
                        >
                          <SearchProduct item={item} />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500 text-sm">
                        {`No results found for "${searchText}"`}
                      </div>
                    )}
                  </div>
                </Scrollbar>
              </div>
            )}
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center mx-8">
            <Logo />
          </div>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            {/* Phone Icon */}
            <button className="flex items-center justify-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none">
              <BiSolidPhoneCall className="w-5 h-5 text-gray-600" />
            </button>

            {/* Shopping Bag Count */}
            <div className="relative">
              <CartButton />
            </div>

            {/* User Account */}
            <AuthMenu
              isAuthorized={isAuthorized}
              href={ROUTES.ACCOUNT}
              btnProps={{
                className: "flex items-center justify-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none",
                children: <FaRegUser className="w-5 h-5 text-gray-600" />,
                onClick: handleLogin,
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Menu */}
      <div className="border-t border-gray-100 bg-white hidden lg:block">
        <div className="container mx-auto px-4 md:px-8 lg:px-6 ">
          <HeaderMenu
            data={categories}
            className="flex justify-center items-center h-12 lg:h-14"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;