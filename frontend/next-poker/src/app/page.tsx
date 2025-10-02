"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import {Logo} from "@/components/features/start/Logo";
import { StartButton } from "@/components/features/start/StartButon";

export default function Home() {
  return (
    <div className={`relative min-h-screen bg-cover bg-center  ${styles.bgScrollX}`}
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>

      <Logo />
        
      <div className={`absolute bottom-25 left-0 z-0 ${styles.swingImageLeft }`}>
          <Image
          src="/start/LightLeft.svg"
          alt="light-left"
          width={700}
          height={700}
          />
      </div>

      <div className={`absolute bottom-25 right-0 z-0 overflow-hidden ${styles.swingImageRight }`}>
          <Image
          src="/start/LightRight.svg"
          alt="light-right"
          width={700}
          height={700}
          />
      </div>

      <StartButton />
        
    </div>
  );
}