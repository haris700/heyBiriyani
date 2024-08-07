// pages/api/cart/updateCart.ts

import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updateCartItemSchema = Joi.object({
  userId: Joi.number().required(),
  itemId: Joi.number().required(),
  quantity: Joi.number().integer().required(),
  itemPrice: Joi.number().required(),
});

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate request body
    const { error } = updateCartItemSchema.validate(data);
    if (error) {
      return NextResponse.json(
        { message: "Invalid input", error: error.details },
        { status: 400 }
      );
    }

    const { userId, itemId, quantity, itemPrice } = data;

    if (quantity > 0) {
      // Update the cart item quantity
      await prisma.cart.update({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
        data: {
          quantity,
          totalPrice: quantity * itemPrice,
        },
      });
    } else {
      // Remove the cart item
      await prisma.cart.delete({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
      });
    }

    return NextResponse.json({ message: "Cart item updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
