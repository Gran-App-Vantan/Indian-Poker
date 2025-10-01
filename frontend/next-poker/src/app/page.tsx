"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-scroll-x w-full h-full"
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>

        <div className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Poker"
              width={1000}
              height={1000}
              />
        </div>

    </div>
  );
}