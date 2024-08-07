import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const cartItemSchema = Joi.object({
  userId: Joi.number().required(),
  itemId: Joi.number().required(),
  quantity: Joi.number().integer().positive().required(),
  unitPrice: Joi.number().positive().required(),
  totalPrice: Joi.number().positive().required(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate request body
    const { error } = cartItemSchema.validate(data);
    if (error) {
      return NextResponse.json(
        { message: "Invalid input", error: error.details },
        { status: 400 }
      );
    }

    const { userId, itemId, quantity, unitPrice, totalPrice } = data;

    let cartItem;

    // Check if the item already exists in the cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existingCartItem) {
      // Update the quantity of the existing cart item
      cartItem = await prisma.cart.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
          totalPrice: existingCartItem.totalPrice + totalPrice,
        },
      });
    } else {
      // Create a new cart item
      cartItem = await prisma.cart.create({
        data: {
          userId,
          itemId,
          quantity,
          unitPrice,
          totalPrice,
        },
      });
    }

    return NextResponse.json(
      { message: "Cart item added", cartItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding cart item:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
