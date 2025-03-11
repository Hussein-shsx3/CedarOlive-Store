import React from "react";

const Section3 = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Item */}
        <div className="relative group overflow-hidden">
          <img
            src="/Images/62d9b71403e1a65621ece082_Bitmap 2-p-1080.jpeg"
            alt="Comfort at your home"
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="w-48 text-lg md:text-2xl font-medium mb-1">
              Comfort at your home
            </h3>
            <p className="w-40 text-xs">
              Give yourself and your loved ones room to get comfy.
            </p>
          </div>
        </div>

        {/* Second Item */}
        <div className="relative group overflow-hidden">
          <img
            src="/Images/62d9b727cc17796463c612e0_Bitmap-p-1080.jpeg"
            alt="Set your table abloom"
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="w-48 text-lg md:text-2xl font-medium mb-1">
              Set your table abloom
            </h3>
            <p className="w-40 text-xs">
              Give your flower a beautiful vase at your table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;
