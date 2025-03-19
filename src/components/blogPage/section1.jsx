import React from "react";

const Section1 = () => {
  return (
    <section className="w-full container flex flex-col items-start mt-14">
      <div className="w-full my-5 px-5 md:px-0">
        <div className="flex flex-col md:flex-row bg-[#131313] justify-between items-stretch overflow-hidden h-auto min-h-[450px]">
          {/* Left - Text Block */}
          <div className="w-full md:w-[38%] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-start space-y-4">
            <p className="text-sm text-text">July 29, 2022</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
              Room Makeover with Sheldon Thomas Living Well
            </h2>
            <button className="w-[30%] py-3 bg-gray-700">Read More</button>
          </div>
          {/* Right - Main Image */}
          <div className="w-full md:w-[62%] md:h-full">
            <img
              src="/Images/62d85703aeb2f6707c3ab42c_thumbnail three-p-800.jpeg"
              alt="Living Room Decor"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
