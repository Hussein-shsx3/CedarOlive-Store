import React from "react";
import { Link } from "react-router-dom";

const Section1 = () => {
  return (
    <section className="container w-full min-h-[80vh] md:h-[97dvh] flex flex-col-reverse md:flex-row justify-center items-center px-5 md:px-0 my-8 md:my-14 overflow-hidden">
      <div className="w-full md:w-1/2 h-[50dvh] md:h-full flex justify-center items-center flex-col gap-2 bg-primary py-12 md:py-0">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-center">
          Home Decor
        </h1>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-center">
          Collection
        </h1>
        <p className="w-full px-4 md:w-4/5 lg:w-3/5 text-center text-base md:text-lg my-3 md:my-5">
          Pillows, mugs, aprons, jigsaw puzzles, & more, designed and sold by
          independent artists.
        </p>
        <Link
          to="/shop/All"
          className="group relative overflow-hidden px-[1.8em] py-[0.8em] border-2 border-[#A0522D] bg-transparent text-center uppercase text-lg transition duration-300 ease-in-out font-inherit text-[#A0522D]"
        >
          <span className="absolute inset-0 w-0 h-[400%] bg-[#A0522D] transform -translate-x-1/2 -translate-y-1/2 rotate-45 transition-all duration-500 ease group-hover:w-[255%]"></span>

          <span className="relative transition-colors duration-300 group-hover:text-white">
            Shop Now
          </span>
        </Link>
      </div>
      <div className="w-full md:w-1/2 h-[50dvh] md:h-full">
        <img
          src="/Images/62d9a3c6e6d62f3bc30c1e2e_hero_img-p-1080.jpg"
          alt="Home decor showcase"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default Section1;
