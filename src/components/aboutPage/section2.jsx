import React from "react";

const Section2 = () => {
  return (
    <div className="container mx-auto px-6 py-16 lg:flex lg:items-center justify-between">
      {/* Left Content */}
      <div className="lg:w-2/5">
        <p className="text-gray-500 text-sm mb-2">The Genesis</p>
        <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-6">
          How It All Began
        </h2>
        <p className="text-gray-700 mb-4 text-sm">
          Nunc non blandit massa enim nec dui nunc. Velit scelerisque in dicu
          non consectetur. Et netus et malesuada fames. Suscipit adipiscing
          bibendum est ultricies integer quis auctor elit sed. Neque sodales ut
          etiam sit. Amet volutpat consequat mauris nunc. A lacus vestibulum sed
          arcu non odio euismod. Fermentum iaculis eu non diam. Lobortis elitc
          elementum nibh tellus molestie.
        </p>
        <p className="text-gray-700 mb-4 text-sm">
          Etiam non quam lacus suspendisse faucibus interdum posuere. Leo diam
          sollicitudin tempor id eu nisl nunc. Amet aliquam id diam maecenas
          ultris mi eget. Nulla porttitor massa id neque aliquam vestibulum
          morbi blandit. Adipiscing bibendum est ultricies integer quis auctor
          elit sed vulputate. Justo donec enim diam vulputate ut pharetra sit
          amet aliquam.
        </p>
        <p className="text-gray-700 text-sm">
          Adipiscing enim eu turpis egestas. Eu lobortis elementum nibh tellus
          molestie nunc non. Massa tempor nec feugiat nisl pretium. Ullamcorper
          morbi tincidunt ornare mas eget egestas purus viverra. Mollis nunc sed
          id semper risus.
        </p>
      </div>

      {/* Right Images */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex gap-4">
        <img
          src="/Images/62e173378da06e493cb1ed0a_about one-p-500.jpeg"
          alt="Art process"
          className="w-1/2 object-cover"
        />
        <img
          src="/Images/62e173374433b74f067b2cf5_about two-p-500.jpeg"
          alt="Artist working"
          className="w-1/2 object-cover"
        />
      </div>
    </div>
  );
};

export default Section2;
