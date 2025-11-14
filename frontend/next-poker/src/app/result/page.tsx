"use client";

import { ResultCard } from "@/components/features/result/ResultCard";
import { useGameResult } from "@/contexts/GameResultContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Result() {
    const router = useRouter();
    const { result, clearResult } = useGameResult();
    const [deviceNumber, setDeviceNumber] = useState<number | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const deviceNumberFromUrl = params.get("deviceNumber");
        const storedDeviceNumber = sessionStorage.getItem("deviceNumber");
        
        if (deviceNumberFromUrl) {
            setDeviceNumber(parseInt(deviceNumberFromUrl, 10));
        } else if (storedDeviceNumber) {
            setDeviceNumber(parseInt(storedDeviceNumber, 10));
        }

        // 結果データがない場合の処理
        if (!result) {
            console.warn("結果データがありません。タイトルに戻ります。");
            router.push("/");
        }
    }, [result, router]);

    const handleBackToTitle = () => {
        clearResult();
        router.push("/");
    };

    const totalLatch = result?.ranking.reduce((sum, rank) => sum + rank.latch, 0) || 0;

    return (
        <div className="bg-[url('/bg-img/GamePageBg.png')] bg-no-repeat bg-cover bg-center min-h-screen">
            <div className="relative bg-black/90 min-h-screen flex flex-col items-center justify-center">
                <div className="absolute top-0 flex items-center justify-start w-full h-20 bg-[url('/game/ResultHeaderBg.svg')] bg-no-repeat bg-cover bg-center">
                    <p className="pl-10 text-white text-4xl font-bold">リザルト</p>
                </div>
                
                {result ? (
                    <ResultCard result={result} deviceNumber={deviceNumber} />
                ) : (
                    <div className="text-white text-2xl">
                        結果を読み込み中...
                    </div>
                )}

                <div className="relative top-17 flex text-white text-3xl font-bold gap-20">
                    <h2>獲得ポイント</h2>
                    <div className="flex gap-6">
                        <Image 
                            src="/game/chip_icon1.svg"
                            width={32}
                            height={32}
                            alt=""
                        />
                        <p className="">
                            + {totalLatch}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={handleBackToTitle}
                    className="absolute bottom-10 flex items-center justify-center w-58 h-22 text-white text-2xl font-bold bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#C59D4D] rounded-2xl p-2 hover:scale-110 transition-transform duration-500"
                >
                    <p className="flex items-center justify-center w-full h-full bg-linear-to-b from-[#CF5056] via-[#500407] to-[#CF5056] rounded-2xl font-bold">
                        タイトルへ戻る
                    </p>
                </button>
            </div>
        </div>
    );
}