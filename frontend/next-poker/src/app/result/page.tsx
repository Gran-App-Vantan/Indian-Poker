"use client";

import { ResultCard } from "@/components/features/result/ResultCard";
import Link from "next/link";

export default function Result() {
    return (
        <div className="bg-[url('/bg-img/GamePageBg.png')] bg-no-repeat bg-cover bg-center min-h-screen">
            <div className="relative bg-black/90 min-h-screen flex flex-col items-center justify-center">
                <div className="absolute top-0 flex items-center justify-start w-full h-20 bg-[url('/game/ResultHeaderBg.svg')] bg-no-repeat bg-cover bg-center">
                    <p className="pl-10 text-white text-4xl font-bold">リザルト</p>
                </div>
                    <ResultCard />

                <button className="absolute bottom-10 flex items-center justify-center w-58 h-22 text-white text-2xl font-bold bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#C59D4D] rounded-2xl p-2 hover:scale-110 transition-transform duration-500">
                    <p className="flex items-center justify-center w-full h-full bg-linear-to-b from-[#CF5056] via-[#500407] to-[#CF5056] rounded-2xl font-bold">
                        <Link href="/">
                        タイトルへ戻る
                        </Link>
                    </p>
                </button>
            </div>
        </div>
    );
}