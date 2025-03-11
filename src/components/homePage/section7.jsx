import React from "react";
import { Link } from "react-router-dom";

const Section7 = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Room Makeover with Sheldon Thomas Living Well",
      date: "JULY 29, 2022",
      image: "/Images/62d85703aeb2f6707c3ab42c_thumbnail three-p-800.jpeg",
    },
    {
      id: 2,
      title: "The World of Wall Art by Vanessa Green",
      date: "JULY 29, 2022",
      image: "/Images/62e39ac9aa14a1845cbcea6d_post four-p-800.jpeg",
    },
    {
      id: 3,
      title: "Home Tour: Elegant and Warm in San Diego",
      date: "JULY 26, 2022",
      image: "/Images/62d856f21d5269671c2418e4_thumbnail two-p-800.jpeg",
    },
  ];

  return (
    <section className="container px-5 md:px-0 py-16">
      <h4 className="text-gray-500 text-sm">Explore</h4>
      <h2 className="text-2xl font-medium mb-6">Our Blog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link to="" key={post.id} className="space-y-2 group">
            <div className="overflow-hidden rounded-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-gray-500 text-xs">{post.date}</p>
            <h3 className="text-lg font-medium">{post.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Section7;
