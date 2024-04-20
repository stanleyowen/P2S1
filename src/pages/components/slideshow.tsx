import Image from "next/image";
import React, { useEffect, useState } from "react";

const slides = [
  {
    src: "/Documentation - 2023/P2S1-1.JPG",
    name: "Watercolor",
    alt: "Watercolor",
  },
  {
    src: "/Documentation - 2023/P2S1-2.JPG",
    name: "Vocal Solo",
    alt: "Vocal Solo",
  },
  {
    src: "/Documentation - 2023/P2S1-3.JPG",
    name: "Table Tennis",
    alt: "Table Tennis",
  },
  {
    src: "/Documentation - 2023/P2S1-4.JPG",
    name: "Tug of War",
    alt: "Tug of War",
  },
  { src: "/Documentation - 2023/P2S1-5.JPG", name: "Sketch", alt: "Sketch" },
  {
    src: "/Documentation - 2023/P2S1-6.JPG",
    name: "Scrabble",
    alt: "Scrabble",
  },
  {
    src: "/Documentation - 2023/P2S1-7.JPG",
    name: "Public Speaking",
    alt: "Public Speaking",
  },
  {
    src: "/Documentation - 2023/P2S1-8.JPG",
    name: "Olympiad",
    alt: "Olympiad",
  },
  {
    src: "/Documentation - 2023/P2S1-9.JPG",
    name: "Newscasting",
    alt: "Newscasting",
  },
  { src: "/Documentation - 2023/P2S1-10.JPG", name: "Manga", alt: "Manga" },
  {
    src: "/Documentation - 2023/P2S1-11.JPG",
    name: "Interior Design",
    alt: "Interior Design",
  },
  {
    src: "/Documentation - 2023/P2S1-13.JPG",
    name: "Graphic Design",
    alt: "Graphic Design",
  },
  {
    src: "/Documentation - 2023/P2S1-14.JPG",
    name: "Fashion Design",
    alt: "Fashion Design",
  },
  { src: "/Documentation - 2023/P2S1-15.JPG", name: "Esports", alt: "Esports" },
  { src: "/Documentation - 2023/P2S1-16.JPG", name: "Debate", alt: "Debate" },
  {
    src: "/Documentation - 2023/P2S1-18.JPG",
    name: "Dance Group",
    alt: "Dance Group",
  },
  {
    src: "/Documentation - 2023/P2S1-19.JPG",
    name: "Competitive Programming",
    alt: "Competitive Programming",
  },
  {
    src: "/Documentation - 2023/P2S1-20.JPG",
    name: "Certificate Design",
    alt: "Certificate Design",
  },
  {
    src: "/Documentation - 2023/P2S1-21.JPG",
    name: "Class Choir Battle",
    alt: "Class Choir Battle",
  },
  {
    src: "/Documentation - 2023/P2S1-23.JPG",
    name: "Business Idea",
    alt: "Business Idea",
  },
  {
    src: "/Documentation - 2023/P2S1-24.JPG",
    name: "Battle of Brains",
    alt: "Battle of Brains",
  },
  {
    src: "/Documentation - 2023/P2S1-25.JPG",
    name: "Basketball",
    alt: "Basketball",
  },
  {
    src: "/Documentation - 2023/P2S1-26.JPG",
    name: "Badminton",
    alt: "Badminton",
  },
];
const SLIDE_INTERVAL = 5000;
const Slideshow = () => {
  const [index, setIndex] = useState(0);
  const [handle, setHandle] = useState<any>(null);

  const destroyIntervalTimer = () => {
    clearInterval(handle);
    setHandle(null);
  };

  const createIntervalTimer = () => {
    destroyIntervalTimer();
    setHandle(
      setInterval(
        () => setIndex((i) => (i + 1) % slides.length),
        SLIDE_INTERVAL
      )
    );
  };

  const handleSlideSelect = (idx: any) => {
    createIntervalTimer();
    setIndex(idx);
  };

  useEffect(() => {
    createIntervalTimer();
    return destroyIntervalTimer;
  }, []);

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        {slides.map((e, i) => (
          <div key={i} className={`slide${index === i ? " active" : ""}`}>
            <div className="slide-numbertext">
              {i + 1} / {slides.length}
            </div>
            <Image src={e.src} alt={e.alt} layout="fill" unoptimized />
            <p className="slide-caption">{e.name}</p>
          </div>
        ))}
      </div>

      <div className="slide-dots">
        {slides.map((e, i) => (
          <span
            onClick={() => handleSlideSelect(i)}
            key={e.name}
            className={`slide-dot${i === index ? " active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
