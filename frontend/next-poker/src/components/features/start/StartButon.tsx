import Image from 'next/image';
import { useState } from "react";
import { Modal } from '@/components/shared/Modal';
import { OperationInstructions } from './OperationInstructions';
import { LoginModalContent } from './LoginModalContent';
import { Qr } from './Qr';
import { Stanby } from './Standby';

export function StartButton() {
    const [modalType, setModalType] = useState<"login" | "operation" | "Qr" | "standby" | null>(null);

    return (
        <>
            <button
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 
                hover:cursor-pointer hover:scale-125 transition-transform duration-500"
                onClick={() => setModalType("login")}
            >
                <Image
                    src="/start/StartButton.png"
                    alt="start-button"
                    width={400}
                    height={100}
                />
            </button>

            <Modal isOpen={modalType === "login"} onClose={() => setModalType(null)} >
                <LoginModalContent
                    onGuestPlay={() => setModalType("operation")}
                    onLogin={() => {
                        setModalType("Qr");
                    }}
                />
            </Modal>

            <Modal isOpen={modalType === "operation"} onClose={() => setModalType("login")} >
                <OperationInstructions 
                    onComplete={() => setModalType("standby")}
                />
            </Modal>

            <Modal isOpen={modalType === "Qr"} onClose={() => setModalType("login")} >
                <Qr />
            </Modal>

            <Modal isOpen={modalType === "standby"} onClose={() => setModalType("login")} >
                <Stanby />
            </Modal>

            

        </>
    );
}