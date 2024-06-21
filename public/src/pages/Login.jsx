import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) {
      return;
    }
    try {
      const response = await axiosInstance.post("user/login", {
        username,
        password,
      });
      if (response.status === 200) {
        console.log("User logged in successfully", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
        navigate("/");
      } else {
        console.log("Error logging in");
        console.log(response);
        setError(response.data.error);
      }
    } catch (error) {
      setError(error.response.data.error);
      console.log(error);
    }
  };

  const validateLogin = () => {
    if (!username || !password) {
      setError("All fields are required");
      return false;
    }
    setError(null);
    return true;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
        <form onSubmit={(e) => handleLogin(e)} className="flex flex-col">
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="bg-gray-700 text-white rounded-lg py-2 px-4 mb-4"
          />
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

          {error && <p className="text-red-700 text-sm pb-3">{error}</p>}
          <Link to="/forget-password" className="text-gray-400 mb-4">
            Forgot password?
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-4"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          Don{"'"}t have an account?{" "}
          <Link className="text-blue-500" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
