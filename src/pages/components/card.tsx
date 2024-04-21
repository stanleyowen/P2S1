import React from "react";
import Image from "next/image";

const Cards = () => {
  return (
    <div className="cards">
      <div className="card">
        <div className="card-image">
          <Image
            src="https://p2s1-cdn.netlify.app/.netlify/images?url=2024/Logo P2S1.png"
            alt="P2S1 Logo"
            layout="fill"
            unoptimized
          />
        </div>
        <div className="card-text">
          <h1>P2S1 XXVII</h1>
          <h1>2024</h1>
          <p className="text-justify">
            The 26th P2S1 started on the first week of January and ended on the
            first week of March. A total of 48 competitions were held in this
            event involving a whopping 1609 participants.
          </p>
          <a href="2023">Participations Information</a>
        </div>
      </div>

      <div className="card">
        <div className="card-image">
          <Image
            src="https://p2s1-cdn.netlify.app/.netlify/images?url=2023/Logo P2S1.png"
            alt="P2S1 Logo"
            layout="fill"
            unoptimized
          />
        </div>
        <div className="card-text">
          <h1>P2S1 XXVI</h1>
          <h1>2023</h1>
          <p className="text-justify">
            The 26th P2S1 started on the first week of January and ended on the
            first week of March. A total of 48 competitions were held in this
            event involving a whopping 1609 participants.
          </p>
          <a href="2023">Participations Information</a>
        </div>
      </div>
    </div>
  );
};

export default Cards;
