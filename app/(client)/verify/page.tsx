"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtp() {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastErrorMessage, setToastErrorMessage] = useState<string>("");
  // const [email, setEmail] = useState<string | null>(null); // Initialize with null

  const searchParams = useSearchParams();

  const router = useRouter();

  const email = searchParams.get("email");

  console.log(email, "search");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/verifyOtp", {
        email,
        verificationCode,
      });

      console.log(res, "res");

      if (res.status == 200) {
        router.push("/login");
      }
    } catch (error: any) {
      console.error(error);
      setToastErrorMessage(error.message);
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickResendOtp = async () => {
    setVerificationCode("");
    // try {
    //   await resendOtp(email);
    // } catch (error) {
    //   console.error(error);
    // } finally {
    //   setVerificationCode("");
    // }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {openToast && (
        <div className="fixed top-0 left-0 right-0 mt-4">
          <div className="mx-auto max-w-sm">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{toastErrorMessage}</span>
              <span
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setOpenToast(false)}
              >
                <svg
                  className="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>Close</title>
                  <path d="M14.348 5.652a1 1 0 10-1.415-1.414L10 7.172 7.067 4.238a1 1 0 00-1.414 1.414l3.934 3.934-3.934 3.934a1 1 0 001.414 1.414l2.933-2.934 2.933 2.934a1 1 0 001.415-1.414l-3.934-3.934 3.934-3.934z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}

      <form
        className="w-full max-w-sm p-8 bg-white rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Verify OTP</h2>

        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="verificationCode"
          >
            Verification OTP
          </label>
          <input
            type="text"
            name="verificationCode"
            id="verificationCode"
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            value={verificationCode}
            onChange={onChange}
            placeholder="Enter your OTP here"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? (
            <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6 mx-auto"></div>
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-800"
            onClick={handleClickResendOtp}
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}
