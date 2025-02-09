import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 
import GoogleLogo from "../assets/Google.png"; // Ensure correct path

function SignInwithGoogle() {
  const navigate = useNavigate(); // Use React Router

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Extract first & last name
      const nameParts = user.displayName?.split(" ") || [];
      const firstName = nameParts[0] || user.displayName || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Save user data to Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        photo: user.photoURL,
      });

      toast.success("User logged in successfully", { position: "top-center" });
      navigate("/dashboard"); // Redirect with React Router
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="text-center">
      <p className="text-gray-600 mb-4 text-sm font-medium">-- Or continue with --</p>
      <div className="flex justify-center cursor-pointer" onClick={googleLogin}>
        <div className="relative group">
          <img
            src={GoogleLogo}
            alt="Google Logo"
            className="w-48 rounded-lg shadow-md transition-all transform group-hover:scale-105 group-hover:shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity"></div>
        </div>
      </div>
    </div>
  );
}

export default SignInwithGoogle;
