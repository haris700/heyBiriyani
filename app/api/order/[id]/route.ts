import { NextRequest, NextResponse } from "next/server";
import Joi from "joi";
import { PrismaClient } from "@prisma/client";
import { findUserByUid } from "@/app/commonFetches/common";

const prisma = new PrismaClient();

interface IOrder {
  itemId: number;
  quantity: number;
  userUid: string;
}

const orderSchema = Joi.array()
  .items(
    Joi.object({
      itemId: Joi.number().required(),
      quantity: Joi.number().required(),
    })
  )
  .min(1)
  .required();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const json = await req.json();

    // Validate request body against orderSchema
    const { error } = orderSchema.validate(json);
    if (error) {
      return NextResponse.json(
        { message: "Invalid input", error: error.details },
        { status: 400 }
      );
    }

    const orders = json as IOrder[];

    // Assuming all orders have the same userUid

    const user = await findUserByUid(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const orderData = await Promise.all(
      orders.map(async (order) => {
        const { itemId, quantity } = order;

        // Fetch item details from the database
        const item = await prisma.item.findUnique({
          where: { id: itemId },
        });

        if (!item) {
          throw new Error(`Item with ID ${itemId} not found`);
        }

        return {
          itemId: item.id,
          userId: user.id,
          totalPrice: item.price * quantity,
          status: "PENDING",
          quantity,
          unitPrice: item.price,
          name: item.name,
        };
      })
    );

    console.log(orderData, "orderData");

    // Use prisma.order.createMany for bulk creation
    await prisma.order.createMany({
      data: orderData,
    });

    return NextResponse.json(
      { message: "Orders placed successfully", orders: orderData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation
  }
}
