import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader, Eye, EyeOff } from "lucide-react";

const passwordChecks = {
  length: (pwd) => pwd.length >= 8,
  lowercase: (pwd) => /[a-z]/.test(pwd),
  uppercase: (pwd) => /[A-Z]/.test(pwd),
  number: (pwd) => /[0-9]/.test(pwd),
  symbol: (pwd) => /[^A-Za-z0-9]/.test(pwd),
};

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
  
    const allValid = Object.values(validations).every(Boolean);
  
    if (!allValid) {
      toast.error("Please meet all password requirements.");
      return;
    }
  
    signUpMutation({ name, username, email, password });
  };
  

  const validations = {
    length: passwordChecks.length(password),
    lowercase: passwordChecks.lowercase(password),
    uppercase: passwordChecks.uppercase(password),
    number: passwordChecks.number(password),
    symbol: passwordChecks.symbol(password),
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered w-full bg-gray-50 border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full bg-gray-50 border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full bg-gray-50 border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full bg-gray-50 border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Password Validation UI */}
      {password && (
        <div className="flex flex-wrap gap-3 text-sm">
          <ConditionCheck label="8 Chars" valid={validations.length} />
          <ConditionCheck label="1 Lowercase" valid={validations.lowercase} />
          <ConditionCheck label="1 Uppercase" valid={validations.uppercase} />
          <ConditionCheck label="1 Symbol" valid={validations.symbol} />
          <ConditionCheck label="1 Number" valid={validations.number} />
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white rounded-lg py-3 hover:bg-gradient-to-l from-[#360072] to-[#8E00F4] disabled:bg-blue-400 transition-colors font-semibold"
      >
        {isLoading ? (
          <Loader className="size-5 animate-spin mx-auto" />
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

const ConditionCheck = ({ label, valid }) => {
  return (
    <div className="flex items-center gap-1">
      <span
        className={`h-2 w-2 rounded-full ${
          valid ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className={`${valid ? "text-green-600" : "text-red-500"}`}>
        {label}
      </span>
    </div>
  );
};

export default SignUpForm;
