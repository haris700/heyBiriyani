"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import animationData from "./animations/sand-witch.json";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserContext } from "../context/userContext";
import isAuthtenticatedRoute from "./isAuthenticatedRoute";

const HomeComponent = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const [showText, setShowText] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      animationData,
      autoplay: true,
      container: container.current as HTMLDivElement,
      loop: true,
      renderer: "svg",
    });

    const timeoutId = setTimeout(() => {
      setShowText(true);
    }, 500);

    return () => {
      animation.destroy();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="container mx-auto mt-10 max-w-sm">
      <div className="space-y-4">
        <div className="p-4 text-center">
          <h6 className="text-xl font-semibold">
            Hi {user?.name} Grab Your Food Here
          </h6>
          <div ref={container} className="h-40" />
        </div>

        <div className="space-y-2 overflow-hidden">
          <p
            className={`transition-transform duration-500 ${
              showText
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            Hi guys, have you tried working with a computer? Don't worry, our
            biryani is ready at 8 PM.
          </p>
          <p
            className={`transition-transform duration-500 ${
              showText
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            Come on, guys! We're eagerly awaiting you for our special open dum.
            Join us for a flavorful experience!
          </p>

          <div
            className={`flex items-center mt-5 transition-transform duration-500 ${
              showText
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-full"
            }`}
          >
            <span className="mr-3">Book Your Biriyani Slots</span>
            <Link href="/foods" passHref>
              <button className="flex items-center bg-gray-200 px-3 py-2 rounded">
                <span>Go</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5l6 6m0 0l-6 6m6-6H3"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default isAuthtenticatedRoute(HomeComponent);
