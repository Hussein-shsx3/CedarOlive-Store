import React from "react";

const Section4 = () => {
  return (
    <section className="w-full container flex flex-col items-start my-20">
      <p className="text-gray-500 text-sm mb-2">Visit Our Stores</p>
      <h2 className="text-3xl sm:text-4xl text-gray-900 mb-6">
        The Home of Brilliant Decor
      </h2>
      <div className="w-full mt-5 px-5 md:px-0">
        <div className="flex flex-col md:flex-row bg-[#513015] justify-center items-stretch overflow-hidden h-auto min-h-[400px] md:h-[670px]">
          {/* Left - Text Block */}
          <div className="w-full md:w-[69%] h-48 sm:h-64 md:h-full">
            <img
              src="/Images/62e16cfc0661addceafe2b8a_store one.jpeg"
              alt="Living Room Decor"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {/* Right - Main Image */}
          <div className="w-full md:w-[32%] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-start space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
              695 Town Center Dr. San Diego, CA
            </h2>
            <p className="mt-2 md:mt-4 text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consecter utin adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full my-5 px-5 md:px-0">
        <div className="flex flex-col md:flex-row bg-[#513015] justify-center items-stretch overflow-hidden h-auto min-h-[400px] md:h-[670px]">
          {/* Left - Text Block */}
          <div className="w-full md:w-[32%] text-white p-6 sm:p-8 md:p-10 flex flex-col justify-start space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
              999 North 29th Street Birmingham, AL
            </h2>
            <p className="mt-2 md:mt-4 text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consecter utin adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>
          {/* Right - Main Image */}
          <div className="w-full md:w-[69%] h-48 sm:h-64 md:h-full">
            <img
              src="/Images/62e16e16961d2e051bb5020e_store two xl.jpeg"
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

export default Section4;
