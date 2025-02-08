import { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import SignInwithGoogle from "./SignInwithGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in successfully", {
        position: "top-center",
      });
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://videos.pexels.com/video-files/12692032/12692032-uhd_1440_2560_60fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
            <SignInwithGoogle />
            <p className="text-center text-sm md:text-base text-gray-600">
              New User?{" "}
              <a
                href="/register"
                className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all"
              >
                Register Here
              </a>
            </p>
          </form>
        </div>
      </div>
    
  );
}

export default Login;
