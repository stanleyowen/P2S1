import React from "react";
import Head from "next/head";
import Header from "../components/header";
import Slideshow from "../components/slideshow";
import Statistic from "../components/statistics";
import About2024P2S1 from "./about";
import SearchBar from "./search";
import slides from "./slideshow.json";

const twothousandtwentyfour = () => {
  return (
    <>
      <Head>
        <title>Pekan Prestasi Sutomo 1 XXVII - 2024</title>
      </Head>
      <Header />

      <Slideshow slides={slides} />
      <About2024P2S1 />
      <Statistic
        value={{
          participants: 1609,
          competitions: 48,
          participations: 3197,
        }}
      />
      <SearchBar />
    </>
  );
};

export default twothousandtwentyfour;
