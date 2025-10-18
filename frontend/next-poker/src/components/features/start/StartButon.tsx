import Image from 'next/image';
import { useState } from "react";
import { Modal } from '@/components/shared/Modal';
import { LoginButton } from "@/components/features/start/LoginButton";

export function StartButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 
                hover:cursor-pointer hover:scale-125 transition-transform duration-500"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src="/start/StartButton.png"
                    alt="start-button"
                    width={400}
                    height={100}
                />
            </button>

            {isOpen && (
                <Modal
                    size="normal"
                    openModal={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <LoginButton />
                </Modal>
            )}
        </div>
    );
}