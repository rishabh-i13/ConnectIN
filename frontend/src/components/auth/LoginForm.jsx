import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader,Eye, EyeOff  } from "lucide-react";

const LoginForm = () => {
    const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post("/auth/login", userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Invalid email or password");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ username: identifier, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Username or Email"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
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

        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary w-full bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white rounded-lg py-3 hover:bg-gradient-to-l from-[#360072] to-[#8E00F4] disabled:bg-blue-400 transition-colors font-semibold"
      >
        {isLoading ? <Loader className="size-5 animate-spin mx-auto" /> : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;