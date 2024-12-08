import React from "react";
import Head from "next/head";
// import { Inter } from 'next/font/google'
import Header from "./components/header";
import Slideshow from "./components/slideshow";
import About from "./components/about";
import Cards from "./components/card";
import slides from "./2024/slideshow.json";

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Pekan Prestasi Sutomo 1</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <Header />
      <Slideshow slides={slides} />
      <About />
      <Cards />
    </>
  );
}
