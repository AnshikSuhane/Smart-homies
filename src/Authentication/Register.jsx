import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { Toast } from "@/Components/ui/toast";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
    } catch (error) {
      Toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
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
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 sm:px-6 md:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Sign Up
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter Your First Name"
              onChange={(e) => setFname(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter Your Last Name"
              onChange={(e) => setLname(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
          <p className="text-center text-gray-600">
            Already registered?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
