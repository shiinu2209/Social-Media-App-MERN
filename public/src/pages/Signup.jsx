import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) {
      return;
    }
    try {
      const response = await axiosInstance.post("/user/signup", {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        console.log("User created successfully", response);

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", response.data.user);
        navigate("/");
      } else {
        console.log("Error creating user");
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };
  const validateSignup = () => {
    if (!username || !email || !password) {
      setError("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError(null);
    return true;
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl  text-white mb-4">Sign Up</h2>
        <form onSubmit={(e) => handleSignup(e)}>
          <div className="mb-4">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-white">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <div className="flex flex-row items-center mb-4">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="bg-gray-700 text-white rounded-lg py-2 px-4 "
              />

              <button>
                {showPassword ? (
                  <RiEyeCloseLine
                    className="text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <RiEyeLine
                    className="text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-700 text-sm pb-3">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Sign Up
          </button>
        </form>
        <p className="text-white mt-4">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
