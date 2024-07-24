// pages/checkout.tsx

"use client";

// pages/checkout.tsx

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import biriyani from "../../../public/images/biriyani.jpeg";
import Image from "next/image";

interface OrderItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name: string;
  userId: number;
  status: string;
}

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const orderData = searchParams.get("orderData");
    if (orderData) {
      const parsedOrderData = JSON.parse(orderData);

      console.log(parsedOrderData, "kkkkkkkkkkkkkkkkk");

      setOrderItems(parsedOrderData);

      const total = parsedOrderData.reduce(
        (acc: number, item: OrderItem) => acc + item.totalPrice,
        0
      );
      setTotalAmount(total);
    }
  }, [searchParams]);

  console.log(orderItems, "order items");

  const handlePayment = () => {
    alert("Payment processing...");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <a href="#" className="text-2xl font-bold text-gray-800">
          Hey biriyani
        </a>
        <div className="mt-4 py-2 text-xs sm:mt-0 sm:ml-auto sm:text-base">
          <div className="relative">
            <ul className="relative flex w-full items-center justify-between space-x-2 sm:space-x-4">
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </a>
                <span className="font-semibold text-gray-900">Order Added</span>
              </li>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-semibold text-white ring ring-gray-600 ring-offset-2"
                  href="#"
                >
                  2
                </a>
                <span className="font-semibold text-gray-500">Payment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">Check your items. And Pay Please</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {orderItems.map((item) => (
              <div
                key={item.itemId}
                className="flex flex-col rounded-lg bg-white sm:flex-row"
              >
                <Image sizes="small" src={biriyani} alt={item.name} />
                <div className="flex w-full flex-col px-4 py-4">
                  <span className="font-semibold">{item.name}</span>
                  <p className="text-lg font-bold">
                    ₹{item.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Payment Details</p>
          <p className="text-gray-400">
            Complete your order by providing your payment details.
          </p>
          <div className="">
            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="your.email@gmail.com"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7 7 7-7"
                  />
                </svg>
              </div>
            </div>

            <label
              htmlFor="card-number"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="card-number"
                name="card-number"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="**** **** **** 1234"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7 7 7-7"
                  />
                </svg>
              </div>
            </div>

            <label
              htmlFor="card-expiry"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Expiry Date
            </label>
            <input
              type="text"
              id="card-expiry"
              name="card-expiry"
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              placeholder="MM/YY"
            />

            <label
              htmlFor="card-cvc"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              CVC
            </label>
            <input
              type="text"
              id="card-cvc"
              name="card-cvc"
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              placeholder="123"
            />

            <div className="mt-8 flex items-center justify-between">
              <p className="text-lg font-medium">Total Amount</p>
              <p className="text-lg font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>

            <button
              onClick={handlePayment}
              className="mt-8 w-full rounded-lg bg-blue-600 py-3 px-4 text-center text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
