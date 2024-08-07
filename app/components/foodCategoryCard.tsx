import React from "react";
import Image, { StaticImageData } from "next/image";
import biriyani from "@/public/images/biriyani.jpeg";
import chickenFryNew from "@/public/images/chickenFryNew.png";

interface IFoodItems {
  id: number;
  ingredients: string[];
  name: string;
  price: number;
  uid: string;
}

interface IFoodCategoryCardProps {
  item: IFoodItems;
  quantity: number;
  handleQuantityChange: (
    itemId: number,
    change: number,
    unitPrice: number
  ) => void;
}

const imageMap: { [key: string]: StaticImageData } = {
  biriyani: biriyani,
  chickenfry: chickenFryNew,
  // Add more mappings as needed
};

const FoodCategoryCard: React.FC<IFoodCategoryCardProps> = ({
  item,
  quantity,
  handleQuantityChange,
}) => {
  const itemImage = imageMap[item.name.toLowerCase()] || biriyani;

  return (
    <div className="p-2 md:p-4 flex flex-col items-center justify-between border rounded-2xl cursor-pointer gap-3 h-auto">
      <Image
        width={150}
        height={150}
        src={itemImage}
        alt={item.name}
        className="h-[150px] w-[150px] object-contain"
      />

      <h3 className="text-xl font-semibold">{item.name}</h3>

      <h3 className="text-xl font-semibold"> ₹{item.price}</h3>

      <div className="flex items-center justify-between mt-4 w-full">
        <button
          onClick={() => handleQuantityChange(item.id, -1, item.price)}
          className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center justify-center"
          disabled={quantity <= 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <div className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-full">
          {quantity}
        </div>
        <button
          onClick={() => handleQuantityChange(item.id, 1, item.price)}
          className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FoodCategoryCard;
