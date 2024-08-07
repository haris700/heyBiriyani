import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import razorpay from "@/app/utils/razopay/razopay";

interface CartItem {
  itemId: number;
  userId: number;
  quantity: number;
}

const prisma = new PrismaClient();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payment_capture = 1;
    const { amount, cartItems }: { amount: number; cartItems: CartItem[] } =
      await req.json();

    const orderBatchId = uuidv4();

    // Fetch item details and create order data
    const orderData = await Promise.all(
      cartItems.map(async (cartItem) => {
        const { itemId, quantity } = cartItem;

        // Fetch item details from the database
        const item = await prisma.item.findUnique({
          where: { id: itemId },
        });

        if (!item) {
          throw new Error(`Item with ID ${itemId} not found`);
        }

        return {
          itemId: item.id,
          userId: cartItem.userId,
          totalPrice: item.price * quantity,
          status: "PENDING",
          quantity,
          unitPrice: item.price,
          paymentStatus: "PENDING",
          orderBatchId: orderBatchId,
        };
      })
    );

    // Insert orders into the database
    const newOrder = await prisma.order.createMany({ data: orderData });

    // Fetch the created orders to get their IDs
    const createdOrders = await prisma.order.findMany({
      where: {
        orderBatchId,
      },
    });

    const options = {
      amount,
      currency: "INR",
      payment_capture,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (razorpayOrder) {
      // Update the orders with Razorpay order ID
      await prisma.order.updateMany({
        where: {
          id: {
            in: createdOrders.map((order) => order.id),
          },
        },
        data: {
          razoPayOrderId: razorpayOrder.id,
        },
      });
    }

    return NextResponse.json(
      { message: "Order created successfully", razorpayOrder },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal error", error: error },
      { status: 500 }
    );
  }
}
