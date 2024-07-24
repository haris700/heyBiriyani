import { findUserByUid } from "@/app/commonFetches/common";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");

  console.log(uid, "uid");

  if (!uid) {
    return NextResponse.json(
      { message: "Please enter valid inputs" },
      { status: 422 }
    );
  }

  try {
    const user = await findUserByUid(uid);
    console.log(user, "user");

    return NextResponse.json({ message: "This is the current user:", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
