"use client";

import React, { useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import CartSvg from "@/public/icons/cart";
import { useCart } from "../context/cartContext";

const NavigationMenuBar = () => {
  const { logoutUser } = useContext(UserContext);
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { cartItems } = useCart();

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClickLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
      <nav className="relative max-w-[85rem] w-full md:flex md:items-center md:justify-between md:gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <a
            className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white"
            href="/"
            aria-label="Brand"
          >
            Brand
          </a>
          <div className="md:hidden">
            <button
              type="button"
              className="hs-collapse-toggle relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              onClick={handleToggleCollapse}
              aria-expanded={!isCollapsed}
              aria-controls="hs-header-classic"
              aria-label="Toggle navigation"
            >
              <svg
                className={`hs-collapse-open:${
                  isCollapsed ? "hidden" : "block"
                } size-4`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>

              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>
        </div>

        <div
          id="hs-header-classic"
          className={`${
            isCollapsed ? "hidden" : "block"
          } md:block overflow-hidden transition-all duration-300 basis-full grow`}
          aria-labelledby="hs-header-classic-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">
              <a
                className="p-2 flex items-center text-sm text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="/"
                aria-current="page"
              >
                Home
              </a>
              <a
                className="p-2 flex items-center text-sm text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                href="/order"
              >
                Order
              </a>

              <button
                onClick={() => {
                  router.push("/checkout");
                }}
                type="button"
                className="relative inline-flex justify-center items-center w-[55px] h-[55px] text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              >
                <CartSvg className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-red-500 text-white rounded-full">
                  {cartItems.length}
                </span>
              </button>

              <button
                className="p-2 flex items-center text-sm text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
                onClick={handleClickLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavigationMenuBar;
