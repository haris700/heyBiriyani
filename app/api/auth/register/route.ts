import { NextRequest, NextResponse } from "next/server";
import { number, z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "../../../utils/aws/aws";
const prisma = new PrismaClient();

const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
  password: z.string().min(8),
});

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isvalidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleFirstRegister = async (
  name: string,
  email: string,
  hashPassword: string
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      isVerified: false,
    },
  });
};

const storeVerificationInfo = async (
  email: string,
  otp: string,
  expiration: Date
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  const userId = user?.id;

  if (!user) {
    throw new Error("User is not entered into the register table");
  }

  await prisma.verification.create({
    data: {
      user: {
        connect: { email },
      },
      otp,
      expiration,
    },
  });
};

const updateVerificationInfo = async (
  email: string,
  otp: string,
  expiration: Date
) => {
  const existingVerification = await prisma.verification.findFirst({
    where: { user: { email } },
  });

  await prisma.verification.update({
    where: { id: existingVerification!.id },
    data: { otp, expiration },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(body, "bodyyyyy");

    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { name, email, password } = body;

    if (!isvalidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email" },
        { status: 422 }
      );
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.email && user.isVerified) {
      return NextResponse.json(
        { message: "This email is already registered, try another" },
        { status: 422 }
      );
    } else if (user && user.email && !user.isVerified) {
      const verificationCode = generateOtp();
      const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      await updateVerificationInfo(email, verificationCode, otpExpiration);
      await sendVerificationEmail(email, verificationCode);
    } else {
      const verificationCode = generateOtp();
      const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
      await handleFirstRegister(name, email, hashPassword);
      await sendVerificationEmail(email, verificationCode);
      await storeVerificationInfo(email, verificationCode, otpExpiration);
    }

    return NextResponse.json({ message: "User added successfully" });
  } catch (error) {
    console.error("@user->register: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
