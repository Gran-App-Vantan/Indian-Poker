"use client";
import { useRef, useEffect, useState } from "react";

export type ModalProps = {
    size:"normal"|"large";
    openModal: boolean;
    children:React.ReactNode;
    onClose: () => void;
};

export function Modal ({size,openModal,children,onClose}:ModalProps) {



    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center
        transition-all duration-300 ease-out transform bg-black/65 ">
            <dialog 
                open={openModal}
                className={`flex items-center justify-center m-auto p-4
                gradation-red  rounded-modal overflow-hidden  bg-black/80 
                ${
                    size === "normal"
                    ? "w-[865px] h-[541px]"
                    : "w-[989px] h-[639px]"
                }`}>
                {children}
            </dialog>
        </div>
    )
}