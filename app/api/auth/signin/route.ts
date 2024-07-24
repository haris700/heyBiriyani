import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import { z } from "zod";

import { createToken } from "@/app/utils/jtw.util";
import { findUserByEmail } from "@/app/commonFetches/common";

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const nowDate = new Date();

  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Please enter valid inputs" },
        { status: 422 }
      );
    }

    const { email, password } = body;

    const user = await findUserByEmail(email);

    if (!user || !user.isVerified) {
      return NextResponse.json(
        { message: "User is not registered" },
        { status: 403 }
      );
    }

    if (!user.password) {
      return NextResponse.json({
        status: 500,
        message: "User password is not set",
      });
    }

    const passwordCheck = await bcryptjs.compare(password, user.password);

    if (!passwordCheck) {
      return NextResponse.json(
        { message: "Password is incorrect" },
        { status: 402 }
      );
    }

    const token = createToken(user.uid);

    await prisma.user.update({
      where: { email },
      data: { lastLogin: nowDate },
    });

    return NextResponse.json({
      token,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("login:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
