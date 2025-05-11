import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
import Lottie from "react-lottie-player";
import animationData from "../../assets/SignupConnectin.json"; // Replace with your .json file path
import Logo from "../../assets/logoconnectin2.png"

const SignUpPage = () => {
  return (
    <div className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row mt-8">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Create Account</h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">A professional networking platform to connect, collaborate, and grow your career.</p>
        <SignUpForm />
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Already a member? <Link to="/login" className="text-[#360072] font-medium">LOGIN</Link></p>
        </div>
      </div>
      {/* Right Side - Logo and Animation (hidden on small devices) */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-r from-[#360072] to-[#8E00F4] items-center justify-center p-8 flex-col">
        <img src={Logo} alt="ConnectIN Logo" className="mb-6 h-16 w-auto rounded-md" />
        <Lottie
          loop
          animationData={animationData}
          play
          style={{ width: '100%', height: 'auto', maxWidth: '400px' }}
        />
      </div>
    </div>
  );
};


export default SignUpPage;
