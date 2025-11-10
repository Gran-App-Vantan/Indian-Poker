"use client";

import Image from "next/image";
import {useState} from "react";
import { Timer } from "@/components/features/game/Timer";
import { Button } from "@/components/features/game/Button";
import { ChangeCard } from "@/components/features/game/ChangeCard";
export default function Game() {
    const [showOverlay, setShowOverlay] = useState(false);

    const handleClick = () => {
        setShowOverlay(true);
    };

    const handleClose = () => {
        setShowOverlay(false); 
    };

    return (
        <div className="flex items-center justify-center relative w-screen h-screen  bg-[url('/bg-img/GamePageBg.png')] bg-no-repeat bg-cover bg-center">
                <div className="absolute top-10  left-10 z-50">
                    <Timer />
                </div>

                <div className="flex flex-col items-center gap-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex flex-col items-center justify-center w-40 h-40 bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E] rounded-full">
                        <Image
                            src="/game/yuma.png"
                            width={140}
                            height={140}
                            alt="UserIcon"
                            className="rounded-full"
                        />
                    </div>
                    <p className="text-white text-4xl font-bold">Usename (1P)</p>
                </div>

                <div className="flex gap-5 absolute bottom-10 right-10">
                    <Button variant="decision"/>
                    <Button variant="change" onClick={handleClick}/>
                </div>
                {showOverlay && (
                    <div className="fixed inset-0 flex flex-col gap-28 items-center justify-center bg-black/80 min-h-screen z-40 text-white text-5xl font-bold">
                        <p>カード選択してください</p>
                        <ChangeCard />
                        <p>残りの変更 n回</p>

                        <div className="flex gap-5 absolute bottom-10 right-10">
                            <Button variant="stop" onClick={handleClose}/>
                            <Button variant="Confirmedtochange" onClick={handleClose}/>
                        </div>
                    </div>
                )}
        </div>
    );
}