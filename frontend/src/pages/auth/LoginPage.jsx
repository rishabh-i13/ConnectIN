import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import Lottie from "react-lottie-player";
import animationData from "../../assets/LoginConnectin.json";
import Logo from "../../assets/logoconnectin2.png";

const LoginPage = () => {
  return (
    <div className="max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row mt-8">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 bg-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Sign In</h1>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Welcome back to your professional networking platform. Log in to connect and grow.</p>
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base">Not a member yet? <Link to="/signup" className="text-[#360072] font-medium">SIGN UP</Link></p>
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

export default LoginPage;