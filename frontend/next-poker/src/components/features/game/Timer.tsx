
"use client";

import { useEffect, useState } from "react";

const INITIAL_SECONDS = 5 * 60;

export function Timer() {
    const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

    useEffect(() => {
        if (secondsLeft <= 0) return;

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft]);

    const minutes = Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");

    return (
        <div className="w-[191px] h-22 bg-[linear-gradient(135deg,#7A5C2E_0%,#C59D4D_35%,#FFF3B0_55%,#C59D4D_80%,#7A5C2E_100%)] rounded-3xl p-2">
            <div className="flex items-center justify-center bg-linear-to-r from-[#000000] via-[#290106] to-[#000000] text-white rounded-2xl w-full h-full text-5xl dseg">
                <p>
                    {minutes}:{seconds}
                </p>
            </div>
        </div>
    );
}