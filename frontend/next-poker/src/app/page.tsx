"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Logo } from "@/components/features/start/Logo";
import { StartButton } from "@/components/features/start/StartButon";
import { Login, CreateTokenUrl } from "@/api/auth";

export default function Home() {
  const [data, setData] = useState({});

  const deviceNumber = 1; // TODO: localStorageでパソコンごとに数字を設定

  useEffect(() => {
    const login = async () => {
      try {
        const response = await Login(deviceNumber);

        if (!response.success) {
          console.error("ログインに失敗しました");
          return;
        }

        Cookies.set("authToken", response.authToken);
        
        await createTokenUrl();
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    const createTokenUrl = async () => {
      try {
        const response = await CreateTokenUrl({
          deviceNumber: deviceNumber,
          gameType: "IndianPoker"
        });

        if (response.success) {
          setData(response.data);
        } else {
          console.error("トークンURLの作成に失敗しました");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    }
    
    login();
  }, []);

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