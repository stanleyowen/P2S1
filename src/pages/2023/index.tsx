import React from "react";
import Head from "next/head";
import Header from "../components/header";
import Slideshow from "../components/slideshow";
import Statistic from "../components/statistics";
import About2023P2S1 from "./about";
import SearchBar from "./search";

const twothousandtwentythree = () => {
  return (
    <>
      <Head>
        <title>Pekan Prestasi Sutomo 1 XXVI - 2023</title>
      </Head>
      <Header />
      <Slideshow />
      <About2023P2S1 />
      <Statistic />
      <SearchBar />
    </>
  );
};

export default twothousandtwentythree;
