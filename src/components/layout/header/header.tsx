import React, { useEffect, useRef } from "react";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { useAddActiveScroll } from "@utils/use-add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@components/ui/language-switcher";
import { FaRegUser } from "react-icons/fa";
import { BiSolidPhoneCall } from "react-icons/bi";

const AuthMenu = dynamic(() => import("./auth-menu"), { ssr: false });
const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

const { site_header } = siteSettings;
const Header: React.FC = () => {
  const { openSearch, openModal, setModalView, isAuthorized } = useUI();
  const { t } = useTranslation("common");
  const siteHeaderRef = useRef<HTMLDivElement>(null);
  useAddActiveScroll(siteHeaderRef);
  useEffect(() => {
    // Call only once when component mounts
    openSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function handleLogin() {
    setModalView("LOGIN_VIEW");
    return openModal();
  }

  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className="container relative z-20  h-16 sm:h-20 lg:h-24"
    >
      <div className=" z-20 h-16 px-4 text-gray-700 transition duration-200 ease-in-out bg-white innerSticky body-font sm:h-20 lg:h-24 md:px-8 lg:px-6">
        <div className="flex items-center justify-center mx-auto max-w-[1920px] h-full w-full">

          <button
            className="relative flex items-center justify-center flex-shrink-0 h-auto transform focus:outline-none"
            onClick={openSearch}
            aria-label="search-button"
          >
            {/* <SearchIcon /> */}
          </button>



          {/* <div className="flex-shrink-0 ltr:ml-auto rtl:mr-auto ltr:lg:mr-5 rtl:lg:ml-5 ltr:xl:mr-8 rtl:xl:ml-8 ltr:2xl:mr-10 rtl:2xl:ml-10">
            <LanguageSwitcher />
          </div> */}
          <div className="flex-shrink-0 ltr:ml-auto rtl:mr-auto ltr:lg:mr-5 rtl:lg:ml-5 ltr:xl:mr-8 rtl:xl:ml-8 ltr:2xl:mr-10 rtl:2xl:ml-10">
            <Logo />
          </div>
          <div className="items-center justify-end flex-shrink-0 hidden lg:flex gap-x-6 lg:gap-x-5 xl:gap-x-8 2xl:gap-x-10 ltr:ml-auto rtl:mr-auto">
            {/* Icons wrapper */}
            <div className="flex items-center gap-x-6 lg:gap-x-5 xl:gap-x-8 2xl:gap-x-10">
              {/* Call Icon */}
              <BiSolidPhoneCall className="w-6 h-8" />

              {/* User Icon */}
              <AuthMenu
                isAuthorized={isAuthorized}
                href={ROUTES.ACCOUNT}
                btnProps={{
                  className: "focus:outline-none",
                  children: <FaRegUser className="w-6 h-6" />,
                  onClick: handleLogin,
                }}
              />

              {/* Cart Icon */}
              <CartButton />
            </div>
          </div>

        </div>
      </div>

      {/* <HeaderMenu
            data={site_header.menu}
            className="hidden lg:flex ltr:md:ml-6 rtl:md:mr-6 ltr:xl:ml-10 rtl:xl:mr-10"
          /> */}
    </header>
  );
};

export default Header;
