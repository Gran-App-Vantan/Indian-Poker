"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import { useEffect, useState } from "react";
import { Logo } from "@/components/features/start/Logo";
import { StartButton } from "@/components/features/start/StartButon";
import { CreateTokenUrl } from "@/api/auth/createTokenUrl";

export default function Home() {
  const [data, setData] = useState({});

  const deviceNumber = 1; // TODO: localStorageでパソコンごとに数字を設定

  useEffect(() => {
    const createToken = async () => {
      const response = await CreateTokenUrl({
        deviceNumber: deviceNumber,
        gameType: "IndianPoker",
      });

      if (response.success) {
        setData(response.data);
      }
    }
    
    createToken();
  }, [])

  console.log(data);

  return (
    <div className={`relative min-h-screen bg-cover bg-center  ${styles.bgScrollX}`}
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>

      <Logo />
        
      <div className={`absolute bottom-25 left-0 z-0  ${styles.swingImageLeft }`}>
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