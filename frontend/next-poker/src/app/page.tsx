"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import {Logo} from "@/components/features/start/Logo";

export default function Home() {
  return (
    <div className={`relative min-h-screen bg-cover bg-center w-full h-full ${styles.bgScrollX}`}
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>

      <Logo />
        
      <div className="absolute bottom-0 left-0 z-0">
          <Image
          src="/light.svg"
          alt="Poker"
          width={700}
          height={700
          }
          />
      </div>
        
    </div>
  );
}