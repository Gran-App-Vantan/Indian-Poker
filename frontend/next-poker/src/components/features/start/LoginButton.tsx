import { useState } from "react";
import { OperationInstructions } from "./OperationInstructions";
import { Modal } from "@/components/shared/Modal";

export function LoginButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex justify-center items-center gap-10 
            font-sans text-2xl font-black"
        >

            <button className="flex  justify-center items-center w-72 h-72 
            BgGray rounded-custom text-outline
            hover:cursor-pointer hover:scale-110 transition-transform duration-500"
            onClick={() => setIsOpen(true)}
            >
                <p className="text-white  drop-shadow-xl">ゲストとしてプレイ</p>
            </button>

            <button className=" flex  justify-center items-center w-72 h-72
            BgRed   rounded-custom 
            hover:cursor-pointer hover:scale-110 transition-transform duration-500"
            >
                <p className="text-white drop-shadow-xl">ログインしてプレイ</p>
            </button>

            {isOpen && (
                <Modal
                    size="large"
                    openModal={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                <OperationInstructions />
                </Modal>
            )}
        </div>
    );
}