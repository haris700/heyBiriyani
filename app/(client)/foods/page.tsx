// components/BookSlot.js
"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import isAuthenticatedRoute from "@/app/components/isAuthenticatedRoute";
import { UserContext } from "@/app/context/userContext";
import { useCart } from "@/app/context/cartContext";
import FoodCategoryCard from "@/app/components/foodCategoryCard";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

import motivationalImage from "@/public/images/backroundBiriyani.jpg";

interface IFoodItems {
  id: number;
  ingredients: string[];
  name: string;
  price: number;
  uid: string;
}

const BookSlot = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<IFoodItems[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const userId = user?.id as number;

  const {
    cartItems,
    fetchCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
  } = useCart();

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

  const handleQuantityChange = async (
    itemId: number,
    change: number,
    unitPrice: number
  ) => {
    const existingOrder = cartItems.find((item) => item.itemId === itemId);

    if (existingOrder) {
      const newQuantity = Math.max(existingOrder.quantity + change, 0);

      if (newQuantity > 0) {
        await updateCartItem(itemId, newQuantity, unitPrice);
      } else {
        await removeCartItem(itemId);
      }
    } else if (change > 0) {
      const newItem = {
        userId,
        itemId,
        quantity: change,
        price: unitPrice,
        totalPrice: change * unitPrice,
      };
      await addCartItem(newItem);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      // Implement your order placement logic here
      router.push("/checkout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allFoodItems();
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div className="mx-auto">
      <div className="min-h-[300px] sm:min-h-[300px] bg-blue-50 relative flex justify-center items-center">
        <Image
          src={motivationalImage}
          alt="Motivational Background"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute z-10 text-center px-4">
          <h2
            className="uppercase text-3xl font-semibold text-dark"
            data-aos="fade-up"
          >
            "Life is like a bowl of biryani; enjoy every bite!"
          </h2>
          <h2
            className="uppercase text-3xl font-semibold text-dark mt-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Options are limited but satisfaction is more !!
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 mt-4">
        {foodItems.map((item: IFoodItems) => (
          <FoodCategoryCard
            key={item.id}
            item={item}
            quantity={
              cartItems.find((cartItem) => cartItem.itemId === item.id)
                ?.quantity || 0
            }
            handleQuantityChange={handleQuantityChange}
          />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={placeOrder}
          className="bg-green-500 text-white px-6 py-3 rounded"
          disabled={cartItems.length <= 0}
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
