import React, { useState } from "react";

import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("user/forgotpassword", { email });
      setMessage("Check your email for the password reset link");
    } catch (error) {
      setMessage("Error sending email");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center flex-col">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border border-gray-300 rounded-md px-4 py-2 m-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
