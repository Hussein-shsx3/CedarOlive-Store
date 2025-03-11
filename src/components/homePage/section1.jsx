import React from "react";

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
        <button className="text-base md:text-lg bg-secondary px-6 md:px-8 py-3 md:py-4 text-white transition duration-200 hover:bg-opacity-90">
          Shop Now
        </button>
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
