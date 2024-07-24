// pages/api/auth/verifyOtp.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const verifySchema = z.object({
  email: z.string().email().min(1).max(255),
  verificationCode: z.string(),
});

export async function POST(req: NextRequest, res: NextResponse) {
  console.log(req.method, "reqqqqqqqq");

  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 402 }
    );
  }

  const body = await req.json();

  console.log(body, "bodyyyyy");

  const validation = verifySchema.safeParse(body);

  if (!validation.success) {
    console.log("koooi");

    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { verificationCode, email } = body;

  try {
    const verificationInfo = await prisma.verification.findFirst({
      where: {
        user: {
          email,
        },
        otp: verificationCode,
        expiration: {
          gte: new Date(),
        },
      },
    });

    if (!verificationInfo) {
      return NextResponse.json(
        {
          message: "Invalid or expired verification code",
        },
        { status: 402 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });

    // Optionally, you can delete the verification record since it's no longer needed
    // await prisma.verification.delete({
    //   where: {
    //     id: verificationInfo.id,
    //   },
    // });

    return NextResponse.json(
      {
        message: "email  verifiation successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("@admin->verify-otp: ", error);
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
