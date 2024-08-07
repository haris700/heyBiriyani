// pages/api/cart/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CartItem {
  id: string;
  itemId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  name: string;
  userId: number;
  status: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // Fetch cart items for the given user ID from the database
    const cartItems = await prisma.cart.findMany({
      where: { userId: parseInt(id) },
      include: {
        item: true, // Assuming you have a relation with Item model
      },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after operation
  }
}
