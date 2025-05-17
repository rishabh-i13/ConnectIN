import React from "react";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import DefaultPFP from "../assets/defaultPFP.jpg";
import { toast } from "react-hot-toast";
import { Image, Loader, X } from "lucide-react";

function PostCreation({ user }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const response = await axiosInstance.post("/posts/create", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post !");
    },
  });

  const handleCreatePost = async () => {
  const trimmedContent = content.trim(); // Only trims leading/trailing spaces
  if (!trimmedContent && !image) {
    toast.error("Write something or upload an image to create a post.");
    return;
  }

  try {
    const postData = { content: trimmedContent };
    if (image) {
      postData.image = await readFileAsDataURL(image);
    }
    createPostMutation(postData);
  } catch (error) {
    console.log("Error in Create Post: ", error);
  }
};

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); //base64 string
    });
  };
  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || DefaultPFP}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 focus:outline-none resize-none transition-colors duration-200 min-h-[100px] placeholder:text-gray-500 text-black"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="relative mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
          <button
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            aria-label="Remove image"
          >
            <X size={18} className="text-red-500" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image size={20} className="mr-2" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button
          className="bg-gradient-to-r from-[#360072] to-[#8E00F4] text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreatePost}
          disabled={isPending || (!content.trim() && !image)}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Post"}
        </button>
      </div>
    </div>
  );
}

export default PostCreation;
