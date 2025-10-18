"use client";
import React from "react";

export function Stanby() {
    const standby = ["待機中...", "準備OK"];

    return (
        <div className="relative flex flex-col justify-center items-center w-full h-full">
            <button
                className="flex justify-center items-center w-48 h-20
                        bg-white/40 rounded-2xl font-black text-white text-3xl
                        absolute bottom-10"
            >
                <p>{standby[0]}</p>
            </button>
        </div>
);
}