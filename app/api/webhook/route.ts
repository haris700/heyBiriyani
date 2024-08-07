import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { PrismaClient } from "@prisma/client";
import { findUserByEmail } from "@/app/commonFetches/common";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  const prisma = new PrismaClient();

  try {
    // Compute the signature
    const shasum = crypto.createHmac("sha256", secret);
    const body = await req.text(); // Read the request body as text
    shasum.update(body);
    const digest = shasum.digest("hex");

    // Get the signature from the headers
    const receivedSignature = req.headers.get("x-razorpay-signature");

    // Log the received signature and computed digest for debugging
    console.log("Received signature:", receivedSignature);
    console.log("Computed digest:", digest);

    // Validate the signature
    if (digest === receivedSignature) {
      const event = JSON.parse(body);
      console.log("Received event:", event);

      // Handle events
      switch (event.event) {
        case "payment.captured":
          const orderId = event.payload.payment.entity.order_id;

          const email_id = event.payload.payment.entity.email;

          try {
            const user = await findUserByEmail(email_id);

            if (user) {
              // Update the order status to "PAID" and delete the user's cart items in parallel
              await Promise.all([
                prisma.order.updateMany({
                  where: { razoPayOrderId: orderId },
                  data: { paymentStatus: "PAID" },
                }),
                prisma.cart.deleteMany({ where: { userId: user.id } }),
              ]);
            }
          } catch (error) {
            console.error(error);
          }

          return NextResponse.json({ status: "ok" });

        case "payment.authorized":
          const paymentAuthorizedId = event.payload.payment.entity.id;
          console.log(`Payment authorized with ID ${paymentAuthorizedId}`);
          // Update logic here
          return NextResponse.json({ status: "ok" });

        default:
          return NextResponse.json(
            { status: "unhandled_event", event: event.event },
            { status: 400 }
          );
      }
    } else {
      console.log("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
