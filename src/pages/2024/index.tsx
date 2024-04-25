import React from "react";
import Head from "next/head";
import Header from "../components/header";
import Slideshow from "../components/slideshow";
import Statistic from "../components/statistics";
import About2024P2S1 from "./about";
import SearchBar from "./search";
import slides from "./slideshow.json";
import data from "./Rekap Final Data P2S1.json";

const twothousandtwentyfour = () => {
  const participations = data.length;
  const participants = new Set(data.map((item) => item["STUDENT ID"])).size;
  const competitions = data.filter(
    (item, idx, self) =>
      idx === self.findIndex((t) => t["COMPETITION"] === item["COMPETITION"])
  ).length;

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
          participants,
          competitions,
          participations,
        }}
      />
      <SearchBar />
    </>
  );
};

export default twothousandtwentyfour;
