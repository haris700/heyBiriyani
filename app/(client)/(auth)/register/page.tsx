"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [openToast, setOpenToast] = useState(false);
  const [toastErrorMessage, setToastErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Inside a function or event handler
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });

    let error = "";
    if (name === "name" && !value.trim()) {
      error = "Name is required";
    } else if (
      name === "email" &&
      (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    ) {
      error = "Invalid email address";
    } else if (
      name === "password" &&
      (!value ||
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/.test(
          value
        ))
    ) {
      error =
        "Password must be at least 8 characters, containing letters, numbers, and special characters";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", form);

      if ((res.status = 200)) {
        const url = `/verify?email=${form.email}`; // Construct the URL string
        router.push(url);
      }
    } catch (error: any) {
      setToastErrorMessage(error.message);
      setOpenToast(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/register");
  };

  return (
    <>
      {openToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-sm p-4 bg-red-500 text-white rounded shadow-lg z-50">
          <div className="flex justify-between items-center">
            <span>{toastErrorMessage}</span>
            <button onClick={() => setOpenToast(false)}>&times;</button>
          </div>
        </div>
      )}

      <form
        className="flex items-center justify-center h-screen"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="p-8 w-1/3 bg-white shadow-lg rounded">
          <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Name"
              onChange={onChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              id="email"
              name="email"
              type="email"
              placeholder="Please Enter your Email"
              onChange={onChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="w-full px-3 py-2 border rounded"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Please enter your password"
                onChange={onChange}
              />
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={handleTogglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            type="submit"
          >
            {loading ? (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-blue-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Signup"
            )}
          </button>
          <p
            className="text-center mt-4 cursor-pointer text-blue-500 hover:underline"
            onClick={handleLoginRedirect}
          >
            Already registered?
          </p>
        </div>
      </form>
    </>
  );
}
