import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";

const SLIDE_INTERVAL = 5000;

type Slide = {
  src: string;
  name: string;
  alt: string;
};

const Slideshow: React.FC<{
  slides: Slide[];
}> = ({ slides }) => {
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
        {slides
          ? slides.map((e, i) => (
              <div key={i} className={`slide${index === i ? " active" : ""}`}>
                <div className="slide-numbertext">
                  {i + 1} / {slides.length}
                </div>
                <Image src={e.src} alt={e.alt} layout="fill" unoptimized />
                <p className="slide-caption">{e.name}</p>
              </div>
            ))
          : null}
      </div>

      <div className="slide-dots">
        {slides
          ? slides.map((e, i) => (
              <span
                onClick={() => handleSlideSelect(i)}
                key={e.name}
                className={`slide-dot${i === index ? " active" : ""}`}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Slideshow;
