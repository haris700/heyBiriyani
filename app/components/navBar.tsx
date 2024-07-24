"use client";

import React, { useContext } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { UserContext } from "../context/userContext";
import { useRouter } from "next/navigation";

const NavigationMenuBar = () => {
  const { logoutUser } = useContext(UserContext);

  const route = useRouter();

  const handleClickLogout = () => {
    logoutUser();

    route.push("/login");
  };
  return (
    <NavigationMenu.Root className="flex justify-between items-center bg-blue-100 p-4">
      <NavigationMenu.List className="flex space-x-4">
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="text-gray-800 hover:text-gray-600 font-medium"
            href="/"
          >
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className="text-gray-800 hover:text-gray-600 font-medium"
            href="/cart"
          >
            Cart
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.List className="flex space-x-4">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className="text-gray-800 hover:text-gray-600 font-medium"
            onClick={() => handleClickLogout()}
          >
            Logout
          </NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default NavigationMenuBar;
