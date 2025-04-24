"use client";

import { useState, useRef, useEffect } from "react";

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const items = ["m0", "ventures", 3, 4, 5]; // Placeholder numbers

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const index = Math.round(
          carouselRef.current.scrollLeft / carouselRef.current.offsetWidth,
        );
        setActiveIndex(index);
      }
    };

    carouselRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      carouselRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          const nextIndex = (activeIndex + 1) % items.length;
          carouselRef.current.scrollTo({
            left: nextIndex * carouselRef.current.offsetWidth,
            behavior: "smooth",
          });
          setActiveIndex(nextIndex);
        }
      }, 6000); // Change slide every 3 seconds
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="scrollbar-hide flex h-full w-full snap-x snap-mandatory overflow-x-auto font-ppEditorial"
        style={{ scrollBehavior: "smooth" }} // Ensure smooth scrolling
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex h-full w-full flex-shrink-0 snap-start items-center justify-center"
          >
            <span className="text-9xl text-gray-300">{item}</span>
          </div>
        ))}
      </div>
      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 font-ppEditorial">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
              index === activeIndex ? "scale-125 bg-gray-600" : "bg-gray-400"
            }`}
            onClick={() => {
              setActiveIndex(index);
              carouselRef.current?.scrollTo({
                left: index * carouselRef.current.offsetWidth,
                behavior: "smooth",
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
