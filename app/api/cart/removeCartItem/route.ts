// pages/api/cart/removeCartItem.ts

import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const removeCartItemSchema = Joi.object({
  userId: Joi.number().required(),
  itemId: Joi.number().required(),
});

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate request body
    const { error } = removeCartItemSchema.validate(data);
    if (error) {
      return NextResponse.json(
        { message: "Invalid input", error: error.details },
        { status: 400 }
      );
    }

    const { userId, itemId } = data;

    // Remove the cart item
    await prisma.cart.delete({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    return NextResponse.json({ message: "Cart item removed" }, { status: 200 });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
