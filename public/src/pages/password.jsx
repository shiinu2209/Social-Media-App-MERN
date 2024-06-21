import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post(`/user/reset-password/${token}`, {
        password,
      });
      console.log(token);
      setMessage("Password reset successful");
      navigate("/login");
    } catch (error) {
      setMessage(error.response.data.error || "Error resetting password ");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen flex justify-center items-center flex-col">
      <h2 className="text-2xl mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className=" flex justify-center items-center flex-col">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="bg-gray-800 text-white p-2 mb-2"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="bg-gray-800 text-white p-2 mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset Password
          </button>
        </div>
      </form>
      {message && <p className="text-red-700">{message}</p>}
    </div>
  );
};

export default ResetPassword;
