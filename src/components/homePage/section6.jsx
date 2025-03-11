import React from "react";
import { Link } from "react-router-dom";

const Section6 = () => {
  return (
    <section className="container w-full my-16 px-5 md:px-0">
      <div className="flex flex-col md:flex-row bg-[#513015] justify-start md:justify-center items-stretch overflow-hidden h-auto min-h-[400px] md:h-[670px]">
        <div className="w-full md:w-[69%] h-48 sm:h-64 md:h-full">
          <img
            src="/Images/Screenshot 2025-03-09 143327.png"
            alt="Living Room Decor"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="w-full md:w-[32%] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-start space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-medium leading-snug">
            Let's elevate your surroundings with taste
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consecter acing eiusmod tempor.
          </p>
          <Link
            to=""
            className="mt-4 md:mt-6 bg-[#f0ebe731] text-white w-full sm:w-[40%] py-4 font-medium hover:bg-[#f0ebe747] transition-all duration-200 flex justify-center items-center"
          >
            About Us
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Section6;
