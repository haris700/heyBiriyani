"use client";

import React, { useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import biriyani from "../../../public/images/biriyani.jpeg";
import isAuthenticatedRoute from "@/app/components/isAuthenticatedRoute";
import axios from "axios";
import { UserContext } from "@/app/context/userContext";

interface IFoodItems {
  id: number;
  ingredients: string[];
  name: string;
  price: number;
  uid: string;
}

interface IOrder {
  userUid?: string;
  itemId: number;
  quantity: number;
}

const BookSlot = () => {
  const router = useRouter();
  //   const [items, setItems] = useState<ItemResponse[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);

  const [foodItems, setFoodItems] = useState<IFoodItems[]>([]);

  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);

  const userUid = user?.uid;

  const CircularSpinner = () => (
    <div className="w-6 h-6 border-4 border-t-transparent border-white border-solid rounded-full animate-spin"></div>
  );

  const allFoodItems = async () => {
    try {
      const res = await axios.get("/api/foodItems");

      setFoodItems(res.data.foodItems);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddQuantity = (itemId: number) => {
    const existingOrderIndex = orders.findIndex(
      (order) => order.itemId === itemId
    );

    if (existingOrderIndex !== -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIndex].quantity += 1;
      setOrders(updatedOrders);
    } else {
      const newOrder = { itemId, quantity: 1 };
      setOrders([...orders, newOrder]);
    }
  };

  const handleDecreaseQuantity = (itemId: number) => {
    const existingOrderIndex = orders.findIndex(
      (order) => order.itemId === itemId
    );

    if (existingOrderIndex !== -1) {
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIndex].quantity = Math.max(
        updatedOrders[existingOrderIndex].quantity - 1,
        0
      );
      setOrders(updatedOrders);
    }
  };

  const hasAnyItemWithQuantity = () => {
    return orders.some((order) => order.quantity > 0);
  };

  const addOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/order/${userUid}`, orders);

      console.log(res, "resss");

      if (res.status == 201 && res.statusText === "Created") {
        const queryString = new URLSearchParams({
          orderData: JSON.stringify(res.data.orders),
        }).toString();

        router.push(`/checkout?${queryString}`);
      }
    } catch (error) {
      console.error(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    allFoodItems();
  }, []);

  console.log(orders, "ordersss");

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="text-center mt-12">
        <h2 className="text-lg font-semibold">
          Options are limited but satisfaction is more !!
        </h2>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {foodItems.map((item: IFoodItems) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-48">
              <Image
                src={biriyani}
                alt={item.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-center">{item.name}</h3>
              <p className="text-gray-600 mt-2">
                {item.ingredients.join(", ")}
              </p>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleAddQuantity(item.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Add Quantity
                </button>
                <div className="flex items-center">
                  <span className="mr-2">Quantity:</span>
                  <div className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full">
                    {orders.find((order) => order.itemId === item.id)
                      ?.quantity || 0}
                  </div>
                </div>
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  disabled={
                    (orders.find((order) => order.itemId === item.id)
                      ?.quantity || 0) <= 0
                  }
                >
                  Decrease
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <button
          onClick={addOrder}
          className="bg-green-500 text-white px-4 py-2 rounded-sm"
          disabled={!hasAnyItemWithQuantity()}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularSpinner />
            </div>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default isAuthenticatedRoute(BookSlot);
