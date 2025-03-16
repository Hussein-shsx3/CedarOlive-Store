import React from "react";

const Section1 = () => {
  return (
    <section className="relative w-full max-h-[100dvh] container overflow-hidden my-10">
      {/* Background Image */}
      <img
        src="/Images/62e1861385026e9ef52ab6bf_about hero Large.jpeg"
        alt="Hero"
        className="w-full max-h-[100dvh] object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h1 className="text-white w-full xl:w-[50%] text-2xl sm:text-4xl md:text-5xl font-medium text-center px-4">
          We believe we make all the difference
        </h1>
      </div>
    </section>
  );
};

export default Section1;
