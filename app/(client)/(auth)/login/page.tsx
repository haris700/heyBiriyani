"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { UserContext } from "@/app/context/userContext";

const Login = () => {
  const { loginUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    backend: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastErrorMessage, setToastErrorMessage] = useState<string>("");
  const router = useRouter();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });

    let error = "";
    if (
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
      error = "Password must be at least 8 characters";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/signin", form);

      if (res.status == 200) {
        localStorage.setItem("token", res?.data.token);
        router.push("/");
      }

      loginUser(res?.data.user);
    } catch (error: any) {
      setToastErrorMessage(error.message);
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickForgetPassword = () => {
    router.push("/send-reset-password-code");
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
        <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>

        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
              errors.email ? "border-red-500" : ""
            }`}
            value={form.email}
            onChange={onChange}
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-xs italic text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              value={form.password}
              onChange={onChange}
              placeholder="Password"
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-tight text-gray-700 cursor-pointer"
              onClick={handleTogglePasswordVisibility}
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="text-xs italic text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            {loading ? (
              <div className="loader border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6 mx-auto"></div>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span
            className="inline-block align-baseline text-sm text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={handleClickForgetPassword}
          >
            Forgot Password?
          </span>
          <span
            className="inline-block align-baseline text-sm text-blue-500 cursor-pointer hover:text-blue-800"
            onClick={() => router.push("/signup")}
          >
            Not registered yet?
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
