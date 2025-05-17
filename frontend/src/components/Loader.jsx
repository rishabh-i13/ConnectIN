import React from "react";
import Lottie from "lottie-react";
import LoaderVdo from "../assets/LoaderConnectIN.json";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen   ">
      <Lottie animationData={LoaderVdo} loop={true} className="h-40 w-auto" />
    </div>
  );
};

export default Loader;
