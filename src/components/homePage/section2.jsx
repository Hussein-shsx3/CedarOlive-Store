import React from "react";
import { Link } from "react-router-dom"; // Import if using React Router

const Section2 = () => {
  const categories = [
    {
      id: 1,
      title: "Accessories & Decorations",
      image: "/Images/62d6d882bf7165679862b5dc_category image Large.jpeg", // Update with your actual image path
      description:
        "Nam hendrerit nisi sed sollicitudin posuere purus rhoncus pulvinar aliquam.",
      link: "/accessories-decorations",
    },
    {
      id: 2,
      title: "Frames & Art",
      image: "/Images/62d6d8a1288c207f11c9ddf2_category image 2 Large.jpeg", // Update with your actual image path
      description:
        "Nam hendrerit nisi sed sollicitudin posuere purus rhoncus pulvinar aliquam.",
      link: "/frames-art",
    },
    {
      id: 3,
      title: "Lamps & Lighting",
      image: "/Images/62d6d8ba1c7215866f71e1c8_category image 3 Large.jpeg", // Update with your actual image path
      description:
        "Nam hendrerit nisi sed sollicitudin posuere purus rhoncus pulvinar aliquam.",
      link: "/lamps-lighting",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className="text-center mb-10">
        <span className="text-sm text-gray-500 tracking-wide">Get Started</span>
        <h2 className="text-3xl md:text-4xl font-medium mt-2 mb-8">
          Find Something You Love
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.link}
            className="group flex flex-col"
          >
            <div className="overflow-hidden mb-4 cursor-pointer">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-64 md:h-72 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg md:text-xl font-medium text-center mb-2 text-title transition-colors duration-300">
              {category.title}
            </h3>
            <p className="text-center text-gray-600 text-sm md:text-base px-4 max-w-md mx-auto">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Section2;
