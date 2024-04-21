import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [headerExpanded, setheaderExpanded] = useState<boolean>(false);
  useEffect(() => {
    setScreenWidth(document.documentElement.clientWidth);
    window.addEventListener("resize", () =>
      setScreenWidth(document.documentElement.clientWidth)
    );
    if (process.env.NODE_ENV === "production") {
      const script = document.createElement("script");
      script.innerHTML = `if (location.protocol !== 'https:') {
    window.location.replace('https://' + location.hostname + location.pathname + location.search);
}`;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="header">
      <div className="header-main">
        <div className="header-logo">
          <Image
            src="https://p2s1-cdn.netlify.app/.netlify/images?url=2024//Logo%20P2S1.png"
            alt="P2S1 logo"
            layout="fill"
            unoptimized
          />
        </div>
        <Link href="/" className="header-name">
          Pekan Prestasi Sutomo 1
        </Link>
      </div>
      <span className="header-ham" onClick={() => setheaderExpanded(true)}>
        ☰
      </span>
      <div
        className="header-menu"
        style={headerExpanded ? { width: "100%" } : {}}
      >
        <span
          className="header-exit-menu"
          onClick={() => setheaderExpanded(false)}
        >
          ×
        </span>
        <Link href="/">About</Link>
        <Link href="/2024">P2S1 XXVII - 2024</Link>
      </div>
    </div>
  );
};
export default Header;
